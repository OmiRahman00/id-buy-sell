import { Injectable } from '@nestjs/common';
import { HasingProvider } from './hasing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HasingProvider {
    public async hashPassword(data: string | Buffer): Promise<string> {
        //generate salt
        const salt = await bcrypt.genSalt();
        //hash password
        const hash = await bcrypt.hash(data, salt);
        return hash;
    }
    comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
        return bcrypt.compare(data, encrypted);
    }
}
