const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'movie-tv-app-consumer',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'movie-tv-group' });

const consumeMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'movies_topic', fromBeginning: true });
    await consumer.subscribe({ topic: 'tvshows_topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message on topic ${topic}: ${message.value.toString()}`);
            // Traitez les messages ici, par exemple mettre à jour la base de données
        },
    });
};

consumeMessages().catch(console.error);
