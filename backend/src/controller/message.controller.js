import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers =  await User.find({_id: {
            $ne: loggedInUser 
        }}).select("-password");

        return res.status(200).json(filteredUsers);

    } catch(error) {
        return res.status(500).json({message: "Internal server error"})
    }

} 

export const getUserMessages = async (res, req) => { 
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId:myId, receivedId:userToChatId },
                {senderId: userToChatId, receivedId: myId},

            ]
        })

        return res.status(200).json(messages);

    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

export const sendUserMessages = async (res, req) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image0);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessages = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessages.save();

        //todo socket.io

        return res.status(201).json(newMessages);


    } catch(error) {
        return res.status(500).json({message: "Internal server error"})
    }

}