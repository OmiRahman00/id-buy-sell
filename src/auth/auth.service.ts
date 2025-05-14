import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenProvider } from './providers/refresh-token.provider';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=> UserService))
        private readonly userService: UserService,

        private readonly signInProvider: SignInProvider,

        private readonly refreshTokenProvider: RefreshTokenProvider,
    ){}

    /**
     login method
      */
    public async signIn (signInDto: SignInDto){
        return await this.signInProvider.signIn(signInDto);
    }
    

    public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
      }
}
