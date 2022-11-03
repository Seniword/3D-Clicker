import mysql from "mysql";
import {connection} from "../server.js";

export function getWeapons(req, res)
{
    try{
        let getUserWeapons = "SELECT `weapon_id`, `quantity` FROM `user_weapons` WHERE `user_id` = ?";
        let query = mysql.format(getUserWeapons, req.user.user_id)
        connection.query(query, (err, data) => {
            res.status(200).send(data)
        })
        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}

export function getWeaponData(req, res)
{
    try{
        let weapon_ids = req.body.map((weapon) => weapon.weapon_id);
        let getWeaponId = "SELECT `name`, `price`, `dps`, `dpc` FROM `weapons_list` WHERE `weapon_id` IN (?)"
        let weaponsDataQuery = mysql.format( getWeaponId,[ weapon_ids ]);

        connection.query(weaponsDataQuery, (err, response) => {
            if(err) console.error(err);

            for(let i = 0; i < response.length; i++)
                response[i].quantity = req.body[i].quantity;

            res.send(response);
        })

        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}

export function setWeapons(req, res)
{
    try{
        let getWeapon = "SELECT `weapon_id` FROM `weapons_list` WHERE `name` = ?"
        let weaponQuery = mysql.format(getWeapon, req.body.name)
        connection.query(weaponQuery, (err, data) => {
            let setUserWeapons = "UPDATE `user_weapons` SET `quantity` = ? WHERE `user_id` = ? AND `weapon_id` = ?";
            let query = mysql.format(setUserWeapons, [req.body.quantity, req.user.user_id, data[0].weapon_id])
            connection.query(query, (err, data) => {
                res.status(200).send(data)
            })
            return;
        })



    }
    catch(err){
        res.status(500).send(err);
    }
}