import { Request, Response, NextFunction } from "express";
import { logger } from "@utils/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Request', {
    method: req.method,
    url: req.url,
  });

  res.on('finish', () => {
    logger.info('Response', {
      status: res.statusCode,
    });
  });

  next();
}
