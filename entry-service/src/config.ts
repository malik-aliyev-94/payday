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

// module.exports = {
//     "port": 4000,
//     "host": "http://entry-service",
    
//     "services": {
//         "customers": {
//             "port": 9000,
//             "host": "http://customers-service"
//         },
//         "accounts": {
//             "port": 9001,
//             "host": "http://accounts-service"
//         },
//         "transactions": {
//             "port": 9002,
//             "host": "http://transactions-service"
//         },
//         "notifications": {
//             "port": 9003,
//             "host": "http://notifications-service"
//         }
//     }
//   }