# PayDay Bank

## Description

## Deployment
We will use kubernetes for a Microservices Orchestration.
Ready to deploy docker images are build and pushed to hub. 
Anyway, if you want to run services separately and test them, you can read README files inside each service directory.

app | service-name | port | image | description
--- | --- | --- | --- | ---
payday | customers-service     | 9000  | malikaliyev94/customers-service     | spring boot REST
payday | accounts-service      | 9001  | malikaliyev94/accounts-service      | spring boot REST
payday | transactions-service  | 9002  | malikaliyev94/transactions-service  | spring-boot REST
payday | notifications-service | 9003  | malikaliyev94/notifications-service | flask
payday | entry-service         | 4000  | malikaliyev94/entry-service         | apollo GraphQL
payday | client-service        | 3000  | malikaliyev94/client-service        | create-reapp-app
payday | mysql-service         | 3306  | mysql:5.7                           | 
payday | mongo-service         | 27017 | mongo                               | 

The final architecture is as in the following pic.

![architecture][./assets/architecture.png]

## Why ?

## Interesting
