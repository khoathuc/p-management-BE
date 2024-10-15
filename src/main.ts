declare const module: any;

import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configSwagger } from "@common/swagger/swagger.config";
import { TransformInterceptor } from "@interceptors/response.interceptors";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            credentials: true,
            origin: [
                process.env.FRONTEND_URL,
                ...(process.env.MAIN_URL ? [process.env.MAIN_URL] : []),
            ],
        },
    });

    // Swagger config
    configSwagger(app);

    // Global interceptors
    app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

    // Cookie parser
    app.use(cookieParser());

    await app.listen(process.env.PORT);

    //hot reload configs
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
