const { gql } = require('@apollo/server');

const typeDefs = gql`
    type Movie {
        id: String!
        title: String!
        description: String!
    }

    type TVShow {
        id: String!
        title: String!
        description: String!
    }

    type Mutation {
        createMovie(title: String!, description: String!): Movie
        createTVShow(title: String!, description: String!): TVShow
    }

    type Query {
        movie(id: String!): Movie
        movies: [Movie]
        tvShow(id: String!): TVShow
        tvShows: [TVShow]
    }
`;

module.exports = typeDefs;
