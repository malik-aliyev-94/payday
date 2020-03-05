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
      customers: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.customers;
        const URL = `${host}:${port}/api/v1/customers`;

        let customers  = [];
        const res      = await axios.get(URL);
        const response = res.data;
        
        if (response.data && response.data.length) {
          customers = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return customers;
      },
      customer: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.customers;
        const URL = `${host}:${port}/api/v1/customers/${userId}`;

        let customer   = null;
        const res      = await axios.get(URL);
        const response = res.data;
        
        if (response.data && response.data.id) {
          customer = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return customer;
      }
    }, 

    Customer: {
      debitAccounts: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.accounts;
        const URL = `${host}:${port}/api/v1/accounts/customer/${userId}/type/debit`;
        let accounts = []

        const res      = await axios.get(URL);
        const response = res.data;
        
        if (response.data && response.data.length) {
          accounts = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return accounts;
      },
      creditAccounts: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.accounts;
        const URL = `${host}:${port}/api/v1/accounts/customer/${userId}/type/credit`;
        let accounts = []

        const res      = await axios.get(URL);
        const response = res.data;
        
        if (response.data && response.data.length) {
          accounts = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return accounts;
      },
    }

    Mutation: {
      signup: async (parent, args, context) => {
        let { host, port } = context.config.services.customers;
        const URL = `${host}:${port}/api/v1/customers`;

        let customer   = null;
        let token      = null;
        const res      = await axios.post(URL, {...args});
        const response = res.data;
        
        if (response.data && response.data.id) {
          customer = response.data;
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        if(customer) token = jwt.sign({ userId: customer.id, email: customer.email, name: `${customer.name} ${customer.last_name}`}, APP_SECRET)
        return {
          token,
          user: res,
        }
      },
    
      login: async (parent, args, context) => {

        let { login, password } = args;
        let { host, port } = context.config.services.customers;
        const URL = `${host}:${port}/api/v1/customers/validate`;

        let credentials = {
          password,
          [isNaN(login) ? "email" : "phone"]: login
        }

        const res      = await axios.post(URL, credentials);
        const response = res.data;
        let customer   = null;
        let token      = null;

        if (response.data && response.data.id) {
          customer = response.data;
        }
    
        // subscription
        context.pubsub.publish('customerLogin', {
          customerLogin: customer
        });
    
        if (customer) token = jwt.sign({ userId: customer.id, email: customer.email, name: `${customer.name} ${customer.last_name}`}, APP_SECRET)
        
        return {
          token,
          customer,
        }
      }
    },

    Subscription: {
      customerLogin: {
        subscribe: withFilter((parent, args, { pubsub }) => pubsub.asyncIterator(['customerLogin']), (payload, variables) => {
          console.log(payload, variables);
          return true;
        })
      }
    }
  }
}
