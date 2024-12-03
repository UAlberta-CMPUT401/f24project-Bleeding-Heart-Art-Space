import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NODE_ENV, DOMAIN, PORT } from '@config/env';
import { logger } from '@utils/logger';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import cors from 'cors';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cron from 'node-cron';
import { ShiftSignupService } from '@features/shiftSignup/shiftSignup.service'

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public apiSpecPath = path.join(__dirname, 'docs', 'api-spec.yaml');
  private shiftSignupService: ShiftSignupService;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.shiftSignupService = new ShiftSignupService(); 

    this.initializeFirebaseSDK();
    this.initializeMiddlewares();

    this.initializeRoutes(routes);
    // serve react in production
    if (NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, 'dist')))
      this.app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }

    this.initializeErrorHandling(); // Add error-handling middleware
    this.initializeCronJobs();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.debug(`Server is running at http://localhost:${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
    if (NODE_ENV === 'development' || DOMAIN === undefined) {
      this.app.use(cors());
    }
    const swaggerDocument = YAML.load(this.apiSpecPath);
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private initializeRoutes(routes: Routes[]) {
    
    routes.forEach(route => {
      this.app.use('/api', route.router);
      logger.info(`Initializing route at path: ${route.path}`);
    });
  }

  private initializeCronJobs() {
    logger.info('Starting cron job for aut-checkout every 5 minutes');
    cron.schedule('*/1 * * * *', async () => {
      logger.info('Running auto-checkout cron job...');
      try{
        await this.shiftSignupService.autoCheckOut();
        logger.info('Auto-checkout cron job completed');
      } catch (error){
        logger.error('Error running auto-checkout cron job', error);
      }
    })
  }
  private initializeFirebaseSDK() {
    initializeApp({
      credential: applicationDefault(),
    });
  }

  // Global error handling middleware
  private initializeErrorHandling() {
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      
      // Log the error (you can customize this as needed)
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

      // Send the error response
      res.status(status).json({ message });
    });
  }
}
