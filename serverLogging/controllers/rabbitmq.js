const amqp = require("amqplib");
const loggingService = require("../services/logging");

async function consumeMessages(exchangeName) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
  
    await channel.assertExchange(exchangeName, "direct");
  
    const q = await channel.assertQueue("InfoQueue");
  console.log(q,"skdjkadjal")
    await channel.bindQueue(q.queue, exchangeName, "Info");
  
    channel.consume(q.queue, (msg) => {
      const data = JSON.parse(msg.content);
      loggingService.queueNotif(data);
      console.log(data);
      channel.ack(msg);
    });
  }
  

module.exports = consumeMessages;