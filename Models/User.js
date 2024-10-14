import mongoose from "mongoose";

import mongooseSequence from "mongoose-sequence";

const { Schema, model } = mongoose;

const AutoIncrement = mongooseSequence(mongoose);

const data = {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
};

const userSchema = new Schema(data, { timestamps: true });

userSchema.plugin(AutoIncrement, { id: 'user_seq', inc_field: 'id' });

const User = model("User", userSchema);

export default User;