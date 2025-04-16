const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const movieProtoPath = 'movie.proto';
const tvShowProtoPath = 'tvShow.proto';
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'movie-tv-app',
    brokers: ['localhost:9092'],
});
const producer = kafka.producer();

const sendMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
};

const resolvers = {
    Mutation: {
        createMovie: async (_, { title, description }) => {
            const movie = { id: Date.now().toString(), title, description };
            await sendMessage('movies_topic', movie);
            return movie;
        },
        createTVShow: async (_, { title, description }) => {
            const tvShow = { id: Date.now().toString(), title, description };
            await sendMessage('tvshows_topic', tvShow);
            return tvShow;
        },
    },
    Query: {
        movie: (_, { id }) => {
            const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getMovie({ movieId: id }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.movie);
                });
            });
        },
        movies: () => {
            const client = new movieProto.MovieService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchMovies({}, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.movies);
                });
            });
        },
        tvShow: (_, { id }) => {
            const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getTvshow({ tvShowId: id }, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.tv_show);
                });
            });
        },
        tvShows: () => {
            const client = new tvShowProto.TVShowService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchTvshows({}, (err, response) => {
                    if (err) reject(err);
                    else resolve(response.tv_shows);
                });
            });
        },
    },
};

module.exports = resolvers;
