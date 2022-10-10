import { Controller, Get, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
  @Get(':id/chats')
  getChat(@Query() query) {
    console.log(query.perPage, query.page);
  }
  @Post(':id/chats')
  postChat() {}
}
