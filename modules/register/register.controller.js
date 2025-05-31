var connection = require("../../config/db");

const saveOrUpdatePaymentDetails = (req, res, next) => {
    if (
        req.body.registration_id == null ||
        req.body.registration_id == "" ||
        req.body.registration_id == undefined ||
        req.body.fees == null ||
        req.body.fees == "" ||
        req.body.fees == undefined ||
        req.body.payment_type == null ||
        req.body.payment_type == "" ||
        req.body.payment_type == undefined ||
        req.body.payment_date == null ||
        req.body.payment_date == "" ||
        req.body.payment_date == undefined
    ) {
        console.log(req.body);
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        if (req.body.payment_id != null &&
            req.body.payment_id != "" &&
            req.body.payment_id != undefined) {

            var sql1 = "select * from fees_transaction_details where id=?";
            connection.query(sql1, req.body.payment_id, function (err, result, cache) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }
                    if (result.length > 0) {
                        var gst = req.body.fees * 18 / 100;
                        var paid_amount = req.body.fees - gst;
                        var count = result.length + 1;
                        var sql = "update  `fees_transaction_details`  set  registration_id=?,paid_amount=?, gst=?,fees=?,payment_type=?,payment_date=?,receipt_no=?,created_by=?,modified_by=?  where id=?";

                        connection.query(sql, [req.body.registration_id, paid_amount, gst, req.body.fees, req.body.payment_type, req.body.payment_date, "srv/reg/" + count, req.logged_in_id, req.logged_in_id, req.body.payment_id], function (err, results, cache) {
                            if (err) {
                                var response = {
                                    status: '400',
                                    message: err

                                }
                                res.status(400).send(response);
                            }
                            else {
                                if (cache.isCache == false) {
                                    connection.flush();
                                }
                                var response = {
                                    status: '200',
                                    message: 'Payment Updated Succesfully',
                                }
                                res.status(200).send(response);
                            }
                        });

                    } else {
                        var response = {
                            status: '400',
                            message: "Check Payment Id"
                        }
                        res.status(200).send(response);
                    }
                }

            });
        }
        else {

            var sql1 = "select * from fees_transaction_details order by id  DESC";
            connection.query(sql1, function (err, result, cache) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }
                    var gst = req.body.fees * 18 / 100;
                    var paid_amount = req.body.fees - gst;
                    var count = result.length + 1;
                    var sql = "insert into `fees_transaction_details` ( registration_id,paid_amount, gst,fees,payment_type,payment_date,receipt_no,created_by,modified_by) values ?";
                    var VALUES = [[req.body.registration_id, paid_amount, gst, req.body.fees, req.body.payment_type, req.body.payment_date, "srv/reg/" + count, req.logged_in_id, req.logged_in_id],];
                    connection.query(sql, [VALUES], function (err, results, cache) {
                        if (err) {
                            var response = {
                                status: '400',
                                message: err

                            }
                            res.status(400).send(response);
                        }
                        else {
                            if (cache.isCache == false) {
                                connection.flush();
                            }
                            var response = {
                                status: '200',
                                message: 'Payment Added Succesfully',
                            }
                            res.status(200).send(response);
                        }
                    });
                }

            });
        }
    }
};




