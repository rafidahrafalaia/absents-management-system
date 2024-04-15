const bcrypt = require("bcrypt");
const conn = require("../database/connection");
const { TypesEnum } = require("../models/Absent");
const db = conn.sequelize;
const saltRounds = 10;
const { Op } = require('sequelize');
const moment = require('moment');
const Producer  = require('./rabbitmq');

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
        id: req.user.id 
    } 
  });
  // Respond with a success message and the file's path
  res.json({
      message: 'File uploaded successfully.',
      fileUrl: `/uploads/${req.file.filename}`
  });
};

async function readUser(req, res, next) {
  try {
    const user = req.user;
              
    let result = await db.users.findOne({
      attributes: [ "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
      where: {
        id: user.id
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
    const id = req.user.id;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password? req.body.password : null;
    const jabatan = req.body.jabatan;
    const avatar = req.body.avatar;
    const office_number = req.body.office_number;
    const personal_number = req.body.personal_number;
    console.log(req.body,"apapospoa")
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
        bcrypt.hash(password, saltRounds, async (error, hash) => {
          if (error) {
            res.status(500).json({ message: error })  
          }
          console.log(hash,"ksdjakld")
          update = {
            ...update,
            password: hash,
          }
          await db.users.update(
            update, { 
              where: { 
                id: id 
            } 
          });
        });
      }
      else {
        await db.users.update(
          update, { 
            where: { 
              id: id 
          } 
        });
      }  
      const user = await db.users.findOne({
        attributes: [ "username", "email", "jabatan", "avatar", "office_number", "personal_number"],
        where: {
          id: req.user.id
        } 
      });
      
      const dataString = JSON.stringify(user);
      const producer =  new Producer();
      producer.publishMessage('updateUser', dataString);
      // console.log(rabbit,'askdakjkajd')
      res.status(200).json({ message: "successfully update employee", data: user })  
    }
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

async function clockin(req, res, next) {
  try { 
    const now = new Date();
    const today = moment();
    const findOne = await db.absents.findOne({
      where: {
        date: today.format('YYYY-MM-DD'),
        type: TypesEnum.clockIn,
        userId: req.user.id
      }
    });
    console.log(findOne,'askdlak')
    if (findOne) res.status(200).json({message:"user already clock-in for today"});
    else {
      const insert = {
        userId: req.user.id,
        date: today.format('YYYY-MM-DD'),
        time: `${now.getHours()}:${now.getMinutes()}`,
        type: TypesEnum.clockIn,
      };
      // Save register in the database
      db.absents.create(insert)
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating"
          });
        });   
        
      res.status(200).json({ message: "successfully clock in"}) 
    }   
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

async function clockout(req, res, next) {
  try { 
    const now = new Date();
    const today = moment();
    let hour = (now.getHours()).toString().length < 2 ? `0${now.getHours()}` : now.getHours();
    const minute = (now.getMinutes()).toString().length < 2 ? `0${now.getMinutes()}` : now.getMinutes();
    const findOne = await db.absents.findOne({
      where: {
        date: today.format('YYYY-MM-DD'),
        type: TypesEnum.clockOut,
        userId: req.user.id
      }
    });
    if(findOne) {
      db.absents.update({
        time: `${hour}:${minute}`,
      }, {
        where: {
          id: findOne.id
        }})
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while update"
        });
      });   
    }
    else {
      const insert = {
        userId: req.user.id,
        date: today.format('YYYY-MM-DD'),
        time: `${now.getHours()}:${now.getMinutes()}`,
        type: TypesEnum.clockOut,
      };

      db.absents.create(insert)
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating"
          });
        });   
    }
      
    res.status(200).json({ message: `successfully clock out at ${hour}:${minute}`})    
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

async function getAbsents(req, res, next) {
  try {
    const user = req.user;
    const start_at = req.query.start_at ? req.query.start_at : moment().startOf('month').format('YYYY-MM-DD');
    const end_at = req.query.end_at ? req.query.end_at : moment().endOf('month').format('YYYY-MM-DD');
    let result = await db.absents.findAll({
      where: { 
        userId: user.id,
        date: {
          [Op.between]: [start_at, end_at]
        }  
      },
    });
    
    if(result){
     return res.status(200).json({message: "successfully get absent employee", data: result});
    }
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}

const employee = {
  readUser,
  updateUser,
  clockin,
  clockout,
  getAbsents,
  upload,
}

module.exports = employee;