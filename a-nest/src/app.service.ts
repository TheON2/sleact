import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  async getHello() {
    return this.usersService.getUser();
    this.getWow();
    return process.env.SECRET;
  }

  async getWow() {}
}
