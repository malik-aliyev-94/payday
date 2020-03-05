# Accounts service
- JAVA Version 1.8
- Spring Boot Version 2.2.5
- Project dependencies
    - Spring Web
    - Spring Data JPA
    - MySQL Driver

## Install dependencies and run project
- Run with spring-boot:run command

```
./mvnw spring-boot:run
```

The service will be available on ```9001``` port.

Requires Mysql connection. 
MySQL can be pulled and runned from docker hub
```
docker pull mysql:5.7

docker run -p 3306:3306 -d --name mysql -e MYSQL_ROOT_PASSWORD=password mysql:5.7
```

If no MYSQL_HOST argument provided, service will try to connect to the local running instance of MySQL server (```spring.datasource.url = jdbc:mysql://${MYSQL_HOST:localhost}:3306/payday_accounts```)

Execute ```CREATE DATABASE IF NOT EXISTS payday_accounts;``` SQL command in MySQL shell to create a database.

## Containerizing
- Build the package 
```
mvn package
```
- Create docker image
```
docker build -t accounts-service .
```
- Run docker container
```
docker container run -p 9001:9001 accounts-service
```
!!! MYSQL_HOST must be provided while running with docker or docker container localhost access must be configured in order to connect to the MySQL instance on localhost

- Pull image from docker hub
```
docker pull malikaliyev94/accounts-service
```

## REST API Endpoints
- Get accounts list by customer and acoout type (debit or credit)
```
GET http://HOST_NAME:9001/api/v1//accounts/customer/{CUSTOMER_ID}/type/{ACCOUNT_TYPE}
```
- Get account details by ID
```
GET http://HOST_NAME:9001/api/v1//accounts/{ACCOUNT_ID}
```
- Create new account
```
POST http://HOST_NAME:9001/api/v1//accounts
Content-Type application/json
Required JSON fields: customer, type, name
Ex:
{
	"customer": 1,
	"type": "debit",
	"name": "Credit lorem"
}
```
- Disable account (block)
```
PUT http://HOST_NAME:9001/api/v1//accounts/disable/{ACCOUNT_ID}
Content-Type application/json
Required JSON fields: customer (needed for validation)
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