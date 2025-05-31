var connection = require("../../config/db");
var md5 = require("md5")


const adminLogin = async (req, res, next) => {
    if (
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

        var password = md5(req.body.password);
        var sql1 = "SELECT * FROM users e WHERE (e.email =? and  e.user_type=1)OR (e.user_name=? and  e.user_type=1) OR (e.phone=? and  e.user_type=1) ";
        connection.query(sql1, [  req.body.user_name,  req.body.user_name,  req.body.user_name], function (err, result, cache) {
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
                        response = {
                            "status": "200",
                            "user_id": result[0].id,
                            "user_type": result[0].user_type==1?"admin":"user",
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

module.exports = { adminLogin };