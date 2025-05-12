import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(()=> UserService))
        private readonly userService: UserService,

        private readonly signInProvider: SignInProvider,
    ){}

    /**
     login method
      */
    public async signIn (signInDto: SignInDto){
        return await this.signInProvider.signIn(signInDto);
    }
    
}
