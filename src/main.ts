declare const module: any;

import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configSwagger } from "@common/swagger/swagger.config";
import { TransformInterceptor } from "@interceptors/response.interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger config
  configSwagger(app);

  //global interceptors
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

  // Enable CORS for all origins
  app.enableCors();

  // app.use(
  //     session({
  //         secret: process.env.SECRET_SESSION,
  //         saveUninitialized: false,
  //         resave: false,
  //         cookie: {
  //             maxAge: 60*60*1000*24*365,
  //         }
  //     })
  // );
  // app.use(passport.initialize()); // Initializes Passport for authentication
  // app.use(passport.session()); // Middleware that enables persistent login sessions

  await app.listen(process.env.PORT);

  //hot reload configs
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
