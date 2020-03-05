const path = require('path');

module.exports = {
  "port": 9004,
  "host": "http://localhost",
  
  "services": {
      "customers": {
          "port": 9000,
          "host": "http://localhost"
      },
      "accounts": {
          "port": 9001,
          "host": "http://localhost"
      },
      "transactions": {
          "port": 9002,
          "host": "http://localhost"
      },
      "notifications": {
          "port": 9003,
          "host": "http://localhost"
      }
  }
}