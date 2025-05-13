import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate  {
  private static readonly defaultAuthType = AuthType.Bearer;
  
  private readonly authTypeGaurdmap: Record<AuthType, CanActivate | CanActivate[]>;
  
  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ){
    // Initialize the map in the constructor after accessTokenGuard is available
    this.authTypeGaurdmap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  
   async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    //authTypes can get this from reflector class
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY,[
      context.getHandler(),// get context from handler actually getting meta value
      context.getClass(), //get context from class  actually getting meta value
    ]
  ) ?? [AuthenticationGuard.defaultAuthType];
   console.log(authTypes)
    //array of guards
    const gaurds = authTypes.map((authType) => this.authTypeGaurdmap[authType]).flat();
    // console.log(gaurds);
    //default error
    const error = new UnauthorizedException()
    //loop guards canActivate
     for (const instance of gaurds) {
      // console.log(instance);
       const canActive = await Promise.resolve(
         instance.canActivate(context),
       ).catch((err) => {
         error: err;
       });
      //  console.log(canActive); 
       if (canActive) {
        return true;
       }
     }
    throw error;
  }
}