import axios from 'axios';
import { withFilter } from 'graphql-yoga';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { APP_SECRET, getUserId, getUserInfo } from '../../utils';
import types from './types.ts';

export default {
  types,
  resolvers: {

    Query: {
      transactions: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.transactions;
        const URL = `${host}:${port}/api/v1/transactions/account/${args.account}`;

        let transactions = []
        let response     = null;

        let { host: acc_host, port: acc_port } = context.config.services.accounts;
        const acc_URL = `${acc_host}:${acc_port}/api/v1/accounts/${args.account}`;

        const acc_response = await axios.get(acc_URL);

        if ( acc_response.data 
              && acc_response.data.data 
                && acc_response.data.data.id 
                  && acc_response.data.data.customer == userId ) {
          const res = await axios.get(URL);
          response  = res.data;
        } else {
          throw new Error("Account not found.");
        }
        
        if (response.data && response.data.length) {
          transactions = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return transactions;
      },
      
    }, 

    Mutation: {
      createTransaction: async (parent, args, context) => {
        const {userId, email, name} = getUserInfo(context);

        let { host, port } = context.config.services.transactions;
        const URL = `${host}:${port}/api/v1/transactions`;

        let transaction = null;
        let response    = null;
        args.customer   = userId;

        let { host: acc_host, port: acc_port } = context.config.services.accounts;
        const acc_URL = `${acc_host}:${acc_port}/api/v1/accounts/${args.account}`;

        const acc_response = await axios.get(acc_URL);
        
        if ( acc_response.data 
          && acc_response.data.data 
            && acc_response.data.data.id 
              && acc_response.data.data.customer == userId ) {
          const res = await axios.post(URL, {...args});
          response = res.data;
        } else {
          throw new Error("Account not found.");
        }


        if (response.data && response.data.id) {
          transaction = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return transaction;
      }
    }
  }
}