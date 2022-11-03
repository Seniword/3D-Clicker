import mysql from "mysql";
import {connection} from "../server.js";

export function getMoney(req, res)
{
    try{
        let getStats = "SELECT `money` FROM `user_stats` WHERE `user_id` = ?";
        let query = mysql.format(getStats, req.user.user_id)
        connection.query(query, (err, data) => {
            res.status(200).send(data[0])
        })

        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}

export function setMoney(req, res)
{
    try{
        let getStats = "UPDATE `user_stats` SET `money` = ? WHERE `user_id` = ?";
        let query = mysql.format(getStats, [req.body.money, req.user.user_id])
        connection.query(query, (err, data) => {
            res.status(200).send("money sent")
        })

        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}