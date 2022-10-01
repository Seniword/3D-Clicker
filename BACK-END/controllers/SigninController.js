import {UsersModel} from "../models/Users.js";

export default async function signin(req, res) {
    try
    {
        UsersModel.findOne({email: req.body.email}, (err, user) => {
            if(user.validPassword(req.body.password)){
                res.status(200).send("Correct password");
            }
            else
                res.status(400).send("Wrong password");
        })

    } catch(err)
    {
        res.status(500).send(err.message);
    }
}
