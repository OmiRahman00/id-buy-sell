import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}
    @Post('sign-in')
    @Auth(AuthType.None)
    @HttpCode(HttpStatus.OK)
    public signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto);
    }

    @Post('refresh-tokens')
    @Auth(AuthType.None)
    @HttpCode(HttpStatus.OK)
    public refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
