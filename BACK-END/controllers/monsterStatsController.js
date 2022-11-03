import mysql from "mysql";
import {connection} from "../server.js";

export default function getMonsterStats(req, res)
{
    try{
        let getMonsterStats =
        "SELECT `level`, `health`, `physical_defense`, `magical_defense`, `gold_factor`, `xp_factor` FROM `monster_stats` WHERE `name` = ?";
        let query = mysql.format(getMonsterStats, req.body.name)
        connection.query(query, (err, data) => {
            if(err) console.log(err)
            res.status(200).send(data[0])
        })
        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}