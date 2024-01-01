import { express , User } from "../expressandUserPackage.js";
import fs from 'fs'

const funimporter = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const users = funimporter('./User_Data.json');

const getApiUser = async (req,res) => {
    // res.json(users)
    const allDbUsers = await User.find({})
    return res.status(200).json(allDbUsers)
}

const getApiUserId = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ id: id });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


const patchApiUserId = async (req, res) => {
    const userId = req.params.id;
    const updateFields = req.body;

    // Check if any field is missing
    const requiredFields = ["first_name", "last_name", "email", "gender", "job_title"];
    const missingFields = requiredFields.filter(field => !(field in updateFields));

    if (missingFields.length > 0) {
        return res.status(400).json({ msg: "All Fields Are Required", missingFields });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
        {id :userId} ,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

const deleteApiUserId = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.id;

        // Find and delete the user by custom id field
        const deletedUser = await User.findOneAndDelete({ id: userId });

        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
}

const postApiUser = (req,res) => {
    const body = req.body
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg:'ALL Fields are required.'})
    }
    console.log(body)
    const nextid = Number(users[users.length -1]['id']) + 1
    users.push({id : nextid,...body})
    fs.writeFile('../second_node_app/controllers/User_Data.json',JSON.stringify(users) , (err,data) => {
        if(err){
            console.log(err)
        }else{
            console.log("data",data)
            console.log(nextid)
            console.log(users[users.length - 1])
        }
    })
    const newUser = new User({
        id: nextid , ...body
    })
    newUser.save();
    return res.status(201).json({
        status : 'Success!!',
        id:`${nextid}`
    })
}


export {
    getApiUser,
    getApiUserId,
    patchApiUserId,
    deleteApiUserId,
    postApiUser
}
