"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetUserIdFromAuthToken = exports.decodeAuthToken = exports.encodeAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _getSecret = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_SECRET) {
        throw new Error('Missing env variable: JWT_SECRET');
    }
    const appSecretName = process.env.JWT_SECRET;
    console.log('JWT Secret:', appSecretName);
    return appSecretName;
});
const encodeAuthToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    const payload = {
        exp: currentTime.getTime() + 365 * 24 * 60 * 60 * 1000, // 1 year expiration
        iat: currentTime.getTime(),
        sub: String(userId),
    };
    console.log('Token Payload:', payload);
    const secret = yield _getSecret();
    const token = jsonwebtoken_1.default.sign(payload, secret, { algorithm: 'HS256' });
    console.log('Generated JWT Token:', token);
    return token;
});
exports.encodeAuthToken = encodeAuthToken;
const decodeAuthToken = (authToken) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = yield _getSecret();
    try {
        const payload = jsonwebtoken_1.default.verify(authToken, secret, { algorithms: ['HS256'] });
        console.log('Decoded Payload:', payload);
        if (typeof payload === 'object' && 'sub' in payload) {
            return payload.sub;
        }
        throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid token.');
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Token expired.');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid token.');
        }
        throw new Error('Access denied.');
    }
});
exports.decodeAuthToken = decodeAuthToken;
const tryGetUserIdFromAuthToken = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = yield _getSecret();
    const authHeader = request.header('authorization');
    console.log('Authorization Header:', authHeader);
    if (!authHeader)
        return null;
    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);
    // Using jwt.decode to decode the token without verifying
    const decoded = jsonwebtoken_1.default.decode(token);
    console.log('Decoded Token Payload (using decode):', decoded);
    if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
        return decoded.sub;
    }
    console.log('Invalid token structure or missing sub.');
    return null;
});
exports.tryGetUserIdFromAuthToken = tryGetUserIdFromAuthToken;
