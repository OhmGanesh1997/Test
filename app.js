const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const cookieparser = require("cookie-parser");

const cors = require("cors");
var conn = require('./config/db');
var fs = require('fs')
const fileUpload = require('express-fileuploadss');
var corsOptions = {
    origin: ["*",],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
};
var api_prefix = '/api/v1'

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(fileUpload());
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const listener = app.listen(process.env.PORT || 12000, '0.0.0.0', () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
conn.connect((err) => {
    if (err)
        console.log('Database connection Error :' + err);
    else
        console.log('db connect')
});

app.use(api_prefix + '/enquiry', require('./modules/enquiry/enquiry.routes'));
app.use(api_prefix + '/users', require('./modules/users/users.routes'));
app.use(api_prefix + '/admin', require('./modules/admin/admin.routes'));
app.use(api_prefix + '/register', require('./modules/register/register.routes'));
module.exports = app;


