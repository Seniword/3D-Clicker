import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserStatsSchema = new Schema({
    money: {
        type: Number,
        min: 0,
        max: [1000000000000000, "Wow, you're, like, pretty rich !"],
        required: [true, "You can be poor, but you can't have {VALUE} as a money amount, sorry !"]
    },
    class: {
        type: String,
        enum: {
            values: ['Melee-physical, Melee-magic, Ranged-physical, Ranged-magic'],
            message: "{VALUE} isn't a class from this game, thus can't be used."
        },
    },
    DPC: {
        type: Number,
        min: 1,
        max: 1000000000
    },
    DPS: {
        type: Number,
        min: 0,
        max: 1000000000000
    },
    monsters_discovered: [{
        type: String,
        match: [/[a-zA-Z0-9, ]/, "Some of the discovered monsters don't seem to exist..."]
    }]
});


export const UserStatsModel = model("user_stat", UserStatsSchema);