import { Config, Service } from './slices/proxy';
import { ServiceTarget } from '@graphql';
import yaml from 'js-yaml';
import fs from 'fs';

export const getUnappliedServices = (
  serviceList1: Service[],
  serviceList2: Service[],
) => {
  if (serviceList1.length !== serviceList2.length) return false;
  return serviceList1.find(
    (service, index) => service.target !== serviceList2[index].target,
  );
};

export const getConfigs = () => {
  const readFile = yaml.load(fs.readFileSync('config.yaml', 'utf8')) as Config;
  return {
    ...readFile,
    services: readFile.services.map((config) => ({
      ...config,
      target: ServiceTarget.Remote,
    })),
  };
};
