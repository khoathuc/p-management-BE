import {
    MiddlewareConsumer,
    Module,
    NestModule,
    ValidationPipe,
} from "@nestjs/common";
import { PrismaModule } from "@db/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_PIPE } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { WorkspaceModule } from "@modules/workspaces/workspaces.module";
import { SessionMiddleware } from "./middleware/session.middleware";
import { ContextModule } from "@providers/context/context.module";

@Module({
    imports: [
        ContextModule,
        AuthModule,
        PrismaModule,
        UsersModule,
        JwtModule,
        WorkspaceModule,
        PassportModule.register({ session: true }),
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SessionMiddleware).exclude("auth/(.*)").forRoutes("*");
    }
}
