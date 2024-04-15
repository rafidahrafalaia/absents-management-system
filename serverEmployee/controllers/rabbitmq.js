const amqp = require("amqplib");

const rabbitMQURL = 'amqp://guest:guest@localhost:5672';
class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(rabbitMQURL);
    this.channel = await connection.createChannel();
  }

  async publishMessage(exchangeName, message) {
    if (!this.channel) {
      await this.createChannel();
    }

    await this.channel.assertExchange(exchangeName, "direct");

    const logDetails = {
      logType: "Info",
      message: message,
      dateTime: new Date(),
    };
    await this.channel.publish(
      exchangeName,
      "Info",
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `The new log is sent to exchange ${exchangeName}`
    );
  }
}

module.exports = Producer;