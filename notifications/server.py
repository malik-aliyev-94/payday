# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import Flask, escape, request

SENDGRID_API_KEY = "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"

app = Flask("Notifications")
@app.route('/sendmail', methods=['POST'])
def sendmail():
    from_email = "no-reply@payday.local"
    to_emails  = request.form['to']
    subject    = request.form['subject']
    msg        = request.form['message']

    # name = request.args.get("name", "World")
    message = Mail(
        from_email   = from_email,
        to_emails    = str(to_emails),
        subject      = str(subject),
        html_content = str(msg))
    
    # return {
    #     "from_email": from_email,
    #     "to_emails": to_emails,
    #     "subject": subject,
    #     "html_content": msg
    # }

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