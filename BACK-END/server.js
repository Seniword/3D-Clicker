import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql"
import routes from "./routes.js"

const app = express();

dotenv.config();
const { APP_LOCALHOST : localhost,
        APP_PORT : port,
        DB_USER : db_user,
        DB_PASS : db_pass,
        DB_NAME : db_name,
} = process.env;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));



export const connection = mysql.createConnection({
    host: localhost,
    user: db_user,
    password: db_pass,
    database: db_name,
})

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!")
})

try
{
    app.use("/", routes)
}
catch (err)
{
    console.error(err)
}

app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
})