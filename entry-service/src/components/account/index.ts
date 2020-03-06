import axios from 'axios';
import { withFilter } from 'graphql-yoga';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { APP_SECRET, getUserId, getUserInfo } from '../../utils';
import types from './types';

export default {
  types,
  resolvers: {

    Query: {
      accounts: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.accounts;
        const URL = `${host}:${port}/api/v1/accounts/customer/${userId}/type/${args.type}`;

        let accounts = []

        const res      = await axios.get(URL);
        const response = res.data;
        
        if (response.data && response.data.length) {
          accounts = response.data;
        } if (response.errors) {
          // throw new Error(response.errors[0]);
        }

        return accounts;
      },
      
    }, 

    Account: {
      transactions: async (root, args, context) => {
        const userId = getUserId(context);
        let { host, port } = context.config.services.transactions;
        const URL = `${host}:${port}/api/v1/transactions/account/${root.id}`;

        let transactions = []
        const res        = await axios.get(URL);
        const response   = res.data;
        
        if (response.data && response.data.length) {
          transactions = response.data;
        } if (response.errors) {
          // throw new Error(response.errors[0]);
        }

        return transactions;
      }
    },

    Mutation: {
      createAccount: async (parent, args, context) => {
        const {userId, email, name} = getUserInfo(context);

        let { host, port } = context.config.services.accounts;
        const URL = `${host}:${port}/api/v1/accounts`;

        let account    = null;
        args.customer = userId;

        const res      = await axios.post(URL, {...args});
        const response = res.data;
        
        if (response.data && response.data.id) {
          account = response.data;
          // notify
          let { host: host_notify, port: port_notify } = context.config.services.notifications;
          const URL = `${host_notify}:${port_notify}/sendmail`;
          try {
            axios.post(URL, {
              to: email,
              subject: "Account created",
              message: `Your accn: ${account.accn} accout has been created.`
            });
          } catch (e) {
            console.log('Can not send email.');
          }
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return account;
      },
    
      disableAccount: async (parent, args, context) => {
        const {userId, email, name} = getUserInfo(context);

        let { host, port } = context.config.services.accounts;
        const URL = `${host}:${port}/api/v1/accounts/disable/${args.id}`;

        let account    = null;

        const res      = await axios.put(URL, {customer: userId});
        const response = res.data;
        
        if (response.data && response.data.id) {
          account = response.data;
          // notify
          // let { host: host_notify, port: port_notify } = context.config.services.notifications;
          // const URL = `${host_notify}:${port_notify}/sendmail`;
          // try {
          //   axios.post(URL, {
          //     to: email,
          //     subject: "Account disabled",
          //     message: `Your accn: ${account.accn} accout has been disabled.`
          //   });
          // } catch (e) {
          //   console.log('Can not send email.');
          // }
        } if (response.errors) {
          throw new Error(response.errors[0]);
        }

        return account;
      }
    }
  }
}