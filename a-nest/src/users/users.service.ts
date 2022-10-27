import { HttpException, Injectable } from '@nestjs/common';
import { Users } from '../output/entities/Users';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  getUser() {}

  async postUsers(email: string, nickname: string, password: string) {
    if (!email) {
      throw new HttpException('이메일이 없어요', 400);
    }

    if (!nickname) {
      throw new HttpException('닉네임이 없어요', 400);
    }

    if (!password) {
      throw new HttpException('비번이 없어요', 400);
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new Una('이미 존재하는 사용자입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
