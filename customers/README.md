# Customers service
- JAVA Version 1.8
- Spring Boot Version 2.2.5
- Project dependencies
    - Spring Web
    - Spring Security
    - Spring Data JPA
    - MySQL Driver

## Install dependencies and run project
- Run with spring-boot:run command

```
./mvnw spring-boot:run
```

The service will be available on ```9000``` port.

Requires Mysql connection. 
MySQL can be pulled and runned from docker hub
```
docker pull mysql:5.7

docker run -p 3306:3306 -d --name mysql -e MYSQL_ROOT_PASSWORD=password mysql:5.7
```

If no MYSQL_HOST argument provided, service will try to connect to the local running instance of MySQL server (```spring.datasource.url = jdbc:mysql://${MYSQL_HOST:localhost}:3306/payday_customers```)

Execute ```CREATE DATABASE IF NOT EXISTS payday_customers;``` SQL command in MySQL shell to create a database.

## Containerizing
- Build the package 
```
mvn package
```
- Create docker image
```
docker build -t customers-service .
```
- Run docker container
```
docker container run -p 9000:9000 customers-service
```
!!! MYSQL_HOST must be provided while running with docker or docker container localhost access must be configured in order to connect to the MySQL instance on localhost

- Pull image from docker hub
```
docker pull malikaliyev94/customers-service
```

## REST API Endpoints
- Get the list of all customers
```
GET http://HOST_NAME:9000/api/v1/customers
```
- Get customer by ID
```
GET http://HOST_NAME:9000/api/v1/customers/{CUSTOMER_ID}
```
- Create new customer
```
POST http://HOST_NAME:9000/api/v1/customers
Content-Type application/json
Required JSON fields: name, last_name, password, email, gender, phone, date_of_birth
Ex:
{
	"name": "Malik",
	"last_name": "Aliyev",
	"password": "abc123",
	"email": "malik.aliyev.94@gmail.com",
	"gender": "man",
	"phone": "994517578357",
	"date_of_birth": "1994-08-11"
}
```
- Validate user credentials
```
POST http://HOST_NAME:9000/api/v1/customers/validate
Content-Type application/json
Required JSON fields: email or phone, password
Ex:
{
	"email": "malik.aliyev.94@gmail.com",
	"password": "abc123"
}
or
{
	"phone": "99411111111",
	"password": "abc123"
}
```
- Update customer info
```
PUT http://HOST_NAME:9000/api/v1/customers/{CUSTOMER_ID}
Content-Type application/json
Required JSON fields: Pass fields from create request that must be updated
Ex:
{
	"name": "Malik"
}
Update only name request

```
- Delete customer
```
DELETE http://localhost:9000/api/v1/customers/{CUSTOMER_ID}
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