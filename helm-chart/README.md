# CommercialWebsite Helm Chart

This Helm chart deploys the CommercialWebsite monorepo application to Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

To install the chart with the release name `commercialwebsite`:

```bash
helm install commercialwebsite ./helm-chart
```

## Uninstalling the Chart

To uninstall/delete the `commercialwebsite` deployment:

```bash
helm delete commercialwebsite
```

## Configuration

The following table lists the configurable parameters of the CommercialWebsite chart and their default values.

### Basic Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Image repository | `339712859667.dkr.ecr.us-east-1.amazonaws.com/graphql` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `image.tag` | Image tag | `"latest"` |

### Service Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `service.type` | Kubernetes service type | `NodePort` |
| `service.port` | Service port | `4000` |
| `service.targetPort` | Container port | `4000` |
| `service.nodePort` | NodePort (if service.type is NodePort) | `30000` |

### Environment Variables

| Parameter | Description | Default |
|-----------|-------------|---------|
| `env.NODE_ENV` | Node environment | `"development"` |
| `env.LOCAL_ADDR` | Local address | `"http://localhost"` |
| `env.LOCAL_PORT` | Local port | `"4000"` |
| `env.GRAPHQL_ROUTE` | GraphQL route | `"/graphql"` |

### Secret Environment Variables

| Parameter | Description | Default |
|-----------|-------------|---------|
| `secrets.APPDATA_DB_URL` | Database URL | `""` |
| `secrets.APPDATA_DB_PASSWORD` | Database password | `""` |
| `secrets.GOOGLE_API_KEY` | Google API key | `""` |
| `secrets.AWS_ACCESS_KEY_ID` | AWS access key | `""` |
| `secrets.AWS_SECRET_ACCESS_KEY` | AWS secret key | `""` |

### Resources

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.limits.cpu` | CPU limit | `200m` |
| `resources.limits.memory` | Memory limit | `256Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |

## Examples

### Installing with custom values

Create a `values-prod.yaml` file:

```yaml
replicaCount: 3

env:
  NODE_ENV: "production"

secrets:
  APPDATA_DB_URL: "your-database-url"
  GOOGLE_API_KEY: "your-google-api-key"

ingress:
  enabled: true
  hosts:
    - host: commercialwebsite.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

Then install:

```bash
helm install commercialwebsite ./helm-chart -f values-prod.yaml
```

### Upgrading the deployment

```bash
helm upgrade commercialwebsite ./helm-chart
```

### Setting secrets via command line

```bash
helm install commercialwebsite ./helm-chart \
  --set secrets.GOOGLE_API_KEY="your-api-key" \
  --set secrets.APPDATA_DB_PASSWORD="your-db-password"
```
