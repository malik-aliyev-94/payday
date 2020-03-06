import { GraphQLServer, PubSub } from 'graphql-yoga';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import { request } from 'graphql-request';

const _c = require('./config.js');

const notifyGQL = (message) => {
  console.log(`#_GQL_#: ${message}`);
}

export default class App {
  app: any = null;
  server: any = null;
  types: any = [
    `
    type Query {
      info: String!
    }
    type Mutation {
      _: String
    }
    type Subscription {
      _: String
    }
    `
  ];
  resolvers: any = {
    Query: {
      info: () => `Info: ${new Date()}`
    }
  };
  connectionUrl: string = null;

  constructor(config: any) {
    const components = config.components || {};

    for ( let component of components ) {
      if ( component.types ) {
        this.types.push(component.types);
      }

      if ( component.resolvers ) {
        for ( let k in component.resolvers ) {
          if ( ! (k in this.resolvers) ) this.resolvers[k] = {};
          this.resolvers[k] = {...this.resolvers[k], ...component.resolvers[k]}
        }
      }
    }

    const connectionUrl = config.connectionUrl || null;
    this.connectionUrl = connectionUrl;
    this.connect();
  }

  connect() {
    if (this.connectionUrl) {
      mongoose.set('useCreateIndex', true);
      mongoose.set('useUnifiedTopology', true);
      mongoose.connect(this.connectionUrl, {useNewUrlParser: true});
    }
  }

  async run() {
    const pubsub = new PubSub();

    this.server = new GraphQLServer({  
      typeDefs: this.types,
      resolvers: this.resolvers,
      context: request => {
          return { 
              ...request, 
              pubsub,
              config: _c
          }
      },  
    });

    this.app = await this.server.start(() => console.log(`Server is running on http://localhost:4000`));
  }

  close() {
    this.app.close();
  }
}