import mysql from "mysql";
import {connection} from "../server.js";

export default function classSelection(req, res)
{
    try{
        let userStatsQuery = "INSERT INTO `user_stats` `user_id`, `money`, `dps`, `dpc`, `class` VALUES (?, ?, ?, ?, ?)";

        let query = mysql.format(userStatsQuery, [req.user.user_id, 0, 0, 1, req.body.classChoice])

        connection.query(query, (err, response) => {
            if(err) console.error(err);
            return;
        })

        res.status(200).send(req.body.classChoice);

    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
}