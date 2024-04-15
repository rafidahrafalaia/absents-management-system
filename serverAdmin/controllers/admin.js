const bcrypt = require("bcrypt");
const conn = require("../database/connection");
const { TypesEnum } = require("../Models/Absent");
const db = conn.sequelize;
const saltRounds = 10;
const { Sequelize } = require('sequelize');

async function upload(req, res) {
  console.log(req.file,'kdjaksjd')
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
  // Respond with a success message and the file's path
  res.json({
      message: 'File uploaded successfully.',
      fileUrl: `/uploads/${req.file.filename}`
  });
};

async function readAllUser(req, res, next) {
  try {
      // Get page and limit from request query parameters, with default values if not provided
      const page = parseInt(req.query.page) || 1; // Default to the first page
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;
      // Query the total count of users without any limit or offset
      const totalCountResult = await db.users.count();

      // Query the database with the specified offset and limit
      let result = await db.users.findAll({
          attributes: ["id", "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
          offset: offset, // Starting point in the results
          limit: limit, // Number of items to return
      });

      // Check if there are results
      if (result) {
          // Return the results and the pagination information
          return res.status(200).json({
              message: "Successfully retrieved all employees",
              page: page,
              limit: limit,
              total: totalCountResult,
              data: result,
          });
      }
  } catch (error) {
      // Handle errors
      res.status(500).json({ message: error.message });
  }
}

async function readUser(req, res, next) {
  try {
              
    let result = await db.users.findOne({
      attributes: [ "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
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
    const password = req.body.password? req.body.password : null;
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
      // console.log(update)
      await db.users.update(
        update, { 
          where: { 
            id: id 
        } 
      });

      const user = await db.users.findOne({
        attributes: [ "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
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
      // Get page and limit from request query parameters, with default values if not provided
      const page = parseInt(req.query.page) || 1; // Default to the first page
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;

      // Query the total count of absents without any limit or offset
      const totalCountResult = await db.absents.count();

      // Query the database with the specified offset and limit
      const result = await db.absents.findAll(
        {
          offset: offset, // Starting point in the results
          limit: limit,
          include: [{
              model: db.users,
              as: 'users', // Join with the users table
              attributes: ["id", "username", "email", "jabatan", "avatar", "office_number", "personal_number"], // Specify the user attributes to return
          }], 
          order: [[Sequelize.fn('STR_TO_DATE', Sequelize.col('date'), '%Y-%m-%d'), 'DESC']], // Convert date column and sort
      });

      // Check if there are results
      if (result) {
          // Return the results and the pagination information
          return res.status(200).json({
              message: "Successfully retrieved absent employees",
              page: page,
              limit: limit,
              total: totalCountResult,
              data: result,
          });
      }
  } catch (error) {
      // Handle errors
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
    console.log(req.body)
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
    console.log(result,'psaodpa')
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
        console.log(insertUser,'asnajsn')
          // Save register in the database
        db.users.create(insertUser)
          .then(data => {
            console.log(role,'req.body.role')
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
              // user role = 2
              // admin role = 1
              data.setRoles([2]).then(() => {
                res.send(data);
              });
            }
          })
          .catch(err => {
            console.log(err,'sdakjkls')
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating account"
            });
          });         
      });
    }
  }catch (error) {
          if (error.isJoi === true) error.status = 422
          next(error)
        }
  };
const admin = {
  readAllUser,
  readUser,
  updateUser,
  getAllAbsents,
  registerUser,
  upload,
}

module.exports = admin;