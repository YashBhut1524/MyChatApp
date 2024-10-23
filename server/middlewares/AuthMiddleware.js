import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    // console.log(req.cookies);
    const token = req.cookies.jwt
    // console.log({token});
    if(!token) return res.status(401).json({msg: "You are not authenticated!!"})
    jwt.verify(token, process.env.JWT_KEY, async(error, payload) => {
        if(error) return res.status(403).json({msg: "The token is not Valid!!"})
        req.userId = payload.userId;
        next()
    })
}