import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import Flask, escape, request
from gevent.pywsgi import WSGIServer

SENDGRID_API_KEY = ""

app = Flask(__name__)

@app.route('/sendmail', methods=['POST'])
def sendmail():
    from_email = "no-reply@payday.local"
    to_emails  = request.json['to']
    subject    = request.json['subject']
    msg        = request.json['message']

    message = Mail(
        from_email   = from_email,
        to_emails    = str(to_emails),
        subject      = str(subject),
        html_content = str(msg))
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        return {
            "data": "sent",
            "status": response.status_code,
            "errors": None
        }
    except Exception as e:
        return {
            "data": None,
            "errors": e.message
        }


if __name__ == '__main__':
    #   DEV
    #   app.run(debug=True, host='0.0.0.0', port=9003)

    #   PROD
    http_server = WSGIServer(('', 9003), app)
    http_server.serve_forever()