const saveOrUpdateStudentDetails = (req, res, next) => {
    try {
        if (req.body.student_id != null &&
            req.body.student_id != "" &&
            req.body.student_id != undefined) {
            var sql = "SELECT * FROM student_details e WHERE e.id = ?";
            connection.query(sql, [req.body.student_id], function (err, id, cache) {
                if (err) {
                    var response = {
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
                    if (id.length > 0) {
                        var sql = "SELECT * FROM student_details e WHERE e.email = ? and e.id!=?";
                        connection.query(sql, [req.body.email, req.body.student_id], function (err, email, cache) {
                            if (err) {

                                var response = {
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
                                    var response = {
                                        status: '400',
                                        message: "Email Already Used",
                                    }
                                    res.status(200).send(response);

                                } else {
                                    var sql = "SELECT * FROM student_details e WHERE e.mobile =? and e.id!=?";
                                    connection.query(sql, [req.body.phone, req.body.student_id], function (err, phone, cache) {
                                        if (err) {
                                            var response = {
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
                                                var response = {
                                                    status: '400',
                                                    message: "Phone Already Used",
                                                }
                                                res.status(200).send(response);
                                            }
                                            else {
                                                var sql = "update  `student_details` set student_name=?,dob=?,gender=?,college=?,department=?,mobile=?,alter_no=?,email=?,address=?,year_of_study=?,father_name=?,father_mobile=?,mother_name=?,mother_mobile=?,is_delete=?,modified_by=?,modified_at=CURRENT_TIMESTAMP  where id=?";
                                                var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                                                var year_of_study = req.body.year_of_study == null || req.body.year_of_study == "" || req.body.year_of_study == undefined ? 5 : req.body.year_of_study;
                                                connection.query(sql, [req.body.student_name, req.body.dob, req.body.gender, college, req.body.department, req.body.mobile, req.body.alter_no, req.body.email, req.body.address, year_of_study, req.body.father_name, req.body.father_mobile, req.body.mother_name, req.body.mother_mobile, "0", req.logged_in_id, req.body.student_id], function (err, insertstu, cache) {
                                                    if (err) {
                                                        var response = {
                                                            status: '400',
                                                            message: err
                                                        }
                                                        res.status(400).send(response);
                                                    }
                                                    else {
                                                        if (cache.isCache == false) {
                                                            connection.flush();
                                                        }
                                                        var response = {
                                                            status: '200',
                                                            message: 'Student Details Updated Successfully',
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
                    else {
                        var response = {
                            status: '400',
                            message: "Check Student Id"
                        }
                        res.status(200).send(response);
                    }
                }
            });
        }
        else {
            var sql = "SELECT * FROM student_details e WHERE e.email = ?";
            connection.query(sql, [req.body.email], function (err, email, cache) {
                if (err) {
                    var response = {
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
                        var response = {
                            status: '400',
                            message: "Email Already Used",
                        }
                        res.status(200).send(response);

                    } else {
                        var sql = "SELECT * FROM student_details e WHERE e.mobile =?";
                        connection.query(sql, [req.body.phone], function (err, phone, cache) {
                            if (err) {
                                var response = {
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
                                    var response = {
                                        status: '400',
                                        message: "Phone Already Used",
                                    }
                                    res.status(200).send(response);
                                }
                                else {
                                    var sql = "insert into `student_details` (student_name,dob,gender,college,department,mobile,alter_no,email,address,year_of_study,father_name,father_mobile,mother_name,mother_mobile,is_delete,created_by,modified_by) values ?";
                                    var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                                    var year_of_study = req.body.year_of_study == null || req.body.year_of_study == "" || req.body.year_of_study == undefined ? 5 : req.body.year_of_study;
                                    var VALUES = [[req.body.student_name, req.body.dob, req.body.gender, college, req.body.department, req.body.mobile, req.body.alter_no, req.body.email, req.body.address, year_of_study, req.body.father_name, req.body.father_mobile, req.body.mother_name, req.body.mother_mobile, "0", req.logged_in_id, req.logged_in_id],];
                                    connection.query(sql, [VALUES], function (err, insertstu, cache) {
                                        if (err) {
                                            var response = {
                                                status: '400',
                                                message: err
                                            }
                                            res.status(400).send(response);
                                        }
                                        else {
                                            if (cache.isCache == false) {
                                                connection.flush();
                                            }
                                            var response = {
                                                status: '200',
                                                message: 'Student Details Added Successfully',
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
    catch (e) {
        var response = {
            status: '500',
            message: e
        }
        res.status(500).send(response);
    }
}




const getAllYear = (req, res, next) => {

    var sql1 = "select * from year_of_study ";
    connection.query(sql1, function (err, result, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            var response = {
                status: '200',
                data: result,
            }
            res.status(200).send(response)
        }

    });
};

const getAllBatch = (req, res, next) => {
    var VALUES = [];
    var sql1 = "SELECT b.id as batch_id,b.batch_duration, c.course,(select COUNT(*) FROM registrartion r WHERE r.batch_id=b.id) AS batch_count,  b.batch_name,DATE_FORMAT( b.batch_startdate,'%Y-%m-%d') as batch_startdate,DATE_FORMAT( b.batch_enddate,'%Y-%m-%d') as batch_enddate,b.is_active FROM batch b  JOIN course c ON b.course_id=c.id where b.is_delete ='0'";
    if (req.body.course_id != null &&
        req.body.course_id != "" &&
        req.body.course_id != undefined) {
        VALUES.push(req.body.course_id)
        sql1 = sql1 + " and c.id=?"
    }
    if (req.body.batch_name != null &&
        req.body.batch_name != "" &&
        req.body.batch_name != undefined) {
        VALUES.push('%' + req.body.batch_name + '%')
        sql1 = sql1 + " AND b.batch_name like ?"
    }
    if (req.body.is_active != null &&
        req.body.is_active != "" &&
        req.body.is_active != undefined) {
        VALUES.push(req.body.is_active)
        sql1 = sql1 + " AND b.is_active = ?"
    }
    if (req.body.batch_startdate != null &&
        req.body.batch_startdate != "" &&
        req.body.batch_startdate != undefined) {
        VALUES.push(req.body.batch_startdate)
        sql1 = sql1 + " and b.batch_startdate>=?"
    }
    if (req.body.batch_enddate != null &&
        req.body.batch_enddate != "" &&
        req.body.batch_enddate != undefined) {
        VALUES.push(req.body.batch_enddate)
        sql1 = sql1 + " and b.batch_enddate<=?"
    }
    sql1 += ' ORDER BY b.id desc';


    connection.query(sql1, VALUES, function (err, result, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            var response = {
                status: '200',
                data: result,
            }
            res.status(200).send(response)
        }

    });
};

const getAllRegisterStatus = (req, res, next) => {

    var sql1 = "SELECT * FROM registration_status ";
    connection.query(sql1, function (err, result, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            var response = {
                status: '200',
                data: result,
            }
            res.status(200).send(response)
        }

    });
};




const getAllStudentDetails = (req, res, next) => {
    var VALUES = [];
    var sql1 = "SELECT s.id AS student_id,s.student_name,DATE_FORMAT(s.dob,'%Y-%m-%d') as dob,g.gender,c.college,s.department,s.mobile,s.alter_no,s.email,s.address,y.`year`,s.sem,s.father_name,s.father_mobile,s.mother_name,s.mother_mobile,s.is_delete   FROM student_details s left JOIN gender g ON g.id=s.gender left JOIN college_details c ON s.college=c.id LEFT JOIN year_of_study y ON s.year_of_study=y.id where s.is_delete='0'";

    if (req.body.student_name != null &&
        req.body.student_name != "" &&
        req.body.student_name != undefined) {
        VALUES.push("%" + req.body.student_name + "%")
        sql1 = sql1 + " AND s.student_name like ?"
    }
    if (req.body.mobile != null &&
        req.body.mobile != "" &&
        req.body.mobile != undefined) {
        VALUES.push(req.body.mobile)
        sql1 = sql1 + " AND s.mobile=?"
    }
    if (req.body.college != null &&
        req.body.college != "" &&
        req.body.college != undefined) {
        VALUES.push(req.body.college)
        sql1 = sql1 + " and c.id=?"
    }
    if (req.body.last_id != null &&
        req.body.last_id != "" &&
        req.body.last_id != undefined) {
        VALUES.push(req.body.last_id)
        sql1 = sql1 + " and s.id<?"
    }
    if (req.body.first_id != null &&
        req.body.first_id != "" &&
        req.body.first_id != undefined) {
        VALUES.push(req.body.first_id)
        sql1 = sql1 + " and s.id>?"
    }
    sql1 = sql1 + " GROUP BY s.id "

    if (req.body.page_records && req.body.page_records > 0 && req.body.page_records != 'undefined') {
        sql1 += ' ORDER BY s.id desc LIMIT ' + req.body.page_records + '';

    }
    else {
        sql1 += ' ORDER BY s.id desc';
    }

    connection.query(sql1, VALUES, async function (err, result, fields) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            var response = [];
            await result.forEach(async (vals) => {
                response.push({
                    "student_id": vals.student_id,
                    "student_name": vals.student_name,
                    "dob": vals.dob,
                    "gender": vals.gender,
                    "college": vals.college,
                    "department": vals.department,
                    "mobile": vals.mobile,
                    "alter_no": vals.alter_no,
                    "email": vals.email,
                    "address": vals.address,
                    "year": vals.year,
                    "sem": vals.sem,
                    "father_name": vals.father_name,
                    "mother_name": vals.mother_name,
                    "mother_mobile": vals.mother_mobile,
                    "is_delete": vals.is_delete
                })
                result.length == response.length && response.sort((a, b) => b.student_id - a.student_id) && res.send({
                    status: "200",
                    message: "Data Found",
                    data: response
                });

            })
        }

    });
};



const getStudentDetailById = (req, res, next) => {
    if (
        req.body.student_id == null ||
        req.body.student_id == "" ||
        req.body.student_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql1 = "SELECT s.id AS student_id,s.student_name, DATE_FORMAT(s.dob,'%Y-%m-%d') AS dob ,s.gender,s.college,s.department,s.mobile,s.alter_no,s.email,s.address,s.year_of_study,s.sem,s.father_name,s.father_mobile,s.mother_name,s.mother_mobile,s.is_delete   FROM student_details s left JOIN gender g ON g.id=s.gender left JOIN college_details c ON s.college=c.id LEFT JOIN year_of_study y ON s.year_of_study=y.id  where s.id=?";
        connection.query(sql1, req.body.student_id, async function (err, result, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                var response = [];
                await result.forEach(async (vals) => {
                    response.push({
                        "student_id": vals.student_id,
                        "student_name": vals.student_name,
                        "dob": vals.dob,
                        "gender": vals.gender,
                        "college": vals.college,
                        "department": vals.department,
                        "mobile": vals.mobile,
                        "alter_no": vals.alter_no,
                        "email": vals.email,
                        "address": vals.address,
                        "year": vals.year_of_study,
                        "sem": vals.sem,
                        "father_name": vals.father_name,
                        "father_mobile": vals.father_mobile,
                        "mother_name": vals.mother_name,
                        "mother_mobile": vals.mother_mobile,
                        "is_delete": vals.is_delete
                    })
                    result.length == response.length && response.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)) && res.send({
                        status: "200",
                        message: "Data Found",
                        data: response
                    });

                })
            }

        });
    }
};


const getAllBatchByCourseId = (req, res, next) => {

    if (req.body.course_id == null &&
        req.body.course_id == "" &&
        req.body.course_id == undefined) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {

        var sql1 = "SELECT b.id as batch_id,c.fees, b.batch_duration,c.course,(select COUNT(*) FROM registrartion r WHERE r.batch_id=b.id) AS btach_count,  b.batch_name,DATE_FORMAT(b.batch_startdate,'%Y-%m-%d') AS batch_startdate,DATE_FORMAT(b.batch_enddate,'%Y-%m-%d') AS batch_enddate  FROM batch b  JOIN course c ON b.course_id=c.id where b.course_id=? ";
        connection.query(sql1, [req.body.course_id], function (err, result, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                var response = {
                    status: '200',
                    data: result,
                }
                res.status(200).send(response)
            }

        });
    }
};


const insertRegistration = (req, res, next) => {



    if (req.body.registration_id != null &&
        req.body.registration_id != "" &&
        req.body.registration_id != undefined) {
        var sql = "SELECT * FROM registrartion e WHERE e.id = ?";
        connection.query(sql, [req.body.registration_id], function (err, id, cache) {
            if (err) {
                var response = {
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
                if (id.length > 0) {
                    var sql = "update `registrartion` set student_id=?,batch_id=?,student_fees=?,actual_fees=?,discount_amount=?,discount_reason=?,date_of_joining=?,note=?,modified_by=?,registration_status_id=? ,modified_at=CURRENT_TIMESTAMP ,placement_company=?,placement_date=?,placement_notes=? where id= ?";

                    connection.query(sql, [req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.actual_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.body.registration_status_id, req.body.placement_company, req.body.placement_date, req.body.placement_notes, req.body.registration_id], function (err, insertreg, cache) {
                        if (err) {
                            var response = {
                                status: '400',
                                message: err
                            }
                            res.status(400).send(response);
                        }
                        else {
                            if (cache.isCache == false) {
                                connection.flush();
                            }
                            var sql = "insert into `registration_status_history` (registration_id,registration_status_id,notes) values ?";
                            var VALUES = [[req.body.registration_id, req.body.registration_status_id, req.body.registration_status_notes],];
                            connection.query(sql, [VALUES], function (err, insertstu, cache) {
                                if (err) {
                                    var response = {
                                        status: '400',
                                        message: err
                                    }
                                    res.status(400).send(response);
                                }
                                else {
                                    if (cache.isCache == false) {
                                        connection.flush();
                                    }
                                    var response = {
                                        status: '200',
                                        message: 'Registration Updated  Succesfully',
                                    }
                                    res.status(200).send(response);

                                }
                            });
                        }
                    });

                } else {
                    var response = {
                        status: '400',
                        message: "Check Registration  Id"
                    }
                    res.status(200).send(response);
                }
            }
        });

    }
    else {
        var sql = "insert into `registrartion` (student_id,batch_id,student_fees,actual_fees,discount_amount,discount_reason,date_of_joining,note,created_by,modified_by,registration_status_id,placement_company,placement_notes,placement_date,is_delete) values ?";
        var VALUES = [[req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.actual_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.logged_in_id, req.body.registration_status_id, req.body.placement_company, req.body.placement_notes, req.body.placement_date, "0"],];
        connection.query(sql, [VALUES], function (err, insertreg, cache) {
            if (err) {
                var response = {
                    status: '400',
                    message: err
                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                var sql = "insert into `registration_status_history` (registration_id,registration_status_id,notes) values ?";
                var VALUES = [[insertreg.insertId, req.body.registration_status_id, req.body.registration_status_notes],];
                connection.query(sql, [VALUES], function (err, insertstu, cache) {
                    if (err) {
                        var response = {
                            status: '400',
                            message: err
                        }
                        res.status(400).send(response);
                    }
                    else {
                        if (cache.isCache == false) {
                            connection.flush();
                        }
                        var response = {
                            status: '200',
                            message: 'Registration Succesfully',
                        }
                        res.status(200).send(response);

                    }
                });
            }
        });
    }

}


const insertRegistration1 = (req, res, next) => {
    if (
        req.body.student_id == null ||
        req.body.student_id == "" ||
        req.body.student_id == undefined ||
        req.body.batch_id == null ||
        req.body.batch_id == "" ||
        req.body.batch_id == undefined ||
        req.body.date_of_joining == null ||
        req.body.date_of_joining == "" ||
        req.body.date_of_joining == undefined ||
        req.body.student_fees == null ||
        req.body.student_fees == "" ||
        req.body.student_fees == undefined ||
        req.body.note == null ||
        req.body.note == "" ||
        req.body.note == undefined
    ) {

        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {


        var sql = "insert into `registrartion` (student_id,batch_id,student_fees,discount_amount,discount_reason,date_of_joining,note,created_by,modified_by,registration_status_id,is_delete) values ?";
        var VALUES = [[req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.logged_in_id, 1, "0"],];
        connection.query(sql, [VALUES], function (err, insertreg, cache) {
            if (err) {
                var response = {
                    status: '400',
                    message: err
                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                var sql = "insert into `registration_status_history` (registration_id,registration_status_id) values ?";
                var VALUES = [[insertreg.insertId, 1],];
                connection.query(sql, [VALUES], function (err, insertstu, cache) {
                    if (err) {
                        var response = {
                            status: '400',
                            message: err
                        }
                        res.status(400).send(response);
                    }
                    else {
                        if (cache.isCache == false) {
                            connection.flush();
                        }
                        var response = {
                            status: '200',
                            message: 'Registrattion Succesfully',
                        }
                        res.status(200).send(response);

                    }
                });
            }
        });
    }
}


const getAllRegisterDetails = (req, res, next) => {
    var sql1 = "SELECT r.id AS register_id,st.id AS student_id,st.student_name,b.id AS batch_id, b.batch_name,c.course,r.student_fees,r.actual_fees, r.discount_amount,r.discount_reason,r.date_of_joining,r.note,rs.id AS registration_status_id,rs.registration_status,r.placement_company,r.placement_notes  FROM  registrartion r LEFT JOIN student_details st ON r.student_id=st.id LEFT JOIN batch b ON r.batch_id=b.id LEFT JOIN course c ON b.course_id=c.id  LEFT JOIN registration_status rs ON r.registration_status_id=rs.id  WHERE r.is_delete='0'";
    var VALUES = [];
    if (req.body.student_name != null &&
        req.body.student_name != "" &&
        req.body.student_name != undefined) {
        VALUES.push('%' + req.body.student_name + '%')
        sql1 = sql1 + " AND st.student_name like ?"
    }
    if (req.body.mobile != null &&
        req.body.mobile != "" &&
        req.body.mobile != undefined) {
        VALUES.push('%' + req.body.mobile + '%')
        sql1 = sql1 + " AND st.mobile like ?"
    }
    if (req.body.batch_name != null &&
        req.body.batch_name != "" &&
        req.body.batch_name != undefined) {
        VALUES.push('%' + req.body.batch_name + '%')
        sql1 = sql1 + " AND b.batch_name like ?"
    }
    if (req.body.course_id != null &&
        req.body.course_id != "" &&
        req.body.course_id != undefined) {
        VALUES.push(req.body.course_id)
        sql1 = sql1 + " and c.id=?"
    }
    if (req.body.registration_status_id != null &&
        req.body.registration_status_id != "" &&
        req.body.registration_status_id != undefined) {
        VALUES.push(req.body.registration_status_id)
        sql1 = sql1 + " and rs.id=?"
    }
    sql1 = sql1 + " GROUP BY r.id ORDER BY r.id desc"
    connection.query(sql1, VALUES, async function (err, result, cache) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            if (result.length > 0) {
                var j = [];
                var response = [];
                await result.forEach(async (vals) => {

                    response.push({
                        "register_id": vals.register_id,
                        "student_id": vals.student_id,
                        "student_name": vals.student_name,
                        "batch_id": vals.batch_id,
                        "batch_name": vals.batch_name,
                        "course": vals.course,
                        "student_fees": vals.student_fees,
                        "discount_amount": vals.discount_amount,
                        "actual_fees":vals.actual_fees,
                        "discount_reason": vals.discount_reason,
                        "date_of_joining": vals.date_of_joining.toISOString().slice(0, 10),
                        "note": vals.note,
                        "registration_status_id": vals.registration_status_id,
                        "registration_status": vals.registration_status,
                        "placement_company": vals.placement_company,
                        "placement_notes": vals.placement_notes
                    })
                    result.length == response.length && response.sort((a, b) => b.register_id - a.register_id) && res.send({
                        status: "200",
                        message: "Data Found",
                        data: response
                    });
                })
            }
            else {
                res.send({
                    status: "200",
                    message: "No Data Found"
                });

            }
        }
    });

}


const getRegisterById = (req, res, next) => {
    if (
        req.body.register_id == null ||
        req.body.register_id == "" ||
        req.body.register_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        try {
            var sql1 = "SELECT r.id AS register_id,st.id AS student_id,st.student_name,b.id AS batch_id, b.batch_name,c.id AS course_id,c.course,   r.actual_fees, r.student_fees ,r.discount_amount,r.discount_reason,r.date_of_joining,r.note,rs.id AS registration_status_id,rs.registration_status,r.placement_company,r.placement_notes,DATE_FORMAT(r.placement_date,'%Y-%m-%d') AS placement_date,rsh.notes AS status_notes,DATE_FORMAT(b.batch_startdate,'%Y-%m-%d') AS batch_startdate,DATE_FORMAT(b.batch_enddate,'%Y-%m-%d') AS batch_enddate  FROM  registrartion r LEFT JOIN student_details st ON r.student_id=st.id LEFT JOIN batch b ON r.batch_id=b.id LEFT JOIN course c ON b.course_id=c.id  LEFT JOIN registration_status rs ON r.registration_status_id=rs.id  LEFT JOIN registration_status_history rsh ON rsh.registration_id=r.id  WHERE r.is_delete='0' and r.id=? GROUP BY r.id";
            connection.query(sql1, req.body.register_id, async function (err, result, cache) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }
                    if (result.length > 0) {
                        var j = [];
                        var response = [];
                        await result.forEach(async (vals) => {

                            response.push({
                                "register_id": vals.register_id,
                                "student_id": vals.student_id,
                                "student_name": vals.student_name,
                                "batch_id": vals.batch_id,
                                "batch_name": vals.batch_name,
                                "course": vals.course_id,
                                "course_name":vals.course,
                                "student_fees": vals.student_fees,
                                "discount_amount": vals.discount_amount,
                                "actual_fees":vals.actual_fees,
                                "discount_reason": vals.discount_reason,
                                "date_of_joining": vals.date_of_joining.toISOString().slice(0, 10),
                                "note": vals.note,
                                "registration_status_id": vals.registration_status_id,
                                "registration_status": vals.registration_status,
                                "placement_company": vals.placement_company,
                                "placement_notes": vals.placement_notes,
                                "registration_status_notes": vals.status_notes,
                                "placement_date": vals.placement_date,
                                "batch_startdate": vals.batch_startdate,
                                "batch_enddate": vals.batch_enddate

                            })
                            result.length == response.length && response.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)) && res.send({
                                status: "200",
                                message: "Data Found",
                                data: response
                            });

                        })
                    }
                    else {
                        res.send({
                            status: "200",
                            message: "No Data Found"
                        });

                    }
                }
            });
        }
        catch (e) {
            var response = {
                status: '500',
                message: e
            }
            res.status(500).send(response);
        }
    }

}

const getPaymentDetailsByRegisterId = (req, res, next) => {
    if (
        req.body.registration_id == null ||
        req.body.registration_id == "" ||
        req.body.registration_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql1 = "SELECT fst.id AS payment_id,fst.registration_id AS registration_id,r.student_fees AS total_fees,r.student_fees-( SELECT sum(fst.fees) from fees_transaction_details fst WHERE fst.registration_id=? ) AS pending_fees,fst.paid_amount,fst.gst,fst.fees, pt.payment_type,fst.payment_date,fst.receipt_no     FROM  fees_transaction_details fst LEFT JOIN registrartion  r ON fst.registration_id=r.id LEFT JOIN payment_type pt ON fst.payment_type=pt.id WHERE r.id=?";
        connection.query(sql1, [req.body.registration_id, req.body.registration_id], async function (err, result, cache) {
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                if (result.length > 0) {

                    var response = [];
                    var total_fees, pending_fees;
                    await result.forEach(async (vals) => {
                        total_fees = vals.total_fees;
                        pending_fees = vals.pending_fees;
                        response.push({
                            "payment_id": vals.payment_id,
                            "registration_id": vals.registration_id,
                            "paid_amount": vals.student_name,
                            "gst": vals.batch_id,
                            "fees": vals.fees,
                            "payment_type": vals.payment_type,
                            "payment_date": vals.payment_date.toISOString().slice(0, 10),
                            "receipt_no": vals.receipt_no
                        })
                        result.length == response.length && response.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)) && res.send({
                            status: "200",
                            message: "Data Found",
                            total_fees: total_fees,
                            pending_fees: pending_fees,
                            data: response
                        });

                    })
                }
                else {
                    var sql1 = "SELECT r.student_fees AS total_fees,r.student_fees AS pending_fees FROM registrartion r WHERE r.id=?";
                    connection.query(sql1, [req.body.registration_id], async function (err, results, cache) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.status(400).send({
                                "code": 400,
                                "failed": "erreur survenue"
                            })
                        }
                        else {
                            if (cache.isCache == false) {
                                connection.flush();
                            }

                            res.send({
                                status: "200",
                                message: "Data Found",
                                total_fees: results[0].total_fees,
                                pending_fees: results[0].pending_fees
                            });

                        }

                    });



                }
            }
        });

    }
}

const getPaymentDetailsById = (req, res, next) => {
    if (
        req.body.payment_id == null ||
        req.body.payment_id == "" ||
        req.body.payment_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql1 = "SELECT fst.id AS payment_id,fst.registration_id AS registration_id,r.student_fees AS total_fees,r.student_fees-( SELECT sum(fst.fees) from fees_transaction_details fst WHERE fst.registration_id=r.id ) AS pending_fees,fst.paid_amount,fst.gst,fst.fees, pt.payment_type,fst.payment_date,fst.receipt_no     FROM  fees_transaction_details fst LEFT JOIN registrartion  r ON fst.registration_id=r.id LEFT JOIN payment_type pt ON fst.payment_type=pt.id WHERE fst.id=?;";
        connection.query(sql1, [req.body.payment_id], async function (err, result, cache) {
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                if (result.length > 0) {

                    var response = [];
                    var total_fees, pending_fees;
                    await result.forEach(async (vals) => {
                        total_fees = vals.total_fees;
                        pending_fees = vals.pending_fees;
                        response.push({
                            "payment_id": vals.payment_id,
                            "registration_id": vals.registration_id,
                            "paid_amount": vals.student_name,
                            "gst": vals.batch_id,
                            "fees": vals.fees,
                            "payment_type": vals.payment_type,
                            "payment_date": vals.payment_date.toISOString().slice(0, 10),
                            "receipt_no": vals.receipt_no
                        })
                        result.length == response.length && res.send({
                            status: "200",
                            message: "Data Found",
                            total_fees: total_fees,
                            pending_fees: pending_fees,
                            data: response
                        });

                    })
                }
                else {
                    res.send({
                        status: "200",
                        message: "No Data Found",
                    });
                }
            }
        });

    }
}



const getPaymentType = (req, res, next) => {

    var sql1 = "select * from payment_type";
    connection.query(sql1, function (err, result, cache) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }

            var response = {
                status: '200',
                data: result,
            }
            res.status(200).send(response)
        }

    });
};


const getAllPaymentDetails = (req, res, next) => {
    var VALUES = [];
    var sql1 = "SELECT fst.id AS payment_id,fst.receipt_no,   fst.paid_amount,fst.gst,fst.fees,pt.payment_type,   s.student_name,c.course,b.batch_name,DATE_FORMAT(fst.payment_date,'%Y-%m-%d') AS payment_date  FROM fees_transaction_details fst LEFT JOIN registrartion r ON fst.registration_id=r.id LEFT JOIN student_details s ON r.student_id=s.id LEFT JOIN batch b ON b.id=r.batch_id  LEFT JOIN course c ON c.id=b.course_id LEFT JOIN payment_type pt ON pt.id=fst.payment_type where fst.is_delete='0'";

    if (req.body.student_name != null &&
        req.body.student_name != "" &&
        req.body.student_name != undefined) {
        VALUES.push('%' + req.body.student_name + '%')
        sql1 = sql1 + " AND s.student_name like ?"
    }
    if (req.body.mobile != null &&
        req.body.mobile != "" &&
        req.body.mobile != undefined) {
        VALUES.push('%' + req.body.mobile + '%')
        sql1 = sql1 + " AND s.mobile like ?"
    }

    if (req.body.course_id != null &&
        req.body.course_id != "" &&
        req.body.course_id != undefined) {
        VALUES.push(req.body.course_id)
        sql1 = sql1 + " and c.id=?"
    }
    if (req.body.batch_id != null &&
        req.body.batch_id != "" &&
        req.body.batch_id != undefined) {
        VALUES.push(batch_id)
        sql1 = sql1 + " AND b.id = ?"
    }
    if (req.body.start_date != null &&
        req.body.start_date != "" &&
        req.body.start_date != undefined) {
        VALUES.push(req.body.start_date)
        sql1 = sql1 + " and fst.payment_date>=?"
    }
    if (req.body.end_date != null &&
        req.body.end_date != "" &&
        req.body.end_date != undefined) {
        VALUES.push(req.body.end_date)
        sql1 = sql1 + " and fst.payment_date<=?"
    }

    sql1 += 'ORDER BY fst.id desc';

    connection.query(sql1, VALUES, function (err, result, cache) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }

            var response = {
                status: '200',
                data: result,
            }
            res.status(200).send(response)
        }

    });
};
const getAllReportDetails = (req, res, next) => {
    var REG_COUNT_VALUES = [];
    var ENQ_COUNT_VALUES = [];
    var VALUES = [];
    var reg_count_query = "SELECT COUNT(*) FROM registrartion r WHERE r.is_delete='0'"
    var enq_count_query = "SELECT COUNT(*) FROM enquiry e WHERE e.is_delete='0'";
    var req_query = "SELECT r.id AS register_id,st.id AS student_id,st.student_name,b.id AS batch_id, b.batch_name,c.course,r.student_fees,r.discount_amount,r.discount_reason,r.date_of_joining,r.note,rs.id AS registration_status_id,rs.registration_status,r.placement_company,r.placement_notes  FROM  registrartion r LEFT JOIN student_details st ON r.student_id=st.id LEFT JOIN batch b ON r.batch_id=b.id LEFT JOIN course c ON b.course_id=c.id  LEFT JOIN registration_status rs ON r.registration_status_id=rs.id  WHERE r.is_delete='0'";
    var enq_query = "SELECT e.id AS enquiry_id,e.name,e.email, g.gender,e.mobile,e.alter_no,e.address,cl.college,ref.referral_source,e.enquiry_date,e.referred_by,e.dob,e.department,es.enquiry_status, GROUP_CONCAT(CONCAT('', CASE WHEN c.course != '' THEN  CONCAT(c.course) END)) AS course FROM enquiry e JOIN enquiry_course ec ON ec.enquiry_id=e.id JOIN  course c ON c.id=ec.course_id JOIN gender g ON g.id=e.gender JOIN college_details cl ON cl.id=e.college JOIN referral_source  ref ON ref.id=e.referral_source_id JOIN enquiry_status es ON es.id=e.enquiry_status  where e.is_delete='0'";
    if (req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined
    ) {
        REG_COUNT_VALUES.push(req.body.startdate)
        ENQ_COUNT_VALUES.push(req.body.startdate)
        reg_count_query = reg_count_query + " AND  r.date_of_joining >=? ";
        req_query = req_query + " AND  r.date_of_joining >=? ";
        enq_count_query = enq_count_query + " AND  e.enquiry_date >=? "
        enq_query = enq_query + " AND  e.enquiry_date >=? "
    }
    if (req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined
    ) {
        REG_COUNT_VALUES.push(req.body.enddate)
        ENQ_COUNT_VALUES.push(req.body.enddate)
        reg_count_query = reg_count_query + " AND r.date_of_joining<=?";
        req_query = req_query + " AND r.date_of_joining<=?";
        enq_count_query = enq_count_query + "  AND e.enquiry_date <=?"
        enq_query = enq_query + "  AND e.enquiry_date <=?"
    }

    var VALUES = REG_COUNT_VALUES.concat(ENQ_COUNT_VALUES);
    console.log(VALUES, "---------->");
    req_query = req_query + " GROUP BY r.id ORDER BY r.date_of_joining asc";
    enq_query = enq_query + " GROUP BY e.id ORDER BY e.enquiry_date asc";

    var sql = "select ( " + reg_count_query + ") as registration_count," + "(" + enq_count_query + ") as enquiry_count";
    connection.query(sql, VALUES, function (err, count_result, cache) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            connection.query(req_query, REG_COUNT_VALUES, async function (err, regresult, cache) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }
                    var register_data = [];
                    if (regresult.length > 0) {
                        var j = [];
                        await regresult.forEach(async (vals) => {
                            register_data.push({
                                "register_id": vals.register_id,
                                "student_id": vals.student_id,
                                "student_name": vals.student_name,
                                "batch_id": vals.batch_id,
                                "batch_name": vals.batch_name,
                                "course": vals.course,
                                "student_fees": vals.student_fees,
                                "discount_amount": vals.discount_amount,
                                "discount_reason": vals.discount_reason,
                                "date_of_joining": vals.date_of_joining.toISOString().slice(0, 10),
                                "note": vals.note,
                                "registration_status_id": vals.registration_status_id,
                                "registration_status": vals.registration_status,
                                "placement_company": vals.placement_company,
                                "placement_notes": vals.placement_notes
                            })
                        })
                    }
                    else {
                        register_data = [];

                    }
                    regresult.length == register_data.length && connection.query(enq_query, ENQ_COUNT_VALUES, async function (err, enqresult, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.status(400).send({
                                "code": 400,
                                "failed": "erreur survenue"
                            })
                        }
                        else {
                            var enquiry_data = [];
                            if (enqresult.length > 0) {
                                var j = [];

                                await enqresult.forEach(async (vals) => {
                                    j = vals.course.split(",");
                                    enquiry_data.push({
                                        "enquiry_id": vals.enquiry_id,
                                        "name": vals.name,
                                        "email": vals.email,
                                        "gender": vals.gender,
                                        "mobile": vals.mobile,
                                        "alter_no": vals.alter_no,
                                        "address": vals.address,
                                        "college": vals.college,
                                        "referral_source": vals.referral_source,
                                        "enquiry_date": vals.enquiry_date.toISOString().slice(0, 10),
                                        "referred_by": vals.referred_by,
                                        "dob": vals.dob.toISOString().slice(0, 10),
                                        "department": vals.department,
                                        "enquiry_status": vals.enquiry_status,
                                        "course": j
                                    })
                                })
                            }
                            else {
                                var enquiry_data = [];

                            }
                            enqresult.length == enquiry_data.length && res.send({
                                status: "200",
                                message: "Data Found",
                                records_count: count_result,
                                register_data: register_data,
                                enquiry_data: enquiry_data

                            });

                        }
                    });

                }
            });

        }
    });
};


