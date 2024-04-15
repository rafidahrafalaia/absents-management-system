const bcrypt = require("bcrypt");
const conn = require("../database/connection");
const db = conn.sequelize;
const saltRounds = 10;
const { Sequelize } = require('sequelize');

async function upload(req, res) {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  
  await db.users.update(
    {
      avatar: `/uploads/${req.file.filename}`
    }, { 
      where: { 
        id: req.params.id 
    } 
  });
  
  res.json({
      message: 'File uploaded successfully.',
      fileUrl: `/uploads/${req.file.filename}`
  });
};

async function readAllUser(req, res, next) {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const totalCountResult = await db.users.count();

      let result = await db.users.findAll({
          attributes: ["id", "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
          offset: offset,
          limit: limit,
      });

      if (result) {
          return res.status(200).json({
              message: "Successfully retrieved all employees",
              page: page,
              limit: limit,
              total: totalCountResult,
              data: result,
          });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function readUser(req, res, next) {
  try {
    let result = await db.users.findOne({
      attributes: ["username", "email", "jabatan", "avatar", "office_number", "personal_number"],
      where: {
        id: req.params.id
      }
    })
    
    if(result){
     return res.status(200).json({message: "successfully get detail employee", data: result});
    }
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

async function updateUser(req, res, next) {
  try { 
    const id = req.params.id;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password ? req.body.password : null;
    const jabatan = req.body.jabatan;
    const avatar = req.body.avatar;
    const office_number = req.body.office_number;
    const personal_number = req.body.personal_number;
        
    let result = await db.users.findOne({
      attributes: ['id'],
      where: {
        id: id
      }
    })
    if(!result) res.status(404).json({message:"user not found"})
    else {
      let update = {
        email: email,
        username:username,
        avatar: avatar,
        office_number: office_number,
        personal_number: personal_number,
        jabatan: jabatan
      };
      if (password) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(err);
          }
          update = {
            ...update,
            password: hash,
          }
        });
      }
      
      await db.users.update(
        update, { 
          where: { 
            id: id 
        } 
      });

      const user = await db.users.findOne({
        attributes: ["username", "email", "jabatan", "avatar", "office_number", "personal_number"],
        where: {
          id
        } 
      });
      
      res.status(200).json({ message: "successfully update employee", data: user })    
    }
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

async function getAllAbsents(req, res, next) {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const totalCountResult = await db.absents.count();
      const result = await db.absents.findAll({
          offset: offset,
          limit: limit,
          include: [{
              model: db.users,
              as: 'users',
              attributes: ["id", "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
          }],
          order: [[Sequelize.fn('STR_TO_DATE', Sequelize.col('date'), '%Y-%m-%d'), 'DESC']],
      });

      if (result) {
          return res.status(200).json({
              message: "Successfully retrieved absent employees",
              page: page,
              limit: limit,
              total: totalCountResult,
              data: result,
          });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function registerUser(req, res, next) {
  try {  
    username = req.body.username;
    email = req.body.email;
    password = req.body.password || '1234';
    role = req.body.role || 2;
    jabatan = req.body.jabatan;
    avatar = req.body.avatar;
    office_number = req.body.office_number;
    personal_number = req.body.personal_number;
    
    var n = email.includes("@");
    if(!n) 
    return res.status(400).send({
      message: "failed to create account, email is wrong/blank"
    });
    let result = await db.users.findAndCountAll({
      raw: true,
      where: {
        email: email
      }
    })
    if(result.count){
      return res.status(400).send({
        message: "email already exist"
      });
    }
    else{
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        const insertUser = {
          email,
          username,
          jabatan,
          password: hash,
          role,
          avatar,
          office_number,
          personal_number,
        };
        db.users.create(insertUser)
          .then(data => {
            if (req.body.role || role) {
              db.role.findAll({
                where: {
                    id: req.body.role || role
                }
              }).then(roles => {
                data.setRoles(roles).then(() => {
                  res.send(data);
                });
              })
            } else {
              data.setRoles([2]).then(() => {
                res.send(data);
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating account"
            });
          });         
      });
    }
  }catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

const admin = {
  readAllUser,
  readUser,
  updateUser,
  getAllAbsents,
  registerUser,
  upload,
};

module.exports = admin;