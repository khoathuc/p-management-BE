import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor 
} from "@nestjs/common";
import { UsersService } from "@modules/users/users.service";
import { Observable, tap, catchError, throwError } from "rxjs";
import { createLogger } from "./winston/winston.config";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(private readonly usersService: UsersService) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>
    ): Observable<any> | Promise<Observable<any>> {

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const userAgent = request.get('user-agent') || '';
        const { ip, method, path: url } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap((res) => {
                const logger = createLogger('req.log');
                logger.info({
                    message: `Response: ${method} ${url}`,
                    context: context.getClass().name,
                    statusCode,
                    userAgent,
                    ip,
                    duration: `${Date.now() - now}ms`,
                    trace: res || null,
                });
            }),
            catchError((err) => {
                const logger = createLogger('error.log');

                logger.error({
                    message: `Error occurred during request: ${method} ${url}`,
                    context: context.getClass().name,
                    statusCode,
                    userAgent,
                    ip,
                    duration: `${Date.now() - now}ms`,
                    errorMessage: err.message || 'Unknown error',
                });

                return throwError(() => err);
            }),

        )
    }
}