import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js'

export const singup = async (req,res) => {
    const {fullName, email,password} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 character"})
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "Email already exist"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser) {
            //generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
             });
        } else {
            return res.status(400).json({message: "Invalid user data"})
        }
    }catch(error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "unable find user"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({message: "Invalid password "})
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic

        })


    } catch(error) {
        return res.status(500).json({message: "Internal server error"});

    }
    
}

export const logout = async (req,res) => {
    try {
    res.cookie("jwt", "", {maxAge: 0});
    return res.status(200).json({message: "Logout successfully"});

    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
   

}

export const updateProfile = async(req, res) => {
    try {
        const profilePic = req.body;
        const userId = req.user._id;
        if(!profilePic) {
            return res.status(400).json({message: "profilePic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic:uploadResponse.secure_url
        },{new:true})

        return res.status(200).json(updatedUser);

    } catch(error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user)

    } catch(error) {
        return res.status(500).json({message: "Internal server error"});
    }
}


