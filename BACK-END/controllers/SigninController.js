import bcrypt from "bcrypt";
import mysql from "mysql";
import {connection} from "../server.js";
import {generateAccessToken} from "../utils.js";

export default async function signin(req, res) {
    try
    {
        let selectQuery = 'SELECT `user_id`, `password` FROM `users` WHERE `username` = ?';
        let query = mysql.format(selectQuery,[req.body.username]);
        connection.query(query,(err, data) => {
            if(err) {
                console.error(err);
                return;
            }

            return bcrypt.compare(req.body.password, data[0].password)
                .then((result) => {
                    if(result == true)
                    {
                        const user = {
                            username : req.body.username,
                            user_id : data[0].user_id
                        }

                        const accessToken = generateAccessToken(user)
                        res.status(200).send(accessToken);
                    }
                    else
                    {
                        res.status(400).send("Your email or password does not fit any registered account.")
                    }
                })
        });

    } catch(err)
    {
        res.status(500).send(err.message);
    }
}
