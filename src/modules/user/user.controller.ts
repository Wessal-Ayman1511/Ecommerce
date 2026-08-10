import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/DB/enums/user.enum';

@Controller('user')
export class UserController {
  @Get('/profile')
  @Roles(Role.USER)
  getProfile() {
    return 'Done!';
  }
}
