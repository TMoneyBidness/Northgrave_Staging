#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StagingStack } from '../lib/stacks/staging-stack';
import { ProductionStack } from '../lib/stacks/production-stack';
import { AuthStack } from '../lib/stacks/auth-stack';

const app = new cdk.App();

// Environment configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1', // Required for CloudFront certificates
};

// Domain configuration
const stagingDomain = 'staging.northgrave.com';
const productionDomain = 'northgrave.com';

// Staging Stack
new StagingStack(app, 'NorthgraveStagingStack', {
  env,
  description: 'Northgrave Studios staging environment',
  domainName: stagingDomain,
});

// Production Stack
new ProductionStack(app, 'NorthgraveProductionStack', {
  env,
  description: 'Northgrave Studios production environment',
  domainName: productionDomain,
});

// Auth Stack (shared between staging and production)
new AuthStack(app, 'NorthgraveAuthStack', {
  env,
  description: 'Northgrave Studios vault authentication',
});
