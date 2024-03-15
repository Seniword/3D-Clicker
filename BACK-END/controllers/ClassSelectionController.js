import mysql from "mysql";
import {connection} from "../server.js";

export default function classSelection(req, res)
{
    try{
        let userStatsQuery = "INSERT INTO `user_stats` (`user_id`, `money`, `class`) VALUES (?, ?, ?)";

        let query = mysql.format(userStatsQuery, [req.user.user_id, 0, req.body.classChoice])

        connection.query(query, (err, response) => {
            if(err) console.error(err);
            return;
        })

        res.status(200).send(req.body.classChoice);

        let userWeapons = "INSERT INTO `user_weapons` (`user_id`, `weapon_id`, `quantity`) VALUES (?, ?, ?)"
        let queryValues = [[req.user.user_id, 1, 1], [req.user.user_id, 2, 0]];
        let weaponsQuery = mysql.format(userWeapons, queryValues);

        connection.query(weaponsQuery, (err, response) => {
            if(err) console.error(err);
            return;
        })

    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
}