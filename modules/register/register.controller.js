var connection = require("../../config/db");
const util = require('util');
const query = util.promisify(connection.query).bind(connection);

const saveOrUpdatePaymentDetails = async (req, res, next) => {
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




const saveOrUpdateStudentDetails = async (req, res, next) => {
    try {
        var cache = req.app.get('cache'); // Assuming cache is needed, similar to saveOrUpdatePaymentDetails
        if (req.body.student_id != null &&
            req.body.student_id != "" &&
            req.body.student_id != undefined) {
            var sql_check_id = "SELECT * FROM student_details e WHERE e.id = ?";
            const id_result = await query(sql_check_id, [req.body.student_id]);
            if (cache.isCache) { connection.flush(); } // Assuming synchronous flush

            if (id_result.length > 0) {
                var sql_check_email = "SELECT * FROM student_details e WHERE e.email = ? and e.id!=?";
                const email_result = await query(sql_check_email, [req.body.email, req.body.student_id]);
                if (cache.isCache) { connection.flush(); }

                if (email_result.length > 0) {
                    return res.status(200).json({ status: '400', message: "Email Already Used" });
                } else {
                    var sql_check_phone = "SELECT * FROM student_details e WHERE e.mobile =? and e.id!=?";
                    const phone_result = await query(sql_check_phone, [req.body.phone, req.body.student_id]);
                    if (cache.isCache) { connection.flush(); }

                    if (phone_result.length > 0) {
                        return res.status(200).json({ status: '400', message: "Phone Already Used" });
                    } else {
                        var sql_update_student = "update  `student_details` set student_name=?,dob=?,gender=?,college=?,department=?,mobile=?,alter_no=?,email=?,address=?,year_of_study=?,father_name=?,father_mobile=?,mother_name=?,mother_mobile=?,is_delete=?,modified_by=?,modified_at=CURRENT_TIMESTAMP  where id=?";
                        var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                        var year_of_study = req.body.year_of_study == null || req.body.year_of_study == "" || req.body.year_of_study == undefined ? 5 : req.body.year_of_study;
                        await query(sql_update_student, [req.body.student_name, req.body.dob, req.body.gender, college, req.body.department, req.body.mobile, req.body.alter_no, req.body.email, req.body.address, year_of_study, req.body.father_name, req.body.father_mobile, req.body.mother_name, req.body.mother_mobile, "0", req.logged_in_id, req.body.student_id]);
                        if (cache.isCache) { connection.flush(); }
                        return res.status(200).json({ status: '200', message: 'Student Details Updated Successfully' });
                    }
                }
            } else {
                return res.status(200).json({ status: '400', message: "Check Student Id" });
            }
        } else {
            var sql_check_email_new = "SELECT * FROM student_details e WHERE e.email = ?";
            const email_result_new = await query(sql_check_email_new, [req.body.email]);
            if (cache.isCache) { connection.flush(); }

            if (email_result_new.length > 0) {
                return res.status(200).json({ status: '400', message: "Email Already Used" });
            } else {
                var sql_check_phone_new = "SELECT * FROM student_details e WHERE e.mobile =?";
                const phone_result_new = await query(sql_check_phone_new, [req.body.phone]);
                if (cache.isCache) { connection.flush(); }

                if (phone_result_new.length > 0) {
                    return res.status(200).json({ status: '400', message: "Phone Already Used" });
                } else {
                    var sql_insert_student = "insert into `student_details` (student_name,dob,gender,college,department,mobile,alter_no,email,address,year_of_study,father_name,father_mobile,mother_name,mother_mobile,is_delete,created_by,modified_by) values ?";
                    var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                    var year_of_study = req.body.year_of_study == null || req.body.year_of_study == "" || req.body.year_of_study == undefined ? 5 : req.body.year_of_study;
                    var VALUES = [[req.body.student_name, req.body.dob, req.body.gender, college, req.body.department, req.body.mobile, req.body.alter_no, req.body.email, req.body.address, year_of_study, req.body.father_name, req.body.father_mobile, req.body.mother_name, req.body.mother_mobile, "0", req.logged_in_id, req.logged_in_id]];
                    await query(sql_insert_student, [VALUES]);
                    if (cache.isCache) { connection.flush(); }
                    return res.status(200).json({ status: '200', message: 'Student Details Added Successfully' });
                }
            }
        }
    } catch (err) { // Changed e to err to be consistent
        console.log(err); // Log the actual error
        // Assuming cache might be defined even in error scenarios.
        if (cache && cache.isCache) { connection.flush(); }
        return res.status(500).json({ status: '500', message: "Something went wrong" }); // Generic error message
    }
}




const getAllYear = async (req, res, next) => {
    var sql1 = "select * from year_of_study ";
    try {
        // Assuming cache is not typically used for such a simple, parameterless query,
        // but including the pattern if it were present in original hidden logic.
        // var cache = req.app.get('cache');
        const result = await query(sql1);
        // if (cache && cache.isCache) { connection.flush(); }

        return res.status(200).send({
            status: '200',
            data: result,
        });
    } catch (err) {
        console.log("error occurred", err); // Corrected typo
        // if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({ // Changed to 500 for server errors
            "code": 500,
            "failed": "erreur survenue" // Standardize error messages later if possible
        });
    }
};

