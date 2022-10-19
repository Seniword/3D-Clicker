import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const {
    ACCESS_TOKEN_SECRET : secret,
    REFRESH_TOKEN_SECRET : secretRefresh
} = process.env;

export function generateAccessToken(user) {
    return jwt.sign(user, secret, {expiresIn: '3600s'})
}

export function generateRefreshToken(user) {
    return jwt.sign(user, secretRefresh, {expiresIn: '1y'})
}

