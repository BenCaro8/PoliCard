#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

import 'dotenv/config';

const ECR_REGISTRY = process.env.ECR_REGISTRY;
const IMAGE_TAG = process.env.IMAGE_TAG;

const parseEnvVariable = (input: string) => {
  const REGEX = /\$\{([A-Z0-9_]+)(?::([+-])([^\}]+))?\:?\-?\}/g;
  let parsed = input;
  while (parsed.match(REGEX)?.length) {
    parsed = parsed.replace(REGEX, (_, variable, operator, fallback) => {
      const value = process.env[variable];
      if (operator === '+') {
        return value ? fallback : '';
      }
      if (operator === '-') {
        return value || fallback || '';
      }
      return value || '';
    });
  }
  return parsed;
};

export class DockerComposeToEcsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Parse docker-compose.yml
    const composeFilePath = path.join(
      __dirname,
      '../../docker/docker-compose.yml',
    );
    const composeContent = fs.readFileSync(composeFilePath, 'utf-8');
    const composeConfig = yaml.parse(composeContent);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    });

    const namespace = new servicediscovery.PrivateDnsNamespace(
      this,
      'Namespace',
      {
        name: 'local',
        vpc,
      },
    );

    // Create an ECS Cluster
    const cluster = new ecs.Cluster(this, 'AppCluster', {
      vpc,
    });

    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy',
        ),
      ],
    });

    const instanceRole = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    instanceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ecs:ExecuteCommand'],
        resources: ['*'],
      }),
    );

    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc: cluster.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.SMALL,
      ),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      minCapacity: 1,
      role: instanceRole,
    });

    // Attach the managed policy with necessary permissions
    taskExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );

    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'AmazonSSMManagedInstanceCore',
      ),
    );

    const capacityProvider = new ecs.AsgCapacityProvider(
      this,
      'AsgCapacityProvider',
      {
        autoScalingGroup,
      },
    );

    cluster.addAsgCapacityProvider(capacityProvider);

    const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic',
    );

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic',
    );

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'AppALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
    });

    const httpListener = loadBalancer.addListener('HttpListener', {
      port: 80,
      open: true,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'MyHostedZone', {
      domainName: 'ben-caro.com',
    });

    new route53.ARecord(this, 'ALBAliasRecord', {
      zone: hostedZone,
      recordName: 'pocketnaut.ben-caro.com',
      target: route53.RecordTarget.fromAlias(
        new route53Targets.LoadBalancerTarget(loadBalancer),
      ),
      deleteExisting: true,
    });

    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'EcsSecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    // Allow traffic from the GraphQL service to Gemini
    ecsSecurityGroup.addIngressRule(
      ecsSecurityGroup, // Allow traffic from within the same security group
      ec2.Port.tcp(5000),
      'Allow traffic from GraphQL to Gemini',
    );

    // Loop through services in docker-compose.yml
    Object.entries(composeConfig.services).forEach(
      ([serviceName, serviceConfig]: [string, any]) => {
        const image = `${ECR_REGISTRY}/${serviceName}:${IMAGE_TAG}`;
        const environment = Object.entries(
          serviceConfig.environment || {},
        ).reduce(
          (acc, [key, value]) => {
            acc[key] = parseEnvVariable(value as string);
            return acc;
          },
          {} as Record<string, string>,
        );

        const taskDefinition = new ecs.Ec2TaskDefinition(
          this,
          `${serviceName}-TaskDef`,
          {
            executionRole: taskExecutionRole,
            networkMode: ecs.NetworkMode.AWS_VPC,
          },
        );

        const container = taskDefinition.addContainer(
          `${serviceName}-Container`,
          {
            image: ecs.ContainerImage.fromRegistry(image),
            memoryLimitMiB: serviceName === 'graphql' ? 1280 : 512,
            environment,
            logging: new ecs.AwsLogDriver({ streamPrefix: serviceName }),
          },
        );

        if (serviceConfig.ports) {
          serviceConfig.ports.forEach((port: string) => {
            const containerPort = Number(port.split(':').pop());
            container.addPortMappings({ containerPort });
          });
        }

        const service = new ecs.Ec2Service(this, serviceName, {
          cluster,
          taskDefinition,
          desiredCount: 1,
          cloudMapOptions: {
            name: serviceName,
            cloudMapNamespace: namespace,
          },
          securityGroups: [ecsSecurityGroup],
        });

        if (serviceName === 'graphql') {
          httpListener.addTargets(`${serviceName}Targets`, {
            port: 80,
            targets: [service],
            healthCheck: {
              path: '/health',
              interval: cdk.Duration.seconds(30),
              timeout: cdk.Duration.seconds(5),
              healthyHttpCodes: '200',
            },
          });
        }
      },
    );
  }
}

const app = new cdk.App();
new DockerComposeToEcsStack(app, 'PocketnautStack', {
  terminationProtection: false,
  env: { account: '339712859667', region: 'us-east-1' },
});
app.synth();
