import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    job_title: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("OurUsers", UserSchema);

export default User;
