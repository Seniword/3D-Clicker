import bcrypt from "bcrypt";
import mysql from "mysql";
import {connection} from "../server.js";

export default async function signin(req, res) {
    try
    {
        let selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';
        let query = mysql.format(selectQuery,["password","users", "email", req.body.email]);
        // query = SELECT password FROM `users` where `email` = req.body.email
        connection.query(query,(err, data) => {
            if(err) {
                console.error(err);
                return;
            }

            if(data[0] == undefined)
            {
                res.status(400).send("Your email is not registered. Make sure to create an account !")
                return;
            }


            return bcrypt.compare(req.body.password, data[0].password)
                .then((result) => {
                    if(result == true)
                        res.status(200).send("You successfully logged in !")
                    else
                        res.status(400).send("Your email or password does not fit any registered account.")
                })
        });

    } catch(err)
    {
        res.status(500).send(err.message);
    }
}
