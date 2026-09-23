/* eslint-disable */

import path, { join } from 'path';
import { fileURLToPath } from 'url';

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const secretsPath = join(dirname, '../../secrets');

async function loadSecretTesting() {
  const secretName = 'ai-mutual-fund-system__prod';

  const client = new SecretsManagerClient({
    region: 'us-east-1',
  });

  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT',
      })
    );
  } catch (error) {
    throw error;
  }

  const secret = response.SecretString;
  return secret;
}

export async function getEnvironmentConfig() {
  console.log(process.env.NODE_ENV);
  let envFilePath: string | undefined;
  let runTimeEnv: Record<string, any>;
  
  switch (process.env.NODE_ENV) {
    case 'production':
      //! Donot use this while deployment....
      envFilePath = join(secretsPath, '.env');
      runTimeEnv = process.env;
      //TODO : we have to load the env for production environment from AWS Secrets Manager
      break;

    case 'development':
      envFilePath = join(secretsPath, '.env.local');
      runTimeEnv = process.env;
      break;

    case 'testing':
      try {
        const secret = await loadSecretTesting();
        runTimeEnv = JSON.parse(secret!);
      } catch (error) {
        console.warn('Failed to load AWS secrets, using process.env:', error);
        runTimeEnv = process.env;
      }
      break;

    default:
      envFilePath = join(secretsPath, '.env.local');
      runTimeEnv = process.env;
      break;
  }

  return { envFilePath, runTimeEnv };
}
