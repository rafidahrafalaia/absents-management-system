const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conn = require("../database/connection")
const db = conn.sequelize;

async function loginUser(req, res, next) { 
  const email = req.body.email;
  const password = req.body.password;
  db.users.findAll({
        where: {
                email: email
            },
            include: [
               { 
                model: db.role, as: "roles",
                attributes: ['id', 'name', 'description'],
              }
            ]
      }).then(
        users => {
        const resObj = users.map(users => {
          //tidy up the user data
          return Object.assign(
            {},
            {
              userId: users.id,
              username: users.username,
              email: users.email,
              password: users.password,
              role: users.roles
              .map(Role => {
              // tidy up the roles data
                return Object.assign(
                  {},
                  {
                    id: Role.id,
                    name: Role.name,
                    description: Role.description,
                  }
                  )
              })
            }
          )
        });
        const result = JSON.parse(JSON.stringify(resObj))
      
            if (users.length) {
              bcrypt.compare(password, result[0]["password"], (error, response) => {
                if (response && result[0].role[0].id === 1) {
                  const userData = {
                     "id" : result[0].userId,
                     "username" : result[0].username,
                     "email" : result[0].email,
                     "role" : result[0].role,
                  }
                  const token = jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '6h' })
                  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '8h' })
                  // refreshTokens.push(refreshToken)
                  if (token == null) return res.sendStatus(401)
                //   console.log(req.session.user);
                  console.log({ message: "LoggedIn" });
               
                  res.cookie('token', token, {
                    // maxAge: 21600 * 1000,
                    httpOnly: true
                  });
                  res.cookie('refreshToken', refreshToken, {
                    // maxAge: 21800 * 1000,
                    httpOnly: true
                  });            
                //   console.log(req.cookies['token'])  
                  return res.send({token: token, refreshToken: refreshToken})
                } else {
                  return res.send({ message: "Wrong email/password combination!" });
                }
              });
            } else {
              return res.send({ message: "User doesn't exist" });
            }
      });
  };


const authControllers  = {
  loginUser,
}

module.exports = authControllers;