const getAllPaymentReportDetails = (req, res, next) => {
    var pay_count_query = "SELECT count(*) AS payment_count FROM fees_transaction_details  fst WHERE fst.is_delete='0'"
    var pay_get_query = "SELECT fst.id AS payment_id,fst.receipt_no,   fst.paid_amount,fst.gst,fst.fees,pt.payment_type,   s.student_name,c.course,b.batch_name,DATE_FORMAT(fst.payment_date,'%Y-%m-%d') AS payment_date  FROM fees_transaction_details fst LEFT JOIN registrartion r ON fst.registration_id=r.id LEFT JOIN student_details s ON r.student_id=s.id LEFT JOIN batch b ON b.id=r.batch_id  LEFT JOIN course c ON c.id=b.course_id LEFT JOIN payment_type pt ON pt.id=fst.payment_type where fst.is_delete='0'";
    var VALUES = [];
    if (req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined) {
        VALUES.push(req.body.startdate)
        pay_count_query = pay_count_query + " and fst.payment_date>=?";
        pay_get_query = pay_get_query + " and fst.payment_date>=?";
    }
    if (req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        VALUES.push(req.body.enddate)
        pay_count_query = pay_count_query + " and fst.payment_date<=?";
        pay_get_query = pay_get_query + " and fst.payment_date<=?";
    }

    pay_count_query = pay_count_query + " ORDER BY fst.payment_date asc";
    pay_get_query = pay_get_query + " ORDER BY fst.payment_date asc";
    connection.query(pay_count_query, VALUES, function (err, count_result, cache) {
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            connection.query(pay_get_query, VALUES, function (err, result, cache) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }

                    var response = {
                        status: '200',
                        records_count: count_result,
                        payment_data: result
                    }
                    res.status(200).send(response)
                }

            });
        }
    });
}

