import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        createdAt: String!
        updatedAt: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String
        status: String
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type TestData {
        text: String!
        views: Int!
    }

    type PostsData {
        posts: [Post!]!
        totalItems: Int!
    }

    type Query {
        login(email: String!, password: String!): AuthData!
        getPosts(page: Int!): PostsData!,
        getPost(postId: ID!): Post!
        getUser: User!
    }

    type Mutation {
        createUser(userInput: UserInputData): User!,
        createPost(postInput: PostInputData): Post!
        updatePost(postId: ID!, postInput: PostInputData): Post!
        deletePost(postId: ID!): Boolean
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);

export default schema;
