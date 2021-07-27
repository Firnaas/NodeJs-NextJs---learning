import { Controller, Post, Body, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from 'src/Guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private auth: AuthService
    ) {}

    // @Get('/whoami')
    // WhoAmI(@Session() session:any) {
    //     return this.userService.findOne(session.userId)
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    WhoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.auth.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signin')
    async signIn(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.auth.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
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
