import { Module, ValidationPipe } from '@nestjs/common';
import { PrismaModule } from '@db/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PassportModule } from "@nestjs/passport";
import { WorkspaceModule } from '@modules/workspaces/workspaces.module';
import { AuthGuard } from '@guards/auth.guard';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    JwtModule,
    WorkspaceModule,
    PassportModule.register({ session: true })
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
