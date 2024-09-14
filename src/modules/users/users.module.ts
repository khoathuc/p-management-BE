import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersModel } from './users.model';

@Module({
  providers: [UsersService, UsersModel],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
