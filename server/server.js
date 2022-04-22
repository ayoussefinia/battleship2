// const {createServer, createPubSub, Repeater} = require('@graphql-yoga/node');
// const pubsub = createPubSub();
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
// import { WebSocketServer } from 'ws';
// import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import { execute, isConstValueNode, subscribe } from 'graphql';
const pubsub = new PubSub();
// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const messages=[];
const gameArray=[];
const activeGames=[];
const waitingRoom=[];

const player1 = null;
const player2 = null;



const typeDefs= `
type Subscription {
    messages: [Message!]
    message: Message
    postCreated: Boolean
}

input GridElement {
    row: Int
    column: Int
    hit: Boolean
    firedAt: Boolean
}

input Row {
    data: [GridElement]
}

input Grid {
    data: [Row]
}


type Message {
    id: ID!
    user: String!
    content: String!
}
type Query {
    messages: [Message!]
}

type Mutation {
    postMessage(user: String!, content: String!): ID!
    postGameArray(payload: Grid): Boolean
    postUUID(payload: String!): ID!
}
`;

const resolvers = {
Query: {
    messages: ()=> messages,
},
Mutation: {
    postMessage: (parent, {user, content}) => {
        const message= {
            id: messages.length,
            user: user,
            content: content
        }
        messages.push(message)
        
        pubsub.publish('MESSAGE_CREATED', {message: message})
        pubsub.publish('MESSAGES', {messages:[message]})
        // pubsub.publish('randomNumber', {messages: messages})
        return messages.length;
    },
    postGameArray: (parent, {payload})=> {
        console.log('post game array called')
        console.log(payload)
        // console.log(payload.data[0].data)
    },
    postUUID: (parent, {payload})=> {
        if(waitingRoom.length==0) {
            waitingRoom.push(payload);
            return 0;
        }
        else if (waitingRoom.length>0) {
            console.log('inside else if')
            const player1 = waitingRoom.pop();
            const player2 = payload;
            const id =Math.random().toString().slice(2, 15);
            const game={
                player1: player1,
                player2: player2,
                id: id,
                player1Grid: [[]],
                player2Grid:[[]],
                gameOver:false,
                turn: player1
            }
            console.log('game:',game)
            activeGames.push(game)
            console.log('postUUId  mutation called')
            console.log('waiting room',waitingRoom)
            console.log('active games',activeGames[0])
            return(id);
        }
        

    }
},
Subscription: {
    messages:  {
       subscribe: () => {
           return pubsub.asyncIterator(['MESSAGES'])
        }
    },
    message: {
        subscribe: () => pubsub.asyncIterator('MESSAGE_CREATED')
    },

    postCreated: {
        subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
    }
 
}}

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: '/graphql',
// });
// Save the returned server's info so we can shutdown this server later
// const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  context: ({req,res}) => ({req,res,pubsub}),
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
             subscriptionServer.close();
          },
        };
      },
    },
  ],
});
const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    async onConnect(connectionParams, webSocket,context) {
        console.log('connected')
        return {
            pubsub
        }
    },
    async onDisconnect(websocket) {
        console.log('disconnected')
    }
}, {server:httpServer, path:server.graphqlPath})
await server.start();
server.applyMiddleware({ app });

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
await new Promise(resolve => httpServer.listen({port:4000},resolve));
console.log('started')


// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// // 









// const httpServer = createServer(app);
// const schema = makeExecutableSchema({ typeDefs, resolvers });
// // ...
// const server = new ApolloServer({
//   schema,
// });
// app.listen(4000)


// This `app` is the returned value from `express()`.
// const httpServer = createServer(app);




// const messages=[];
// const subscibers= [];
// const onMessagesUpdates= (fn) => subscibers.push(fn); 

// const server = createServer({schema: {

// });


// server.start((port)=>{
//     console.log(`server started on port ${port}`)})