import * as Boom from '@hapi/boom';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class UserHelper {
    static async hashPassword(str: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const saltRounds = 15;
            bcrypt.hash(str, saltRounds, (err, hash: string) => {
                if (err) reject(err);
                else resolve(hash);
            });
        });
    }

    static async comparePasswords(
        rawStr: string,
        storedHash: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(rawStr, storedHash, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    static generateJWT(userid: string): string {
        const data = {
            userid,
            exp: Date.now() + Number(process.env.JWT_EXPIRY_SECONDS),
        };

        if (!process.env.JWT_SECRET)
            throw Boom.badData('No JWT Secret Provided');

        return jwt.sign(data, process.env.JWT_SECRET);
    }
}
