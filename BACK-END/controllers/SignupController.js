import {UsersModel} from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();

export default async function signup(req, res) {
    try
    {
        let user = new UsersModel({
            name: req.body.name,
            email: req.body.email
        });
        if(req.body.password === req.body.passwordConfirm)
        {
            user.setPassword(req.body.password);
            user.save(function(err)
            {
                if(err) console.log(err);
                res.status(200).send("yes");
            })

        }

        else
            res.status(400).send("Passwords do not match.");

    } catch(err)
    {
        res.status(500).send(err.message);
    }
}