// function dateRange(startDate, endDate) {
//     var start = startDate.split('-');
//     var end = endDate.split('-');
//     var startYear = parseInt(start[0]);
//     var endYear = parseInt(end[0]);
//     var dates = [];

//     for (var i = startYear; i <= endYear; i++) {
//         var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
//         var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
//         for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
//             var month = j + 1;
//             var displayMonth = month < 10 ? '0' + month : month;
//             dates.push([i, displayMonth, '01'].join('-'));
//         }
//     }
//     return dates;
// }
async function dateRangeCount(startDate, endDate) {
    return new Promise(async function (resolve, reject) {
        var count = 0;
        var start = startDate.split('-');
        var end = endDate.split('-');
        var startYear = parseInt(start[0]);
        var endYear = parseInt(end[0]);
        var dates = [];

        for (var i = startYear; i <= endYear; i++) {
            var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
            var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
            for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {

                if (count == 0) {
                    var month = j + 1;
                    var displayMonth = month < 10 ? '0' + month : month;
                    dates.push("SELECT '" + [i, displayMonth, '01'].join('-') + "' AS merge_date ");
                }
                else {
                    var month = j + 1;
                    var displayMonth = month < 10 ? '0' + month : month;
                    dates.push("UNION SELECT '" + [i, displayMonth, '01'].join('-') + "' AS merge_date ");
                }
                count++;
            }
        }
        resolve(dates.join(" "));
    })
}


