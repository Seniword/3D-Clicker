import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();

const {ACCESS_TOKEN_SECRET : secret} = process.env;

export default function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
        res.status(401);

    jwt.verify(token, secret, (err, user) => {
        if(err)
            return res.status(401).send("access refused.");

        req.user = user;
        next();
    })
}