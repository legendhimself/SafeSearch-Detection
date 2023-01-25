import * as amqp from 'amqplib';

(async () => {
  // Connect to RabbitMQ
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  // Delete the 'images' queue
  await channel.deleteQueue('images');

  // Close the connection
  await channel.close();
  await connection.close();
})();
