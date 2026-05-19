const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next)=>{
  console.log("Inside JWT Middleware");
  //find token
  const token =req.headers.authorization.slice(7)
  console.log(token);
 try {
   // verify token
  const jwtVerification = jwt.verify(token,process.env.jwtKey)
  console.log(jwtVerification);
  req.payload = jwtVerification.usermail
  
    req.userId = jwtVerification.userId;
  next()
 } catch (err) {
  res.status(401).json("Authentication Error",err)
 }
  
  
  
}
module.exports = jwtMiddleware