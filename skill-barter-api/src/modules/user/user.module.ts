import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
