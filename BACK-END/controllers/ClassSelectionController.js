import mysql from "mysql";
import {connection} from "../server.js";

export default function classSelection(req, res)
{
    try{
        res.setHeader("Access-Control-Allow-Header", "Content-Type")

        let selectUser = "SELECT ?? FROM ?? WHERE ?? = ?"

        let selectUserQuery = mysql.format(
            selectUser,
            [
                "user_id",
                "users",
                "username",
                req.user.username
            ])

        connection.query(selectUserQuery, (err, response) => {
            if(err) console.error(err);

            let userStatsQuery = "INSERT INTO ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)";

            let query = mysql.format(
                userStatsQuery,
                [
                    "user_stats",
                    "user_id",
                    "money",
                    "dps",
                    "dpc",
                    "class",
                    response[0].user_id,
                    0,
                    0,
                    1,
                    req.body.classChoice
                ])

            connection.query(query, (err, response) => {
                if(err) console.error(err);
                return;
            })
            return;
        })

        res.status(200).send(req.body.classChoice);

    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
}