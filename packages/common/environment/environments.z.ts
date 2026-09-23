import { createInterfacialEnvironment } from '../conf/environment.conf.js';
import { getEnvironmentConfig } from '../paths/env.path.js';

const { envFilePath, runTimeEnv } = await getEnvironmentConfig();
console.log("EnvFile path : " , envFilePath , "runtime : " , runTimeEnv);

export const env = createInterfacialEnvironment(runTimeEnv, envFilePath);
