import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { format } from "date-fns";
import { Response } from "@interfaces/interfaces";
import { Reflector } from "@nestjs/core";
import { RESPONSE_MESSAGE_METADATA } from "@decorators/response.message.decorator";

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
	constructor(private reflector: Reflector) {}
	
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            catchError((err) =>
                throwError(() => this.errorHandler(err, context))
            )
        );
    }

    errorHandler(exception, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status: number;
        let message: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else {
            // Handle non-HttpException errors
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'An unexpected error occurred';
        }
        
        response.status(status).json({
            status: false,
            statusCode: status,
            path: request.url,
            message: message,
            timestamp: format(new Date().toISOString(), "yyyy-MM-dd HH:mm:ss"),
        });
    }

    responseHandler(res: any, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = response.statusCode;
		const message =
		this.reflector.get<string>(
		  RESPONSE_MESSAGE_METADATA,
		  context.getHandler(),
		) || 'success';

        return {
            status: true,
            path: request.url,
            statusCode,
			message: message,
            data: res,
            timestamp: format(new Date().toISOString(), "yyyy-MM-dd HH:mm:ss"),
        };
    }
}