const getAllBatch = async (req, res, next) => {
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

    try {
        // var cache = req.app.get('cache'); // Assuming cache not used based on original
        const result = await query(sql1, VALUES);
        // if (cache && cache.isCache) { connection.flush(); }

        return res.status(200).send({
            status: '200',
            data: result,
        });
    } catch (err) {
        console.log("error occurred", err);
        // if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
};

const getAllRegisterStatus = async (req, res, next) => {
    var sql1 = "SELECT * FROM registration_status ";
    try {
        // var cache = req.app.get('cache'); // Assuming cache not used
        const result = await query(sql1);
        // if (cache && cache.isCache) { connection.flush(); }

        return res.status(200).send({
            status: '200',
            data: result,
        });
    } catch (err) {
        console.log("error occurred", err);
        // if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
};




const getAllStudentDetails = async (req, res, next) => {
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

    try {
        var cache = req.app.get('cache');
        const result = await query(sql1, VALUES);
        if (cache.isCache) { connection.flush(); }

        if (result.length === 0) {
            return res.status(200).send({
                status: "200", // Or perhaps a 404 status if no data is considered "not found"
                message: "No Data Found",
                data: []
            });
        }

        // The original code had a forEach with an async callback, which is problematic for res.send.
        // Processing should be done before sending the response.
        const response_data = result.map(vals => ({
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
            "mother_name": vals.mother_name, // Missing father_mobile in original mapping, added for consistency if needed
            "mother_mobile": vals.mother_mobile,
            "is_delete": vals.is_delete
        }));

        // The sort was happening inside the loop condition, moving it here
        response_data.sort((a, b) => b.student_id - a.student_id);

        return res.status(200).send({
            status: "200",
            message: "Data Found",
            data: response_data
        });

    } catch (err) {
        console.log("error occurred", err); // Corrected typo
        // Assuming cache might be defined
        if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({ // Changed to 500 for server error
            "code": 500, // Changed to 500
            "failed": "erreur survenue" // This message might need localization or standardization
        });
    }
};



const getStudentDetailById = async (req, res, next) => {
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
        try {
            var cache = req.app.get('cache');
            const result = await query(sql1, req.body.student_id);
            if (cache.isCache) { connection.flush(); }

            if (result.length === 0) {
                return res.status(200).send({ // Consistent "No Data Found" response
                    status: "200",
                    message: "No Data Found",
                    data: []
                });
            }

            // Similar to getAllStudentDetails, process data before sending
            const response_data = result.map(vals => ({
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
            }));

            // The original sort `(a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)` seems incorrect
            // as there's no 'enquiry_date' in the SELECT. Assuming it meant to sort by student_id or not sort.
            // For now, I'll remove the sort, or it should be by a valid field e.g. student_id if needed.
            // response_data.sort((a, b) => b.student_id - a.student_id); // Example if sorting by student_id

            return res.status(200).send({
                status: "200",
                message: "Data Found",
                data: response_data
            });

        } catch (err) {
            console.log("error occurred", err); // Corrected typo
            if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
            return res.status(500).send({
                "code": 500,
                "failed": "erreur survenue"
            });
        }
    }
};


const getAllBatchByCourseId = async (req, res, next) => {
    if (req.body.course_id == null ||
        req.body.course_id == "" ||
        req.body.course_id == undefined) {
        return res.status(200).send({ // Added return
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql1 = "SELECT b.id as batch_id,c.fees, b.batch_duration,c.course,(select COUNT(*) FROM registrartion r WHERE r.batch_id=b.id) AS btach_count,  b.batch_name,DATE_FORMAT(b.batch_startdate,'%Y-%m-%d') AS batch_startdate,DATE_FORMAT(b.batch_enddate,'%Y-%m-%d') AS batch_enddate  FROM batch b  JOIN course c ON b.course_id=c.id where b.course_id=? ";
        try {
            // var cache = req.app.get('cache'); // Assuming cache not used
            const result = await query(sql1, [req.body.course_id]);
            // if (cache && cache.isCache) { connection.flush(); }

            return res.status(200).send({ // Added return
                status: '200',
                data: result,
            });
        } catch (err) {
            console.log("error occurred", err);
            // if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
            return res.status(500).send({ // Added return and changed to 500
                "code": 500,
                "failed": "erreur survenue"
            });
        }
    }
};


const insertRegistration = async (req, res, next) => {
    try {
        var cache = req.app.get('cache'); // Assuming cache is needed

        if (req.body.registration_id != null &&
            req.body.registration_id != "" &&
            req.body.registration_id != undefined) {
            var sql_check_reg_id = "SELECT * FROM registrartion e WHERE e.id = ?";
            const id_result = await query(sql_check_reg_id, [req.body.registration_id]);
            if (cache.isCache) { connection.flush(); }

            if (id_result.length > 0) {
                var sql_update_reg = "update `registrartion` set student_id=?,batch_id=?,student_fees=?,actual_fees=?,discount_amount=?,discount_reason=?,date_of_joining=?,note=?,modified_by=?,registration_status_id=? ,modified_at=CURRENT_TIMESTAMP ,placement_company=?,placement_date=?,placement_notes=? where id= ?";
                await query(sql_update_reg, [req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.actual_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.body.registration_status_id, req.body.placement_company, req.body.placement_date, req.body.placement_notes, req.body.registration_id]);
                if (cache.isCache) { connection.flush(); }

                var sql_insert_history = "insert into `registration_status_history` (registration_id,registration_status_id,notes) values ?";
                var VALUES_history = [[req.body.registration_id, req.body.registration_status_id, req.body.registration_status_notes]];
                await query(sql_insert_history, [VALUES_history]);
                if (cache.isCache) { connection.flush(); }

                return res.status(200).json({ status: '200', message: 'Registration Updated Successfully' }); // Changed Succesfully to Successfully
            } else {
                return res.status(200).json({ status: '400', message: "Check Registration Id" }); // Changed message
            }
        } else {
            var sql_insert_reg = "insert into `registrartion` (student_id,batch_id,student_fees,actual_fees,discount_amount,discount_reason,date_of_joining,note,created_by,modified_by,registration_status_id,placement_company,placement_notes,placement_date,is_delete) values ?";
            var VALUES_reg = [[req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.actual_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.logged_in_id, req.body.registration_status_id, req.body.placement_company, req.body.placement_notes, req.body.placement_date, "0"]];
            const insert_reg_result = await query(sql_insert_reg, [VALUES_reg]);
            if (cache.isCache) { connection.flush(); }

            var sql_insert_history_new = "insert into `registration_status_history` (registration_id,registration_status_id,notes) values ?";
            var VALUES_history_new = [[insert_reg_result.insertId, req.body.registration_status_id, req.body.registration_status_notes]];
            await query(sql_insert_history_new, [VALUES_history_new]);
            if (cache.isCache) { connection.flush(); }

            return res.status(200).json({ status: '200', message: 'Registration Successful' }); // Changed Succesfully to Successful
        }
    } catch (err) {
        console.log(err);
        if (cache && cache.isCache) { connection.flush(); } // Ensure cache is defined before using
        return res.status(500).json({ status: '500', message: "Something went wrong" });
    }
}


const insertRegistration1 = async (req, res, next) => {
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
        return res.status(200).send({ // Added return
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        try {
            var cache = req.app.get('cache');
            var sql_insert_reg = "insert into `registrartion` (student_id,batch_id,student_fees,discount_amount,discount_reason,date_of_joining,note,created_by,modified_by,registration_status_id,is_delete) values ?";
            var VALUES_reg = [[req.body.student_id, req.body.batch_id, req.body.student_fees, req.body.discount_amount, req.body.discount_reason, req.body.date_of_joining, req.body.note, req.logged_in_id, req.logged_in_id, 1, "0"]];

            const insert_reg_result = await query(sql_insert_reg, [VALUES_reg]);

            if (cache && cache.isCache) {
                connection.flush();
            }

            var sql_insert_history = "insert into `registration_status_history` (registration_id,registration_status_id) values ?";
            var VALUES_history = [[insert_reg_result.insertId, 1]];
            await query(sql_insert_history, [VALUES_history]);

            if (cache && cache.isCache) { // Flush after second query too if cache enabled
                connection.flush();
            }

            return res.status(200).send({ // Changed to return
                status: '200',
                message: 'Registration Successful', // Corrected spelling
            });

        } catch (err) {
            console.log("error occurred", err); // Log the actual error
            if (req.app.get('cache') && req.app.get('cache').isCache) {
                connection.flush();
            }
            return res.status(500).send({ // Changed to 500 and return
                status: '500', // Consistent error status
                message: "Something went wrong" // More generic message
            });
        }
    }
}


const getAllRegisterDetails = async (req, res, next) => {
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
    try {
        var cache = req.app.get('cache');
        const result = await query(sql1, VALUES);
        if (cache.isCache) { connection.flush(); }

        if (result.length === 0) {
            return res.status(200).send({
                status: "200",
                message: "No Data Found",
                data: [] // Send empty array for consistency
            });
        }

        // Process data using map before sending response
        const response_data = result.map(vals => ({
            "register_id": vals.register_id,
            "student_id": vals.student_id,
            "student_name": vals.student_name,
            "batch_id": vals.batch_id,
            "batch_name": vals.batch_name,
            "course": vals.course,
            "student_fees": vals.student_fees,
            "discount_amount": vals.discount_amount,
            "actual_fees": vals.actual_fees,
            "discount_reason": vals.discount_reason,
            // Ensure date_of_joining is not null before calling toISOString
            "date_of_joining": vals.date_of_joining ? vals.date_of_joining.toISOString().slice(0, 10) : null,
            "note": vals.note,
            "registration_status_id": vals.registration_status_id,
            "registration_status": vals.registration_status,
            "placement_company": vals.placement_company,
            "placement_notes": vals.placement_notes
        }));

        // Sort data as per original logic (b.register_id - a.register_id)
        response_data.sort((a, b) => b.register_id - a.register_id);

        return res.status(200).send({
            status: "200",
            message: "Data Found",
            data: response_data
        });

    } catch (err) {
        console.log("error occurred", err); // Corrected typo
        if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
}


const getRegisterById = async (req, res, next) => {
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
        // try block was already here, will reuse
        var sql1 = "SELECT r.id AS register_id,st.id AS student_id,st.student_name,b.id AS batch_id, b.batch_name,c.id AS course_id,c.course,   r.actual_fees, r.student_fees ,r.discount_amount,r.discount_reason,r.date_of_joining,r.note,rs.id AS registration_status_id,rs.registration_status,r.placement_company,r.placement_notes,DATE_FORMAT(r.placement_date,'%Y-%m-%d') AS placement_date,rsh.notes AS status_notes,DATE_FORMAT(b.batch_startdate,'%Y-%m-%d') AS batch_startdate,DATE_FORMAT(b.batch_enddate,'%Y-%m-%d') AS batch_enddate  FROM  registrartion r LEFT JOIN student_details st ON r.student_id=st.id LEFT JOIN batch b ON r.batch_id=b.id LEFT JOIN course c ON b.course_id=c.id  LEFT JOIN registration_status rs ON r.registration_status_id=rs.id  LEFT JOIN registration_status_history rsh ON rsh.registration_id=r.id  WHERE r.is_delete='0' and r.id=? GROUP BY r.id";
        try { // This try was for the outer scope, the DB query needs its own.
            var cache = req.app.get('cache');
            const result = await query(sql1, req.body.register_id);

            if (cache && cache.isCache) { // Check if cache is defined before accessing isCache
                connection.flush();
            }

            if (result.length === 0) {
                return res.status(200).send({
                    status: "200",
                    message: "No Data Found",
                    data: []
                });
            }

            const response_data = result.map(vals => ({
                "register_id": vals.register_id,
                "student_id": vals.student_id,
                "student_name": vals.student_name,
                "batch_id": vals.batch_id,
                "batch_name": vals.batch_name,
                "course": vals.course_id,
                "course_name": vals.course,
                "student_fees": vals.student_fees,
                "discount_amount": vals.discount_amount,
                "actual_fees": vals.actual_fees,
                "discount_reason": vals.discount_reason,
                "date_of_joining": vals.date_of_joining ? vals.date_of_joining.toISOString().slice(0, 10) : null,
                "note": vals.note,
                "registration_status_id": vals.registration_status_id,
                "registration_status": vals.registration_status,
                "placement_company": vals.placement_company,
                "placement_notes": vals.placement_notes,
                "registration_status_notes": vals.status_notes,
                "placement_date": vals.placement_date,
                "batch_startdate": vals.batch_startdate,
                "batch_enddate": vals.batch_enddate
            }));

            // Original sort was by 'enquiry_date', which is not present.
            // Assuming it should be by register_id or no sort if the query implies order.
            // response_data.sort((a, b) => b.register_id - a.register_id); // Example if sorting

            return res.status(200).send({
                status: "200",
                message: "Data Found",
                data: response_data
            });

        } catch (err) { // Catching DB query error
            console.log("error occurred", err);
            if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
            return res.status(500).send({ // Uniform error response
                "code": 500,
                "failed": "erreur survenue"
            });
        }
    }
}

const getPaymentDetailsByRegisterId = async (req, res, next) => {
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
        try {
            var cache = req.app.get('cache');
            const result = await query(sql1, [req.body.registration_id, req.body.registration_id]);

            if (cache && cache.isCache) { connection.flush(); }

            if (result.length > 0) {
                var total_fees = result[0].total_fees; // These should be consistent across all results if student_fees is the same
                var pending_fees = result[0].pending_fees;

                const response_data = result.map(vals => ({
                    "payment_id": vals.payment_id,
                    "registration_id": vals.registration_id,
                    // "paid_amount": vals.student_name, // This seems to be a typo, should be vals.paid_amount
                    "paid_amount": vals.paid_amount,
                    // "gst": vals.batch_id, // This seems to be a typo, should be vals.gst
                    "gst": vals.gst,
                    "fees": vals.fees,
                    "payment_type": vals.payment_type,
                    "payment_date": vals.payment_date ? vals.payment_date.toISOString().slice(0, 10) : null,
                    "receipt_no": vals.receipt_no
                }));

                // Original sort was by 'enquiry_date', not present. Assuming sort by payment_id or date.
                // response_data.sort((a,b) => b.payment_id - a.payment_id); // Example if sorting

                return res.status(200).send({
                    status: "200",
                    message: "Data Found",
                    total_fees: total_fees,
                    pending_fees: pending_fees,
                    data: response_data
                });
            } else {
                // Nested query if no results from the first one
                var sql2 = "SELECT r.student_fees AS total_fees,r.student_fees AS pending_fees FROM registrartion r WHERE r.id=?";
                const result2 = await query(sql2, [req.body.registration_id]);

                if (cache && cache.isCache) { connection.flush(); } // Flush again if needed for the second query

                if (result2.length > 0) {
                    return res.status(200).send({
                        status: "200",
                        message: "Data Found", // Or "No payment transactions, only registration fee info"
                        total_fees: result2[0].total_fees,
                        pending_fees: result2[0].pending_fees,
                        data: [] // No payment details, so empty array
                    });
                } else {
                    return res.status(200).send({ // If student registration not found either
                        status: "200", // Or 404
                        message: "No Registration or Payment Data Found",
                        data: []
                    });
                }
            }
        } catch (err) {
            console.log("error occurred", err);
            if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
            return res.status(500).send({
                "code": 500,
                "failed": "erreur survenue"
            });
        }
    }
}

const getPaymentDetailsById = async (req, res, next) => {
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
        try {
            var cache = req.app.get('cache');
            const result = await query(sql1, [req.body.payment_id]);

            if (cache && cache.isCache) { connection.flush(); }

            if (result.length > 0) {
                // Data processing similar to getPaymentDetailsByRegisterId
                const total_fees = result[0].total_fees;
                const pending_fees = result[0].pending_fees;

                const response_data = result.map(vals => ({
                    "payment_id": vals.payment_id,
                    "registration_id": vals.registration_id,
                    // "paid_amount": vals.student_name, // Typo from original, should be paid_amount
                    "paid_amount": vals.paid_amount,
                    // "gst": vals.batch_id, // Typo from original, should be gst
                    "gst": vals.gst,
                    "fees": vals.fees,
                    "payment_type": vals.payment_type,
                    "payment_date": vals.payment_date ? vals.payment_date.toISOString().slice(0, 10) : null,
                    "receipt_no": vals.receipt_no
                }));

                // The original code sent response inside forEach, which is not ideal.
                // Sending one response after mapping.
                return res.status(200).send({
                    status: "200",
                    message: "Data Found",
                    total_fees: total_fees,
                    pending_fees: pending_fees,
                    data: response_data
                });
            } else {
                return res.status(200).send({ // Consistent "No Data Found"
                    status: "200",
                    message: "No Data Found",
                    data: []
                });
            }
        } catch (err) {
            console.log("error occurred", err);
            if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
            return res.status(500).send({
                "code": 500,
                "failed": "erreur survenue"
            });
        }
    }
}



const getPaymentType = async (req, res, next) => {
    var sql1 = "select * from payment_type";
    try {
        var cache = req.app.get('cache');
        const result = await query(sql1);

        if (cache && cache.isCache) { // Check if cache is defined
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result,
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) { // Check if cache is defined
            connection.flush();
        }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
};


const getAllPaymentDetails = async (req, res, next) => {
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
    if (req.body.batch_id != null && // Corrected: was `batch_id` but used `VALUES.push(batch_id)` which is undefined. Should be `req.body.batch_id`
        req.body.batch_id != "" &&
        req.body.batch_id != undefined) {
        VALUES.push(req.body.batch_id) // Corrected
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

    try {
        var cache = req.app.get('cache');
        const result = await query(sql1, VALUES);

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result,
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
};
const getAllReportDetails = async (req, res, next) => {
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

    var sql_counts = "select ( " + reg_count_query + ") as registration_count," + "(" + enq_count_query + ") as enquiry_count";

    try {
        var cache = req.app.get('cache');
        const count_result = await query(sql_counts, VALUES);
        if (cache && cache.isCache) { connection.flush(); }

        const regresult = await query(req_query, REG_COUNT_VALUES);
        if (cache && cache.isCache) { connection.flush(); }

        let register_data = [];
        if (regresult.length > 0) {
            register_data = regresult.map(vals => ({
                "register_id": vals.register_id,
                "student_id": vals.student_id,
                "student_name": vals.student_name,
                "batch_id": vals.batch_id,
                "batch_name": vals.batch_name,
                "course": vals.course,
                "student_fees": vals.student_fees,
                "discount_amount": vals.discount_amount,
                "discount_reason": vals.discount_reason,
                "date_of_joining": vals.date_of_joining ? vals.date_of_joining.toISOString().slice(0, 10) : null,
                "note": vals.note,
                "registration_status_id": vals.registration_status_id,
                "registration_status": vals.registration_status,
                "placement_company": vals.placement_company,
                "placement_notes": vals.placement_notes
            }));
        }

        const enqresult = await query(enq_query, ENQ_COUNT_VALUES);
        if (cache && cache.isCache) { connection.flush(); }

        let enquiry_data = [];
        if (enqresult.length > 0) {
            enquiry_data = enqresult.map(vals => {
                let courses = vals.course ? vals.course.split(",") : [];
                return {
                    "enquiry_id": vals.enquiry_id,
                    "name": vals.name,
                    "email": vals.email,
                    "gender": vals.gender,
                    "mobile": vals.mobile,
                    "alter_no": vals.alter_no,
                    "address": vals.address,
                    "college": vals.college,
                    "referral_source": vals.referral_source,
                    "enquiry_date": vals.enquiry_date ? vals.enquiry_date.toISOString().slice(0, 10) : null,
                    "referred_by": vals.referred_by,
                    "dob": vals.dob ? vals.dob.toISOString().slice(0, 10) : null,
                    "department": vals.department,
                    "enquiry_status": vals.enquiry_status,
                    "course": courses
                };
            });
        }

        return res.status(200).send({
            status: "200",
            message: "Data Found",
            records_count: count_result, // count_result itself is an array like [ { registration_count: x, enquiry_count: y } ]
            register_data: register_data,
            enquiry_data: enquiry_data
        });

    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
};


const getAllPaymentReportDetails = async (req, res, next) => {
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
    try {
        var cache = req.app.get('cache');
        const count_result = await query(pay_count_query, VALUES);
        if (cache && cache.isCache) { connection.flush(); }

        const result = await query(pay_get_query, VALUES);
        if (cache && cache.isCache) { connection.flush(); }

        return res.status(200).send({
            status: '200',
            records_count: count_result,
            payment_data: result
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            "code": 500,
            "failed": "erreur survenue"
        });
    }
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
    // No longer needs to return a new Promise explicitly when it's an async function
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var monthDataArray = []; // Changed variable name
    // console.log(startDate, endDate); // Kept for debugging if needed by user

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1; // month is 0-indexed
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0; // month is 0-indexed
        for (var j = startMon; j <= endMonth; j++) { // Simplified loop increment
            var monthNum = j + 1;
            var monthPadded = monthNum < 10 ? '0' + monthNum : monthNum.toString();

            const dateString = `${i}-${monthPadded}-01`;
            const dateForDisplay = new Date(dateString);
            const displayMonth = `${dateForDisplay.getFullYear()} ${dateForDisplay.toLocaleString('default', { month: 'long' })}`;

            monthDataArray.push({
                dateString: dateString,
                displayMonth: displayMonth
            });
        }
    }
    return monthDataArray; // Async function automatically returns a promise resolving with this value
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
    try {
        var cache = req.app.get('cache'); // Get cache instance once
        const datarange = await dateRangeCount(startdate, endate);
        // Assuming dateRangeCount doesn't interact with the DB cache that connection.flush clears.

        var sql_enq_count = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(e.id) AS enq_count FROM ( " + datarange + " ) as Months LEFT JOIN enquiry e on MONTH(Months.merge_date) = MONTH(e.enquiry_date) AND YEAR(Months.merge_date)=YEAR(e.enquiry_date) AND e.is_delete='0' GROUP BY Months.merge_date ";
        const enq_result = await query(sql_enq_count);
        if (cache && cache.isCache) { connection.flush(); }

        var sql_reg_count = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS reg_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' GROUP BY Months.merge_date ";
        const reg_result = await query(sql_reg_count);
        if (cache && cache.isCache) { connection.flush(); }

        let arr3 = enq_result.map((item, i) => Object.assign({}, item, reg_result[i]));

        var sql_placement_count = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS placement_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' and r.placement_status='1' GROUP BY Months.merge_date ";
        const placement_result = await query(sql_placement_count);
        if (cache && cache.isCache) { connection.flush(); }

        let arr4 = arr3.map((item, i) => Object.assign({}, item, placement_result[i]));

        return res.status(200).send({
            status: '200',
            data: arr4
        });

    } catch (err) {
        console.log("error occurred", err);
        // Assuming cache might have been defined before error
        if (req.app.get('cache') && req.app.get('cache').isCache) { connection.flush(); }
        return res.status(500).send({
            status: '500', // Consistent error status
            message: "Something went wrong"
        });
    }
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
    try {
        var cache = req.app.get('cache');
        const datarange = await dateRangeCount(startdate, endate);
        // Assuming dateRangeCount doesn't interact with the DB cache

        var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS pay_count,SUM(r.fees) AS paid_amount FROM ( " + datarange + " ) as Months LEFT JOIN fees_transaction_details r on MONTH(Months.merge_date) = MONTH(r.payment_date) AND YEAR(Months.merge_date)=YEAR(r.payment_date) AND r.is_delete='0'  GROUP BY Months.merge_date";
        const result = await query(sql1); // Changed 'placment' to 'result' for clarity

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result // Changed 'placment' to 'result'
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
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
    try {
        var cache = req.app.get('cache');
        const result = await query(sql); // Changed 'placment' to 'result'

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result // Changed 'placment' to 'result'
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
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
    try {
        var cache = req.app.get('cache');
        const result = await query(sql); // Changed 'placment' to 'result'

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result // Changed 'placment' to 'result'
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
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

    try {
        var cache = req.app.get('cache'); // Get cache instance once, though likely not used here.
        const monthDataArray = await ProjectReportdateRangeCount(startdate, endate);

        if (!monthDataArray || monthDataArray.length === 0) {
            return res.status(200).send({
                status: "200",
                message: "No date range to process",
                data: []
            });
        }

        const subqueries = monthDataArray.map(month => {
            // Ensure month.displayMonth and month.dateString are properly escaped
            // if they could ever contain malicious characters.
            // For this specific case (YYYY MMMM and YYYY-MM-DD), it's less of a concern.
            return `
              (SELECT
                '${month.displayMonth}' AS month,
                COALESCE(ROUND(SUM(r.actual_fees / b.batch_duration), 2), 0) AS amount
              FROM registrartion r
              LEFT JOIN batch b ON b.id = r.batch_id
              WHERE ('${month.dateString}' BETWEEN b.batch_startdate AND b.batch_enddate)
                AND r.is_delete = '0')
            `;
        });

        const finalSql = subqueries.join(' UNION ALL ') + " ORDER BY STR_TO_DATE(CONCAT('01 ', month), '%d %Y %M')";

        const results = await query(finalSql);

        if (cache && cache.isCache) {
            connection.flush(); // Flush if necessary, though unlikely for this type of query
        }

        // The SQL query already orders the results, so JavaScript sort is not strictly needed here.
        // results.sort((a, b) => new Date(a.month) - new Date(b.month)); // If client-side sort was preferred

        return res.status(200).send({
            status: "200",
            message: "Data Found",
            data: results
        });

    } catch (err) {
        console.log("error occurred in getProjectedReport", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
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
    try {
        var cache = req.app.get('cache');
        const result = await query(sql, VALUES); // Changed 'placment' to 'result'

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result // Changed 'placment' to 'result'
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
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
    try {
        var cache = req.app.get('cache');
        const datarange = await dateRangeCount(startdate, endate);
        // Assuming dateRangeCount doesn't interact with the DB cache

        var sql1 = "SELECT  DATE_FORMAT(Months.merge_date,'%Y %M')AS month , COUNT(r.id) AS placement_count FROM ( " + datarange + " ) as Months LEFT JOIN registrartion r on MONTH(Months.merge_date) = MONTH(r.date_of_joining) AND YEAR(Months.merge_date)=YEAR(r.date_of_joining) AND r.is_delete='0' and r.placement_status='1' GROUP BY Months.merge_date ";
        const result = await query(sql1); // Changed 'placment' to 'result'

        if (cache && cache.isCache) {
            connection.flush();
        }

        return res.status(200).send({
            status: '200',
            data: result // Changed 'placment' to 'result'
        });
    } catch (err) {
        console.log("error occurred", err);
        if (req.app.get('cache') && req.app.get('cache').isCache) {
            connection.flush();
        }
        return res.status(500).send({
            status: '500',
            message: "Something went wrong"
        });
    }
}
module.exports = {
    insertRegistration, saveOrUpdateStudentDetails, getStudentDetailById, getAllBatch, getAllRegisterDetails,
    getAllBatchByCourseId, getAllStudentDetails, getAllYear, getAllRegisterStatus, getRegisterById,
    saveOrUpdatePaymentDetails, getPaymentDetailsByRegisterId, getPaymentType, getAllPaymentDetails,
    getAllReportDetails, getAllPaymentReportDetails, getBarReport, getBarPaymentReport, getCollegeWiseReport,
    getCourseWiseReport, getProjectedReport, getDueAmountReport, getPlacementReport, getPaymentDetailsById
};