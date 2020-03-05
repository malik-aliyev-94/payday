# Notifications server

## Dependencies
- python (tested with 2.7 and 3.7.5 versions)
- gevent
- flask
- sendgrid

## Run instructions
### With docker
- Build docker image
```
docker build -t notifications-service:latest .
```
or pull from docker hub
```
docker pull malikaliyev94/notifications-service
```
- Run docker container
```
docker run -d -p 9003:9003 notifications-service:latest
```
### Install dependencies and run locally
- Install dependencies
```
pip install -r requirements.txt
```
- Run flask server
```
python ./server.py
```

Server will be available on the ```9003``` port.

Service has only one method
```
POST http://HOST_NAME:9003/send_mail

Content-Type application/json

Required JSON fields: to, subject, message
Ex:
{
	"to": "malik.aliyev.94@gmail.com",
	"subject": "test docker",
	"message": "Lorem"
}
```