// async function ProjectReportdateRangeCount(startDate, endDate) {
//     return new Promise(async function (resolve, reject) {
//         var count = 0;
//         var start = startDate.split('-');
//         var end = endDate.split('-');
//         var startYear = parseInt(start[0]);
//         var endYear = parseInt(end[0]);
//         var dates = [];
//         console.log(startDate,endDate);
//         for (var i = startYear; i <= endYear; i++) {
//             var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
//             var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
//             for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
//                 var month = j + 1;
//                 var displayMonth = month < 10 ? '0' + month : month;
//                 const date = new Date([i, displayMonth, '01'].join('-'));  // 2009-11-10
//                 const month1 = date.toLocaleString('default', { month: 'long' });
//                 dates.push(" (SELECT  COALESCE(ROUND(sum(r.student_fees/b.batch_duration),2),0)  FROM registrartion r  LEFT JOIN batch b ON b.id=r.batch_id  WHERE (  '" + [i, displayMonth, '01'].join('-') + "'  BETWEEN b.batch_startdate  AND b.batch_enddate ) OR ('" + [i, displayMonth, '01'].join('-') + "'  BETWEEN b.batch_startdate  AND b.batch_enddate )  AND r.is_delete='0')  AS " + month1);
//             }
//         }
//         console.log(dates);
//         resolve(dates.join(","));
//     })
// }

