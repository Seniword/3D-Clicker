import mysql from "mysql";

export default function achievements(req, res)
{
    try{
        let achievementQuery = "SELECT ??, ?? FROM ?? WHERE ?? = ?";
        // SELECT user_id, achievement_id FROM user_achievements WHERE user_id = req.body.user_id
        // AND achievement_id = req.body.achievement_id
        let query = mysql.format(
            achievementQuery,
            [
                "user_id",
                "achievement_id",
                "user_achievements",
                "user_id",
                req.body.user_id,
                "achievement_id",
                req.body.achievement_id
            ])

    }
    catch(err){
        res.status(500).send(err);
    }
}