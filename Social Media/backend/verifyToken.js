const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json("You are not authenticated")
    }
    jwt.verify(token,"Daniel", async(err, data)=>{
        if(err){
            return res.status(403).json("Token is not valid")
        }
        req.userId = data.indexOf;
        next()
    })
}
module.exports = verifyToken;