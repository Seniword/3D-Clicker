import mysql from "mysql";
import {connection} from "../server.js";

export default function saveUserInfos(req, res)
{
    try{
        //first query -> sets user money
        let setMoney = "UPDATE `user_stats` SET `money` = ? WHERE `user_id` = ?"
        let moneyQuery = mysql.format(setMoney, [req.body.money, req.user.user_id])
        connection.query(moneyQuery, (err, data) => {
            if(err) console.error(err);

            //second query -> get ids of the weapons bought by the user
            let weapon_names = req.body.weapons.map((weapon) => weapon.name);
            let getWeaponId = "SELECT `weapon_id` FROM `weapons_list` WHERE `name` IN (?)"
            let weaponIdsQuery = mysql.format(getWeaponId,[ weapon_names ]);
            connection.query(weaponIdsQuery, (err, response) => {
                if(err) console.error(err);

                //third query -> sets quantity of weapons bought by the
                let weaponIds = [];
                let quantitySwitch = "case "
                for(let i = 0; i < req.body.weapons.length; i++)
                {
                    weaponIds.push(response[i].weapon_id);
                    quantitySwitch += `when weapon_id = ${response[i].weapon_id} then ${req.body.weapons[i].quantity} `;
                    if(i + 1 >= req.body.weapons.length)
                        quantitySwitch += "end";
                }

                let setWeaponsQuantity = "UPDATE `user_weapons` SET `quantity` = (" + quantitySwitch + ") WHERE `user_id` = ? AND `weapon_id` IN (?)"
                let query = mysql.format(setWeaponsQuantity, [req.user.user_id, weaponIds])
                connection.query(query, (err, data) => {
                    if(err) console.error(err);
                })
            })
        })
        return;

    }
    catch(err){
        res.status(500).send(err);
    }
}