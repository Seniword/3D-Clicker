import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import routes from "./routes.js"

const app = express();

dotenv.config();
const { APP_LOCALHOST : localhost, APP_PORT : port, DB_URL : db } = process.env;

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())

mongoose.connect(db)
    .then(init)
    .catch(error => console.error(error));

async function init()
{
    try
    {
        app.use("/", routes)
    }
    catch (err)
    {
        console.error(err)
    }
}

app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`)
})