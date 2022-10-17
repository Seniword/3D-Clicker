import mysql from "mysql";
import {connection} from "../server.js";

export default async function home(req, res) {
    try{
        let selectQuery = 'SELECT ?? FROM ?? WHERE ?? = ?';
        let query = mysql.format(selectQuery,["email","users", "email", req.body.email]);
        // query = SELECT email FROM `users` where `email` = req.body.email
        connection.query(query,(err, data) => {
            if(err) {
                console.error(err);
                return;
            }

            if(data[0] == undefined)
            {
                res.status(200).send('register');
            }
            else
            {
                res.status(200).send('login');
            }

        });
    } catch(err){
        res.status(500).send(err.message);
    }
}