async function ProjectReportdateRangeCount(startDate, endDate) {
    return new Promise(async function (resolve, reject) {
        var count = 0;
        var start = startDate.split('-');
        var end = endDate.split('-');
        var startYear = parseInt(start[0]);
        var endYear = parseInt(end[0]);
        var dates = [];
        console.log(startDate, endDate);
        for (var i = startYear; i <= endYear; i++) {
            var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
            var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
            for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
                var month = j + 1;
                var displayMonth = month < 10 ? '0' + month : month;
                const date = new Date([i, displayMonth, '01'].join('-'));  // 2009-11-10
                const month1 = date.toLocaleString('default', { month: 'long' });
                dates.push(" SELECT  DATE_FORMAT('" + [i, displayMonth, '01'].join('-') + "','%Y %M')AS month,COALESCE(ROUND(sum(r.actual_fees/b.batch_duration),2),0) as amount  FROM registrartion r  LEFT JOIN batch b ON b.id=r.batch_id  WHERE (  '" + [i, displayMonth, '01'].join('-') + "'  BETWEEN b.batch_startdate  AND b.batch_enddate ) OR ('" + [i, displayMonth, '01'].join('-') + "'  BETWEEN b.batch_startdate  AND b.batch_enddate )  AND r.is_delete='0' ");
            }
        }

        resolve(dates);
    })
}
const getBarReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var endate = new Date().toISOString().slice(0, 7) + "-01";
        var startdate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0, 7) + "-01";
    }
    var datarange;
    await dateRangeCount(startdate, endate).then((vals) => {
        datarange = vals;
        var sql = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(e.id) AS enq_count FROM ( " + datarange + " ) as Months LEFT JOIN enquiry e on MONTH(Months.merge_date) = MONTH(e.enquiry_date) AND YEAR(Months.merge_date)=YEAR(e.enquiry_date) AND e.is_delete='0' GROUP BY Months.merge_date ";
        connection.query(sql, function (err, enq, cache) {
            if (err) {
                var response = {
                    status: '400',
                    message: err

                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS reg_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' GROUP BY Months.merge_date ";
                connection.query(sql1, function (err, reg, cache) {
                    if (err) {
                        var response = {
                            status: '400',
                            message: err

                        }
                        res.status(400).send(response);
                    }
                    else {
                        if (cache.isCache == false) {
                            connection.flush();
                        }
                        let arr3 = enq.map((item, i) => Object.assign({}, item, reg[i]));
                        var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS placement_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' and r.placement_status='1' GROUP BY Months.merge_date ";
                        connection.query(sql1, function (err, placment, cache) {
                            if (err) {
                                var response = {
                                    status: '400',
                                    message: err

                                }
                                res.status(400).send(response);
                            }
                            else {
                                if (cache.isCache == false) {
                                    connection.flush();
                                }
                                let arr4 = arr3.map((item, i) => Object.assign({}, item, placment[i]));
                                var response = {
                                    status: '200',
                                    data: arr4
                                }
                                res.status(200).send(response);
                            }
                        });
                    }
                });
            }
        });
    })
}
const getBarPaymentReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var endate = new Date().toISOString().slice(0, 7) + "-01";
        var startdate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0, 7) + "-01";
    }
    var datarange;
    await dateRangeCount(startdate, endate).then((vals) => {
        datarange = vals;
        var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS pay_count,SUM(r.fees) AS paid_amount FROM ( " + datarange + " ) as Months LEFT JOIN fees_transaction_details r on MONTH(Months.merge_date) = MONTH(r.payment_date) AND YEAR(Months.merge_date)=YEAR(r.payment_date) AND r.is_delete='0'  GROUP BY Months.merge_date";
        connection.query(sql1, function (err, placment, cache) {
            if (err) {
                var response = {
                    status: '400',
                    message: err

                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                var response = {
                    status: '200',
                    data: placment
                }
                res.status(200).send(response);
            }
        });
    });

}
const getCollegeWiseReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var endate = new Date().toISOString().slice(0, 10);
        var startdate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0, 10);
    }
    var sql = "SELECT  cl.id AS college_id,  cl.college  , (SELECT COUNT( e.id) FROM enquiry e WHERE e.college=cl.id AND e.enquiry_date BETWEEN '" + startdate + "' AND '" + endate + "'  ) AS enquiry_count,( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN student_details st ON r.student_id=st.id  WHERE  st.college=cl.id  AND  r.date_of_joining BETWEEN '" + startdate + "' AND '" + endate + "' ) AS register_count,( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN student_details st ON r.student_id=st.id  LEFT JOIN batch b ON r.batch_id=b.id  WHERE  st.college=cl.id  AND   b.batch_enddate<CURDATE() AND    r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "' )  AS completed_count,( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN student_details st ON r.student_id=st.id  LEFT JOIN batch b ON r.batch_id=b.id  WHERE  st.college=cl.id  AND   b.batch_enddate>=CURDATE() AND b.batch_startdate<=CURDATE() AND    r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "' )  AS ongoing_count ,( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN student_details st ON r.student_id=st.id  LEFT JOIN batch b ON r.batch_id=b.id  WHERE  st.college=cl.id  AND r.placement_status='1'  and  r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "'  )  AS placement_count FROM  college_details cl ";
    connection.query(sql, function (err, placment, cache) {
        if (err) {
            var response = {
                status: '400',
                message: err

            }
            res.status(400).send(response);
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            var response = {
                status: '200',
                data: placment
            }
            res.status(200).send(response);
        }
    });

}


const getCourseWiseReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var endate = new Date().toISOString().slice(0, 10);
        var startdate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0, 10);
    }
    var sql = "SELECT c.id AS course_id , c.course,(SELECT COUNT(*) FROM enquiry e LEFT JOIN  enquiry_course ec ON ec.enquiry_id=e.id WHERE ec.course_id=c.id AND  e.enquiry_date BETWEEN '" + startdate + "' AND '" + endate + "'  )AS enquiry_count , ( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN batch b ON r.batch_id = b.id  WHERE   b.course_id =c.id  AND  r.date_of_joining BETWEEN '" + startdate + "' AND '" + endate + "' ) AS register_count, ( select   COUNT(r.id)  FROM registrartion r    LEFT JOIN batch b ON r.batch_id=b.id  WHERE b.course_id =c.id  AND   b.batch_enddate<CURDATE() AND    r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "' )  AS completed_count, ( select   COUNT(r.id)  FROM registrartion r    LEFT JOIN batch b ON r.batch_id=b.id  WHERE   b.course_id =c.id  AND   b.batch_enddate>=CURDATE() AND b.batch_startdate<=CURDATE() AND r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "' )  AS ongoing_count,( select   COUNT(r.id)  FROM registrartion r  LEFT JOIN batch b ON r.batch_id=b.id  WHERE b.course_id =c.id AND r.placement_status='1'  and  r.date_of_joining    BETWEEN '" + startdate + "' AND '" + endate + "' )  AS placement_count FROM  course c ";
    connection.query(sql, function (err, placment, cache) {
        if (err) {
            var response = {
                status: '400',
                message: err

            }
            res.status(400).send(response);
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            var response = {
                status: '200',
                data: placment
            }
            res.status(200).send(response);
        }
    });

}


const getProjectedReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var startdate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10);;
        var endate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().slice(0, 10);
    }

    await ProjectReportdateRangeCount(startdate, endate).then(async (vals) => {
        console.log(vals,"-->")
        var data = [];
        await vals.forEach(async (sql) => {
            await connection.query(sql, async function (err, placment, cache) {
                if (err) {
                    var response = {
                        status: '400',
                        message: err

                    }
                    res.status(400).send(response);
                }
                else {
                    if (cache.isCache == false) {
                        connection.flush();
                    }
                    data.push(placment[0]);
                    vals.length == data.length &&  data.sort((a, b) => new Date(a.month) - new Date(b.month)) &&  res.send({
                        status: "200",
                        message: "Data Found",
                        data: data
                    });
                }
            });
        });
    });
};


const getDueAmountReport = async (req, res, next) => {

    var VALUES = [];

    var sql = "SELECT r.id AS register_id, st.id AS student_id,st.mobile,st.student_name,b.id AS batch_id ,b.batch_name, c.course,  r.actual_fees AS actual_fees, r.actual_fees-(SELECT SUM(fees) FROM fees_transaction_details fst1 WHERE fst1.registration_id=r.id )  AS pending_amount  FROM registrartion r LEFT JOIN fees_transaction_details fst ON fst.registration_id=r.id LEFT JOIN batch b ON b.id=r.batch_id  LEFT JOIN   student_details st ON st.id =r.student_id  LEFT JOIN course c ON c.id=b.course_id  WHERE   b.batch_enddate<CURDATE() AND r.actual_fees -(SELECT SUM(fees) FROM fees_transaction_details fst1 WHERE fst1.registration_id=r.id ) >0 ";

    if (req.body.course_id != null &&
        req.body.course_id != "" &&
        req.body.course_id != undefined) {
        VALUES.push(req.body.course_id)
        sql = sql + " and c.id=?"
    }
    if (req.body.student_name != null &&
        req.body.student_name != "" &&
        req.body.student_name != undefined) {
        VALUES.push("%" + req.body.student_name + "%")
        sql = sql + " AND st.student_name like ?"
    }
    if (req.body.mobile != null &&
        req.body.mobile != "" &&
        req.body.mobile != undefined) {
        VALUES.push("%" + req.body.mobile + "%")
        sql = sql + " AND st.mobile like ?"
    }
    sql = sql + " GROUP BY r.id "
    connection.query(sql, VALUES, function (err, placment, cache) {
        if (err) {
            var response = {
                status: '400',
                message: err

            }
            res.status(400).send(response);
        }
        else {
            if (cache.isCache == false) {
                connection.flush();
            }
            var response = {
                status: '200',
                data: placment
            }
            res.status(200).send(response);
        }
    });
}


const getPlacementReport = async (req, res, next) => {
    var startdate, endate;
    if (
        req.body.startdate != null &&
        req.body.startdate != "" &&
        req.body.startdate != undefined &&
        req.body.enddate != null &&
        req.body.enddate != "" &&
        req.body.enddate != undefined) {
        startdate = req.body.startdate;
        endate = req.body.enddate;
    }
    else {
        var endate = new Date().toISOString().slice(0, 7) + "-01";
        var startdate = new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().slice(0, 7) + "-01";
    }
    var datarange;
    await dateRangeCount(startdate, endate).then((vals) => {
        datarange = vals;
        var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS placement_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' and r.placement_status='1' GROUP BY Months.merge_date ";
        connection.query(sql1, function (err, placment, cache) {
            if (err) {
                var response = {
                    status: '400',
                    message: err

                }
                res.status(400).send(response);
            }
            else {
                if (cache.isCache == false) {
                    connection.flush();
                }
                var response = {
                    status: '200',
                    data: placment
                }
                res.status(200).send(response);
            }
        });
    });
}
module.exports = {
    insertRegistration, saveOrUpdateStudentDetails, getStudentDetailById, getAllBatch, getAllRegisterDetails,
    getAllBatchByCourseId, getAllStudentDetails, getAllYear, getAllRegisterStatus, getRegisterById,
    saveOrUpdatePaymentDetails, getPaymentDetailsByRegisterId, getPaymentType, getAllPaymentDetails,
    getAllReportDetails, getAllPaymentReportDetails, getBarReport, getBarPaymentReport, getCollegeWiseReport,
    getCourseWiseReport, getProjectedReport, getDueAmountReport, getPlacementReport, getPaymentDetailsById
};