const jwt = require('jsonwebtoken')

  async function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if(token){
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
        // newToken.token
        const refreshToken = req.headers['refreshToken']
        var decoded = jwt_decode(refreshToken);
        console.log(decoded)
        const userData = {
           "id" : decoded.id,
           "username" : decoded.username,
           "email" : decoded.email,
           "role" : decoded.role,
        }
        if (refreshToken == null) return res.sendStatus(401)
        // if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {   
          return res.sendStatus(403)
        }
        
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '6h' })
        const newRefreshToken = jwt.sign(userData,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '8h' })
        res.headers('authorization', accessToken, {
          // maxAge: 21600 * 1000,
          httpOnly: true
        });
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true
        });
        })
      } 
      else{
        req.user = user
      }
      next()
    })
  }
  }

  async function isAdmin(req, res, next) {
    const user = req.user;
    console.log(user,'KOKOKKOKO')
    if(!user.role.length || user?.role[0].name !== "admin") res.status(400).json({ message:"user not allowed for this" });
    else next();
  }

  const validation = {
    authenticateToken,
    isAdmin,
  }

  module.exports = validation;