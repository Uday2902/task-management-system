const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const { token } = req.body;
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
