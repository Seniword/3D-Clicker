import {connection} from "../server.js"
import dotenv from "dotenv";
import mysql from "mysql";
import bcrypt from "bcrypt";
import {generateAccessToken} from "../utils.js";

dotenv.config();

export function encryptPassword(password, email) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {

            let insertQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";

            let query = mysql.format(
                insertQuery,
                [
                    "users",
                    "password",
                    hash,
                    "email",
                    email
                ]);

            connection.query(query, (err, response) => {
                if (err) {
                    console.error(err);
                    return;
                }

            });
        });
    });
}

export default function signup(req, res) {
    try
    {
        let mailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        let usernameRegex = /^[A-Za-z][A-Za-z0-9_é ]{3,29}$/
        let passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/

        if(!usernameRegex.test(req.body.username))
        {
            res.status(400).send("Username contains unauthorized characters or does not fit the length requirements.");
            return;
        }

        if(!mailRegex.test(req.body.email))
        {
            res.status(400).send("Email contains unauthorized characters or does not fit the length requirements.");
            return;
        }

        if(!passwordRegex.test(req.body.password))
        {
            //TODO: show password requirements on front form
            res.status(400).send("Password contains unauthorized characters or does not fit the length requirements.");
            return;
        }

        let insertQuery = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";

        let query = mysql.format(
            insertQuery,
            [
                "users",
                "email",
                "username",
                "password",
                req.body.email,
                req.body.username,
                ""
            ]);

        const user = {
            username : req.body.username,
        }

        encryptPassword(req.body.password, req.body.email);

        connection.query(query, (err, response) => {
            if (err) {
                res.status(400).send("Username already taken.")
                return;
            }

            const accessToken = generateAccessToken(user)
            res.status(200).send(accessToken);

        });


    } catch(err)
    {
        res.status(500).send(err.message);
    }
}
