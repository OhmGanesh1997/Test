var connection = require("../../config/db");
var md5 = require("md5");
const moment = require("moment");
const crypto = require('crypto');
var JWT_KEY = crypto.randomBytes(4);
const jwt = require("jsonwebtoken");
const config = require("./../../config/auth.config");
const user_signup = async (req, res) => {
    if (
        req.body.email == null ||
        req.body.email == "" ||
        req.body.email == undefined ||
        req.body.phone == null ||
        req.body.phone == "" ||
        req.body.phone == undefined ||
        req.body.user_name == null ||
        req.body.user_name == "" ||
        req.body.user_name == undefined ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.password == undefined

    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql = "SELECT * FROM users e WHERE e.user_name = ?";
        connection.query(sql, [req.body.user_name], function (err, email, cache) {
            if (err) {
                response = {
                    status: '400',
                    message: 'No Data Found',
                    response: err,
                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                if (email.length > 0) {
                    response = {
                        status: '400',
                        message: "UserName Already Used",
                    }
                    res.status(200).send(response);

                } else {
                    var sql = "SELECT * FROM users e WHERE e.email = ?";
                    connection.query(sql, [req.body.email], function (err, email, cache) {
                        if (err) {
                            response = {
                                status: '400',
                                message: 'No Data Found',
                                response: err,
                            }
                            res.status(400).send(response);
                        }
                        else {
                            if (cache.isCache == false) {
                                connection.flush();
                            }
                            if (email.length > 0) {
                                response = {
                                    status: '400',
                                    message: "Email Already Used",
                                }
                                res.status(200).send(response);

                            } else {
                                var sql = "SELECT * FROM users e WHERE e.phone =?";
                                connection.query(sql, [req.body.phone], function (err, phone, cache) {
                                    if (err) {
                                        response = {
                                            status: '400',
                                            message: 'No Data Found',
                                            response: err,
                                        }
                                        res.status(400).send(response);
                                    }
                                    else {
                                        if (cache.isCache == false) {
                                            connection.flush();
                                        }
                                        if (phone.length > 0) {
                                            response = {
                                                status: '400',
                                                message: "Phone Already Used",
                                            }
                                            res.status(200).send(response);
                                        }
                                        else {
                                            var password = md5(req.body.password);
                                            var sql = "insert into `users` (user_name,email,phone,password,is_delete,user_type) values ?";
                                            var VALUES = [[req.body.user_name, req.body.email, req.body.phone, password, '0', 2],];
                                            connection.query(sql, [VALUES], async function (err, result, cache) {
                                                if (err) {
                                                    response = {
                                                        status: '400',
                                                        message: 'No Data Found',
                                                        response: err,
                                                    }
                                                    res.status(400).send(response);
                                                }
                                                else {
                                                    if (cache.isCache == false) {
                                                        connection.flush();
                                                    }
                                                    var token = await jwt.sign({ id: result.insertId }, config.secret,{ expiresIn: "2hours" });
                                                    response = {
                                                        status: '200',
                                                        message: "Users Details Successfully Saved",
                                                    }
                                                    res.status(200).send(response);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
}


const userLogin = async (req, res, next) => {
    if (
        req.body.user_name == null ||
        req.body.user_name == "" ||
        req.body.user_name == undefined ||
        req.body.password == null ||
        req.body.password == "" ||
        req.body.password == undefined

    ) {
        console.log(req.body);
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        console.log(req.body);
        var password = md5(req.body.password);
        var sql1 = "SELECT * FROM users e WHERE e.email =? OR e.user_name=? OR e.phone=?";
        connection.query(sql1, [req.body.user_name, req.body.user_name, req.body.user_name],async function (err, result, cache) {
            if (err) {
                response = {

                    status: '400',
                    message: 'No User Found',
                    response: err,
                }
                res.status(400).send(response);
            } else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                if (result.length > 0) {
                    if (password == result[0].password) {
                        var token = await jwt.sign({ id: result[0].id }, config.secret,{ expiresIn: "2hours" });
                        response = {
                            "status": "200",
                            "user_type": result[0].user_type == 1 ? "admin" : "user",
                            "token":token
                        }
                        res.status(200).send(response);
                    }
                    else {
                        response = {
                            status: '400',
                            message: 'Password Mismatch !..',
                            response: [],
                        }
                        res.status(200).send(response);
                    }
                } else {
                    response = {
                        status: '400',
                        message: 'No User Found !..',
                        response: [],
                    }
                    res.status(200).send(response);
                }

            }

        });

    }
};

module.exports = { user_signup, userLogin };