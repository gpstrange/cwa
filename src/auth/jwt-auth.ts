/**
 * JWT Auth
 */
import log4js from '../util/log4js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bluebird from 'bluebird';
import User from '../models/user';
import { UserModel } from '../models/user';

const logger = log4js.getLogger('JWT-AUTH');
import CWAError, { ErrorObj } from '../error/cwa-error';
import httpCodes from '../error/http-codes';

const IV_LENGTH = 16;
/**
 * Class Definition for JWTAuth with its member functions
 */
class JwtAuth {
    jwtSecret: string;
    jwtPayloadSECRET: string;
    jwtSalt: string;

    constructor(secrets: any) {
        this.jwtSecret = secrets.JWT_SECRET;
        this.jwtPayloadSECRET = secrets.JWT_PL_SECRET;
        this.jwtSalt = secrets.JWT_SALT;
    }
    /**
     * Encrypts the payload data
     * @param data Payload data
     * @param passPhrase jwtPayloadSECRET
     * @param salt JWT Salt
     */
    private encrypt(data: any, passPhrase: string, salt: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = crypto.pbkdf2Sync(passPhrase, salt, 65536, 32, 'sha1');
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return Buffer.concat([iv, encrypted]).toString('base64');
    }
    /**
     * Decrypts the payload data
     * @param data Payload data
     * @param passPhrase jwtPayloadSECRET
     * @param salt JWT Salt
     */
    private decrypt(data: string, passPhrase: string, salt: any): string {
        const buff = new Buffer(data, 'base64');
        const iv = buff.slice(0, IV_LENGTH);
        const encryptedText = buff.slice(IV_LENGTH, buff.length);
        const key = crypto.pbkdf2Sync(passPhrase, salt, 65536, 32, 'sha1');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(encryptedText);
        return Buffer.concat([decrypted, decipher.final()]).toString();
    }

    private decodeJwtToken(token: string): Promise<string | object> {
        logger.debug('Decoding token: %s', token);
        try {
            const decodedToken = jwt.verify(token, this.jwtSecret);
            return Promise.resolve(decodedToken);
        } catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Generates JWT for the user
     * @param user User
     */
    public generateToken(user: any, isRefresh: boolean): string {
        if (!user) {
            logger.error('No user provided');
            return;
        }
        // If we need to generate expiration token then expHours is 30 days else 1 hour.
        const expHours: number = isRefresh ? 1 * 30 * 24 : 1;
        const expirationDate = new Date(new Date().getTime() + (expHours * 60 * 60 * 1000));
        const payloadObj = {
            id: user._id,
            name: user.name,
            mobileNumber: user.mobileNumber,
            email: user.email,
            logoutNum: user.logoutNum,
            isRefresh: isRefresh
        };

        const encryptedPayload = this.encrypt(
            JSON.stringify(payloadObj),
            this.jwtPayloadSECRET,
            this.jwtSalt
        );
        return jwt.sign({
            sub: encryptedPayload,
            exp: expirationDate.getTime()
        }, this.jwtSecret);
    }
    /**
     * Verify the payload and queries the user from db
     */
    public verify(jwtPayload: any, cb: any): bluebird<string> {
        try {
            const decodedPayload = this.decrypt(
                jwtPayload.sub,
                this.jwtPayloadSECRET,
                this.jwtSalt
            );
            const user = JSON.parse(decodedPayload);
            // Check payload expiration
            if (jwtPayload.exp < Date.now()) {
                const errObj: ErrorObj = {
                    message: 'EXPIRED_TOKEN',
                    code: 1004,
                    status: httpCodes.UNAUTHORIZED
                };
                logger.error(`Token expired for user ${user.login}`);
                return bluebird.reject(new CWAError(errObj)).nodeify(cb);
            }
            User.findOne({
                mobileNumber: user.mobileNumber
            }, (err, data: UserModel) => {
                if (err) {
                    return bluebird.reject(err).nodeify(cb);
                }
                if (!data) {
                    const errObj: ErrorObj = {
                        message: 'USER_NOT_FOUND',
                        code: 1002,
                        status: httpCodes.UNAUTHORIZED
                    };
                    return bluebird.reject(new CWAError(errObj)).nodeify(cb);
                }
                if (data.logoutNum > user.logoutNum) {
                    const errObj: ErrorObj = {
                        message: 'EXPIRED_TOKEN',
                        code: 1004,
                        status: httpCodes.UNAUTHORIZED
                    };
                    return bluebird.reject(new CWAError(errObj)).nodeify(cb);
                }
                bluebird.resolve(user).nodeify(cb);
            });
        } catch (err) {
            logger.error('Unable to decrypt token %s', err);
            return bluebird.reject(err.toString()).nodeify(cb);
        }
    }
}

export default JwtAuth;
