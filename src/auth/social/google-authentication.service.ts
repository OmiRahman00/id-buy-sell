import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UserService } from 'src/user/user.service';
import { GenerateTokenProvider } from '../providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {

    private oauthCleint: OAuth2Client
    constructor(
        /**Inject UserService*/
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        /**
        inject jwt config */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        /**Inject GenerateTokenProvider*/
        private readonly generateTokenProvider: GenerateTokenProvider,
    ) {}
    onModuleInit() {
        const clientId = this.jwtConfiguration.googleClientId;
        const clientSecret = this.jwtConfiguration.googleClientSecret;
        this.oauthCleint = new OAuth2Client(clientId, clientSecret);
    }

    public async authenticate (googleTokenDto : GoogleTokenDto) {
        try{

            //verify the google token sent by user
            const loginTicket = await this.oauthCleint.verifyIdToken({
                idToken: googleTokenDto.token,
            });
            console.log(loginTicket);
            //extract the payload from Google JWT
            const {email, sub: googleId, given_name: firstName, family_name: lastName} = loginTicket.getPayload() as {
                email: string;
                sub: string;
                given_name: string;
                family_name: string;
            }
            // find the user in the database with the googleId
            const user = await this.userService.findOneByGoogleId(googleId);
            //if the user exists ,generate the access and refresh token
            if (user) {
                return await this.generateTokenProvider.generateTokens(user);
            }
            //if the user does not exist ,create a new user and generate the access and refresh token
            const newUser = await this.userService.createGoogleUser({
                email,
                firstName,
                lastName,
                googleId,
            });
            return await this.generateTokenProvider.generateTokens(newUser);
        }catch(error){
            throw new UnauthorizedException(error);
        
        //throw new UnauthorizedException('Invalid credentials');
        }
    }
        
}
