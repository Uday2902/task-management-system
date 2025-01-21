const StatusCodes = require("http-status-codes");
const Models = require("../models/index")


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = Models.User.findOne({email});
    if(existingUser){
        res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists with this credentials!"});
    }
    const newUser = await Models.User.create({name, email, password});
    if(!newUser){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Not able to create new user account!" });
    }
    delete newUser.password;
    res.status(StatusCodes.CREATED).json({ message: "New user created successfully!", data: newUser });
};

const loginUser = async (req, res) => {
    const { mongoID, email, password } = req.body;
    if(mongoID){
        let user = await Models.User.findOne({ _id: mongoID});
        if(!user){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Not able to find user" });
        }
        if(user.password){
            delete user.password;
        }
        res.status(StatusCodes.OK).json({ message: "User found with given email address!", data: user });
    }else{
        let user = await Models.User.findOne({ email });
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid password" });
        }
        const isPasswordCorrect = await Models.User.isPasswordCorrect(password);
        if(isPasswordCorrect){
            user = await Models.User.findOne({ password });
            if(user.password){
                delete user.password;
            }
            return res.status(StatusCodes.OK).json({ message: "User found with given credentials", user });
        }
        res.status(StatusCodes.NOT_FOUND).json({ message: "Incorrect password!" });
    }
};

module.exports = {
    registerUser,
    loginUser
}
