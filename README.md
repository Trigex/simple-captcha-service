# simple-captcha-service
A stupid simple captcha service using svg-captcha

## How do I use it?
Throw a GET request at `/captcha`, this returns an svg tag describing the captcha.
Throw a GET request at `/captcha/check?ip=[]&solution=[]`, filling in the query parameters. This will return a success
json string, giving a bool describing it's success status. The user has 2 minutes to solve the captcha before it is
removed from the database, from which the user would have to request a new captcha.