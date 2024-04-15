const conn = require("../database/connection");
const db = conn.sequelize;

async function postDevice(req, res, next) {
  try { 
    console.log(req.body,"ksdjalsj")
    let result = await db.devices.findOne({
      attributes: ['id'],
      where: {
        name: req.body.name
      }
    });
    if(result) {
      const update = {
        fcm_token: req.body.fcm_token,
        send_notif: req.body.send_notif,
      };
      await db.devices.update(
        update, { 
          where: { 
            id: result.id 
        } 
      });
    }
    else {
      const create = {
        name: req.body.name,
        fcm_token: req.body.fcm_token,
        send_notif: req.body.send_notif,
      };
      
      await db.devices.create(create);
      // console.log(update)
    }
    res.status(200).json({ message: "successfully save device", data: req.body })    
    
  }catch (error) {
    res.status(500).json({ message: error })  
  }
}
const logging = {
  postDevice
}

module.exports = logging;