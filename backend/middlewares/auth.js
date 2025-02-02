const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token){
        return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({ message: "Authorization token is required to access this route!" })
    };
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const { mongoID, email } = decoded;
            req.body.mongoID = mongoID;
            next();
        }catch(err){
            console.error(err);
            res.send(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({ message: "You are not authorized to access this route" });
        }
    }
};

module.exports = { authMiddleware };
