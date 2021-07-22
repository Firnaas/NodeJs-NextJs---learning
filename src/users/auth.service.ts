import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service"; 
import { Hash, randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        // check user exsist
        const isUserExsist = await this.userService.find(email);
        if(isUserExsist.length > 0) throw new BadRequestException('email in use');

        // Hash password
        // generate salt
        const salt = randomBytes(8).toString('hex');

        //hash the password and  salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Join the hash
        const result = salt + "." + hash.toString('hex');

        const user = await this.userService.create(email, result);

        return user;
    }

    async signIn(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user) throw new NotFoundException('email in use');

        const [salt, storedHash] = user.password.split('.');

        const newHash = (await scrypt(password, salt, 32)) as Buffer;
        
        if(storedHash !== newHash.toString('hex')) {
            throw new BadRequestException('bad password');        } 

        return user;

    }
}