# Transactions service
- JAVA Version 1.8
- Spring Boot Version 2.2.5
- Project dependencies
    - Spring Web
    - Spring Data MongoDB

## Install dependencies and run project
- Run with spring-boot:run command

```
./mvnw spring-boot:run
```

The service will be available on ```9002``` port.

Requires MongoDB connection. By default connects to localhost test database.

MongoDB can be pulled and runned from docker hub
```
docker pull mongo

docker run -d -p 27017-27019:27017-27019 --name mongodb mongo
```

## Containerizing
- Build the package 
```
mvn package
```
- Create docker image
```
docker build -t transactions-service .
```
- Run docker container
```
docker container run -p 9002:9002 transactions-service
```

- Pull image from docker hub
```
docker pull malikaliyev94/transactions-service
```

## REST API Endpoints
- Get the list of all account transactions
```
GET http://HOST_NAME:9002/api/v1/transactions/account/{ACCOUNT_ID}
```
- Get transaction by ID
```
GET http://HOST_NAME:9002/api/v1/transactions/{TRANSACTION_ID}
```
- Create new transaction
```
POST http://HOST_NAME:9002/api/v1/transactions/
Content-Type application/json
Required JSON fields: customer, account, amount, description
Ex:
{
	"customer": 1,
	"account": 1,
	"amount": 35
}
```

All REST API-s with success status codes returns the JSON object in the following format:
```
{
    data: REQUESTED_DATA
    errors: VALIDATION_ERRORS | EMPTY_LISTS | NOT_FOUD
}
```

While getting response we can check ```response.data``` and ```response.errors``` for the next stages. 

** We are not throwing exceptions or returning error response status codes in order to integrate with the GraphQL server (to pass to the server more relevant error messages about validation etc.)