import { Controller, Post, Body, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private auth: AuthService
    ) {}

    @Post('/signup')
    createUser(@Body() body: createUserDto) {
        return this.auth.signup(body.email, body.password);
    }

    @Post('/signin')
    signIn(@Body() body: createUserDto) {
        return this.auth.signIn(body.email, body.password);
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));

        if(!user) throw new NotFoundException('User not found');

        return user;
    }

    @Get()
    findAllUser(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }   

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
        return this.userService.update(parseInt(id), body)
    }

}
