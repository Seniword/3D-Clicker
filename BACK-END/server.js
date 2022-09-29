import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

import routes from "./routes.js"

const app = express();

dotenv.config();