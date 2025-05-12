import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    public signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto);
    }
}
