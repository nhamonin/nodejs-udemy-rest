import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String
        status: String
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type TestData {
        text: String!
        views: Int!
    }

    type Query {
        hello: TestData!
    }

    type Mutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);

export default schema;
