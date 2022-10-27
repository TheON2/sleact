import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../../output/entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {
  // @ApiProperty({
  //   example: 'zeroch0@gamil.com',
  //   description: '이메일',
  //   required: true,
  // })
  // public email: string;
  //
  // @ApiProperty({
  //   example: '제로초',
  //   description: '닉네임',
  //   required: true,
  // })
  // public nickname: string;
  //
  // @ApiProperty({
  //   example: 'nodejsbook',
  //   description: '비밀번호',
  //   required: true,
  // })
  // public password: string;
}
