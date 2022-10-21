#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AuthStack } from '../lib/auth-stack';
import { ApiStack } from '../lib/api-stack';
import { DataStack } from '../lib/data-stack';

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_IDENTIFIER } = process.env;

if (!VAPID_PUBLIC_KEY) throw new Error('Missing VAPID_PUBLIC_KEY env var');
if (!VAPID_PRIVATE_KEY) throw new Error('Missing VAPID_PRIVATE_KEY env var');
if (!VAPID_IDENTIFIER) throw new Error('Missing VAPID_IDENTIFIER env var');

const app = new cdk.App();
const { authRole, unauthRole, userPool } = new AuthStack(app, 'PWADemoAuthStack');
const { database } = new DataStack(app, 'PWADemoDataStack');
new ApiStack(app, 'PWADemoApiStack', {
  userPool,
  authRole,
  unauthRole,
  database,
  vapidDetails: {
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
    identifier: VAPID_IDENTIFIER,
  },
});
