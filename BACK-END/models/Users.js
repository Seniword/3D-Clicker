import mongoose from "mongoose";
import crypto from "crypto"
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: 'This field cannot be empty.',
        match: [/[A-Za-z]/g, 'Please fill a valid name.'],
    },
    email: {
        type: String,
        required: 'This field cannot be empty.',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address.'],
        unique: true,
    },
    hash : String,
    salt : String
});

UserSchema.methods.setPassword = function(password)
{
    // Création d'un salt unique à chaque utilisateur
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing du salt et du mot de passe de l'utilisateur à travers 1000 itérations
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.validPassword = function(password)
{

    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

export const UsersModel = model("users", UserSchema);