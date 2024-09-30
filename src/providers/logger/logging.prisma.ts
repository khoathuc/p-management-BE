import { Injectable } from "@nestjs/common";
import { createLogger } from "@providers/logger/winston/winston.config";

@Injectable()
export class PrismaLogging {

    async logQuery(params: any, next: any) {
    
        const logger = createLogger('database.log'); 
        const now = Date.now();
        
        try {
            const result = await next(params);
            logger.info({
                message: 'Executed database query',
                model: params.model,
                action: params.action,
                duration: `${Date.now() - now}ms`,
                args: params.args ? JSON.stringify(params.args) : 'No arguments',
            });

            return result;
        } catch (error) {
            logger.error({
                message: 'Failed database query',
                model: params.model,
                action: params.action,
                duration: `${Date.now() - now}ms`,
                error: error.message,
                args: params.args ? JSON.stringify(params.args) : 'No arguments',
            });

            throw error;
        }
    }
}
