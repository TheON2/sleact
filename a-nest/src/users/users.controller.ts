import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../common/dto/user.dto';
import { User } from '../common/decorators/user.decorator';
import { UndefineToNullInterceptor } from '../common/interceptors/undefineToNull.interceptor';

@UseInterceptors(UndefineToNullInterceptor)
@ApiTags('User')
@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    this.userService.postUsers(data.email, data.nickname, data.password);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connec.sid', { httpOnly: true });
    res.send('ok');
  }
}
