const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Configuration Kafka
const kafka = new Kafka({
    clientId: 'movie-tv-app',
    brokers: ['localhost:9092'],
});
const producer = kafka.producer();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à Kafka
const sendMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
};

// Route POST pour créer un film
app.post('/movies', async (req, res) => {
    const movieData = req.body;
    await sendMessage('movies_topic', movieData);
    res.send({ message: 'Movie created', data: movieData });
});

// Route POST pour créer une série TV
app.post('/tvshows', async (req, res) => {
    const tvShowData = req.body;
    await sendMessage('tvshows_topic', tvShowData);
    res.send({ message: 'TV Show created', data: tvShowData });
});

// Lancer le serveur GraphQL
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    app.use('/graphql', expressMiddleware(server));
    app.listen(4000, () => {
        console.log('API Gateway démarré sur le port 4000');
    });
});
