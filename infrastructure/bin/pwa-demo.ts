#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { ApiStack } from '../lib/api-stack';
import { DataStack } from '../lib/data-stack';

const app = new cdk.App();
const { authRole, unauthRole } = new AuthStack(app, 'PWADemoAuthStack');
const { database } = new DataStack(app, 'PWADemoDataStack');
new ApiStack(app, 'PWADemoApiStack', {
  authRole,
  unauthRole,
  database,
});
