const StatusCodes = require("http-status-codes");
const Models = require("../models/index")


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await Models.User.findOne({email});
    if(existingUser){
        res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists with this credentials!"});
    }
    const newUser = await Models.User.create({name, email, password});
    if(!newUser){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Not able to create new user account!" });
    }
    const userObject = newUser.toObject();
    delete userObject.password;
    const token = newUser.createJWT();
    res.status(StatusCodes.CREATED).json({ message: "New user created successfully!", data: newUser, token });
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
        const isPasswordCorrect = await user.comparePassword(password);
        
        if(isPasswordCorrect){
            const token = user.createJWT(); 
            user = user.toObject();
            delete user.password;
            return res.status(StatusCodes.OK).json({ message: "User found with given credentials", user, token });
        }
        res.status(StatusCodes.NOT_FOUND).json({ message: "Incorrect password!" });
    }
};

module.exports = {
    registerUser,
    loginUser
}
