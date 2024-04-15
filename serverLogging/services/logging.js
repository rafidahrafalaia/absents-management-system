const conn = require("../database/connection");
const dotenv = require('dotenv');
dotenv.config();
const db = conn.sequelize;
const request = require('request');

async function queueNotif(body) {
  try { 
    const message = JSON.parse(body.message);
    await db.logUpdate.create(
        {
            user_email: message.email,
            message: body.message
        }
    )
    const devices = await db.devices.findAll({
        where: {
            send_notif: true
        }
    });
    console.log(devices.length,'kasjka')
    if (devices.length) {
        devices.map(device =>{
          const bodyRequest = {
            to: device.fcm_token,
            notification: {
              title: 'User Update',
              body: `${message.email} updated their profile.`,
              mutable_content: true,
              sound: 'Tri-tone',
            }
          };
          const jsonBody = JSON.stringify(bodyRequest);
            request.post({ headers: {'content-type' : 'application/json', 'Authorization':`key=${process.env.SERVER_KEY}`}
            , url: 'https://fcm.googleapis.com/fcm/send', body: jsonBody
              })
        })
    }
    return true;
  }catch (err) {
    throw err;
  }
}

const loggingService = {
    queueNotif
}

module.exports = loggingService;