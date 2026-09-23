import express from 'express';
import { type Application } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '@repo/zod-schemas/environment/environments.z.js';
import { globalErrorHandler } from 'controller/error/error.master.controller.js';
import cors from 'cors';
import { corsOptions } from '@constants/cors.options.js';

import tradingRouter from 'routes/trading.routes.js';
import walletRouter from 'routes/wallet.routes.js';
import { mutualFundRouter } from 'routes/mutualFund.routes.js';
import { userRouter } from 'routes/user.route.js';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));

console.log(`API Base Endpoint: ${env.BASE_API_ENDPOINT}`);
console.log(`${env.BASE_API_ENDPOINT}/mutual-funds`);

// API routes
app.use(env.BASE_API_ENDPOINT, userRouter);
app.use(`${env.BASE_API_ENDPOINT}/mutual-funds`, mutualFundRouter);
app.use(`${env.BASE_API_ENDPOINT}/trading`, tradingRouter);
app.use(`${env.BASE_API_ENDPOINT}/wallet`, walletRouter);
app.get('/test', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working fine',
  });
});

app.use(globalErrorHandler);

export { app };
