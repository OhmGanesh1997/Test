const e = require("express");
var connection = require("../../config/db");

const insertEnquiry = (req, res, next) => {

    if (req.body.enquiry_id != null &&
        req.body.enquiry_id != "" &&
        req.body.enquiry_id != undefined) {
        var sql = "SELECT * FROM enquiry e WHERE e.id = ?";
        connection.query(sql, [req.body.enquiry_id], function (err, id, cache) {
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
                    var sql = "SELECT * FROM enquiry e WHERE e.email = ? and e.id!=?";
                    connection.query(sql, [req.body.email, req.body.enquiry_id], function (err, email, cache) {
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
                                var sql = "SELECT * FROM enquiry e WHERE e.mobile =? and e.id!=?";
                                connection.query(sql, [req.body.phone, req.body.enquiry_id], function (err, phone, cache) {
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
                                            var referral_source_id = req.body.referral_source_id == null || req.body.referral_source_id == "" || req.body.referral_source_id == undefined ? 7 : req.body.referral_source_id;
                                            var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                                            var enquiry_date = req.body.enquiry_date == null || req.body.enquiry_date == "" || req.body.enquiry_date == undefined ? new Date().toISOString().slice(0,10) : req.body.enquiry_date;
                                            var sql = "update  `enquiry` set name=?,email=?,mobile=?,alter_no=?,address=?,college=?,referral_source_id=?, referred_by=?,enquiry_date=?,dob=?,gender=?,modified_by=?, department=? ,modified_at=CURRENT_TIMESTAMP where id= ?";
                                            connection.query(sql, [req.body.name, req.body.email, req.body.mobile, req.body.alter_no, req.body.address, college, referral_source_id, req.body.referred_by, enquiry_date, req.body.dob, req.body.gender, req.logged_in_id, req.body.department, req.body.enquiry_id], function (err, insertenq, cache) {
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
                                                    var sql = "DELETE FROM enquiry_course  WHERE enquiry_id=? ";
                                                    connection.query(sql, [req.body.enquiry_id], function (err, resu, cache) {
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
                                                            req.body.enquiry_course.forEach((vals, pindex) => {
                                                                var sql = "insert into `enquiry_course` ( enquiry_id,course_id)values ?";
                                                                var VALUES = [[req.body.enquiry_id, vals],];
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
                                                                            message: 'Enquiry Updated Succesfully',
                                                                        }
                                                                        pindex == req.body.enquiry_course.length - 1 && res.status(200).send(response);
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    var response = {
                        status: '400',
                        message: "Check Enquiry Id"
                    }
                    res.status(200).send(response);
                }
            }
        })
    }
    else {
        var sql = "SELECT * FROM enquiry e WHERE e.email = ?";
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
                    var sql = "SELECT * FROM enquiry e WHERE e.mobile =?";
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
                                var sql = "insert into `enquiry` (name,email,mobile,alter_no,address,college,referral_source_id, referred_by,enquiry_date,dob,gender,created_by,modified_by, department,enquiry_status,is_delete) values ?";
                                var referral_source_id = req.body.referral_source_id == null || req.body.referral_source_id == "" || req.body.referral_source_id == undefined ? 7 : req.body.referral_source_id;
                                var college = req.body.college == null || req.body.college == "" || req.body.college == undefined ? 21 : req.body.college;
                                var enquiry_date = req.body.enquiry_date == null || req.body.enquiry_date == "" || req.body.enquiry_date == undefined ? new Date().toISOString().slice(0,10) : req.body.enquiry_date;
                                var VALUES = [[req.body.name, req.body.email, req.body.mobile, req.body.alter_no, req.body.address, college, referral_source_id, req.body.referred_by,enquiry_date, req.body.dob, req.body.gender, req.logged_in_id, req.logged_in_id, req.body.department, 1, "0"],];
                                connection.query(sql, [VALUES], function (err, insertenq, cache) {
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
                                        req.body.enquiry_course.forEach((vals, pindex) => {
                                            var sql = "insert into `enquiry_course` ( enquiry_id,course_id)values ?";
                                            var VALUES = [[insertenq.insertId, vals],];
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
                                                        message: 'Enquiry Added Succesfully',
                                                    }
                                                    pindex == req.body.enquiry_course.length - 1 && res.status(200).send(response);
                                                }
                                            });

                                        });
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

const getGender = (req, res, next) => {

    var sql1 = "select * from gender";
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
const getEnquiryStatus = (req, res, next) => {

    var sql1 = "select * from enquiry_status";
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


const getCourse = (req, res, next) => {

    var sql1 = "SELECT c.id AS course_id,c.course,c.fees,c.is_active,  (SELECT COUNT(*) FROM registrartion r WHERE r.batch_id IN ( SELECT b.id FROM batch b WHERE b.course_id=c.id)) as student_count from course c GROUP BY c.id";
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

const getCollegeDetails = (req, res, next) => {

    var sql1 = "SELECT * ,(SELECT COUNT(*) FROM student_details r WHERE r.college=c.id) as student_count from college_details c ";
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

const getCompanyDetails = (req, res, next) => {

    var sql1 = "select * from companies";
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


const getReferral_Source = (req, res, next) => {

    var sql1 = "select * from referral_source";
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


const updateEnquiry_Status = (req, res, next) => {
    if (
        req.body.enquiry_id == null ||
        req.body.enquiry_id == "" ||
        req.body.enquiry_id == undefined ||
        req.body.enquiry_status == null ||
        req.body.enquiry_status == "" ||
        req.body.enquiry_status == undefined

    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {
        var sql1 = "SELECT * FROM enquiry e WHERE e.id=? AND e.is_delete='0'";
        connection.query(sql1, [req.body.enquiry_id], function (err, enq, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                if (enq.length > 0) {
                    var sql1 = "SELECT * FROM enquiry_status e WHERE e.id=?";
                    connection.query(sql1, [req.body.enquiry_status], function (err, enq1, fields) {
                        if (err) {
                            console.log("error ocurred", err);
                            res.status(400).send({
                                "code": 400,
                                "failed": "erreur survenue"
                            })
                        }
                        else {
                            if (enq1.length > 0) {
                                var sql1 = "UPDATE enquiry SET enquiry_status=?,modified_by=?,modified_at=CURRENT_TIMESTAMP WHERE id=?";
                                connection.query(sql1, [req.body.enquiry_status, req.logged_in_id, req.body.enquiry_id], function (err, enq1, fields) {
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
                                            message: "Enquiry Status Updated Successfully",
                                        }
                                        res.status(200).send(response)
                                    }
                                });
                            }
                            else {
                                var response = {
                                    status: '400',
                                    message: "check Enquiry Status Id",
                                }
                                res.status(200).send(response)
                            }
                        }
                    });
                }
                else {
                    var response = {
                        status: '400',
                        message: "check Enquiry Id",
                    }
                    res.status(200).send(response)
                }
            }
        });
    }
};

const getAllEnquiry = (req, res, next) => {
    var VALUES = [];
    // Make the main SQL query more readable
    var sql1 = `
        SELECT
            e.id AS enquiry_id,
            e.name,
            e.email,
            g.gender,
            e.mobile,
            e.alter_no,
            e.address,
            cl.college,
            ref.referral_source,
            DATE_FORMAT(e.enquiry_date, '%Y-%m-%d') AS enquiry_date,
            e.referred_by,
            DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob,
            e.department,
            es.enquiry_status,
            JSON_ARRAYAGG(c.course) AS course
        FROM enquiry e
        JOIN enquiry_course ec ON ec.enquiry_id = e.id
        JOIN course c ON c.id = ec.course_id
        JOIN gender g ON g.id = e.gender
        JOIN college_details cl ON cl.id = e.college
        JOIN referral_source ref ON ref.id = e.referral_source_id
        JOIN enquiry_status es ON es.id = e.enquiry_status
        WHERE e.is_delete = '0'
    `;

    if (req.body.name != null &&
        req.body.name != "" &&
        req.body.name != undefined) {
        VALUES.push('%' + req.body.name + '%')
        sql1 = sql1 + " AND e.name LIKE ?"
    }
    if (req.body.mobile != null &&
        req.body.mobile != "" &&
        req.body.mobile != undefined) {
        VALUES.push('%' + req.body.mobile + '%')
        sql1 = sql1 + " AND e.mobile LIKE ?"
    }
    if (req.body.enquiry_course != null &&
        req.body.enquiry_course != "" &&
        req.body.enquiry_course != undefined) {
        VALUES.push(req.body.enquiry_course)
        sql1 = sql1 + " AND e.id IN (SELECT f.enquiry_id FROM enquiry_course f WHERE f.course_id = ?)"
    }
    if (req.body.enquiry_status != null &&
        req.body.enquiry_status != "" &&
        req.body.enquiry_status != undefined) {
        VALUES.push(req.body.enquiry_status)
        sql1 = sql1 + " AND es.id = ?"
    }

    // Validate req.body.last_id
    if (req.body.last_id != null && req.body.last_id != "" && req.body.last_id != undefined) {
        const lastId = parseInt(req.body.last_id);
        if (!isNaN(lastId)) {
            VALUES.push(lastId);
            sql1 = sql1 + " AND e.id < ?";
        }
    }

    // Validate req.body.first_id
    if (req.body.first_id != null && req.body.first_id != "" && req.body.first_id != undefined) {
        const firstId = parseInt(req.body.first_id);
        if (!isNaN(firstId)) {
            VALUES.push(firstId);
            sql1 = sql1 + " AND e.id > ?";
        }
    }

    sql1 = sql1 + " GROUP BY e.id ";

    // Validate req.body.page_records
    let pageRecords = 10; // Default value
    if (req.body.page_records != null && req.body.page_records != "" && req.body.page_records != undefined) {
        const parsedPageRecords = parseInt(req.body.page_records);
        if (!isNaN(parsedPageRecords) && parsedPageRecords > 0) {
            pageRecords = parsedPageRecords;
        }
    }
    sql1 += ' ORDER BY e.id DESC LIMIT ' + pageRecords;

    connection.query(sql1, VALUES, function (err, result, fields) { // Removed async
        if (err) {
            console.log("error ocurred", err);
            res.status(400).send({
                "code": 400,
                "failed": "erreur survenue"
            })
        }
        else {
            if (result.length > 0) {
                var response = [];
                result.forEach((vals) => { // Removed await and async
                    let courses = [];
                    try {
                        // Assuming vals.course is a JSON string like '["Math", "Science"]'
                        // Or it might already be an array depending on the DB driver's handling of JSON_ARRAYAGG
                        if (typeof vals.course === 'string') {
                            courses = JSON.parse(vals.course);
                        } else if (Array.isArray(vals.course)) {
                            courses = vals.course;
                        }
                    } catch (parseError) {
                        console.error("Error parsing courses JSON:", parseError, "Raw data:", vals.course);
                        // Fallback or error handling if JSON.parse fails or it's not a string/array
                        // For now, we'll leave courses as an empty array or handle as per requirements
                    }
                    response.push({
                        "enquiry_id": vals.enquiry_id,
                        "name": vals.name,
                        "email": vals.email,
                        "gender": vals.gender,
                        "mobile": vals.mobile,
                        "alter_no": vals.alter_no,
                        "address": vals.address,
                        "college": vals.college,
                        "referral_source": vals.referral_source,
                        "enquiry_date": vals.enquiry_date,
                        "referred_by": vals.referred_by,
                        "dob": vals.dob,
                        "department": vals.department,
                        "enquiry_status": vals.enquiry_status,
                        "course": courses
                    });
                });
                // Client-side sorting removed, SQL ORDER BY e.id DESC handles this
                // Moved res.send outside the loop
                res.send({
                    status: "200",
                    message: "Data Found",
                    total_record: response.length, // Use response.length as it's the final count
                    data: response
                });
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


const getEnquiryById = (req, res, next) => {
    if (
        req.body.enquiry_id == null ||
        req.body.enquiry_id == "" ||
        req.body.enquiry_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    } else {

        var sql1 = `
            SELECT
                e.id AS enquiry_id,
                e.name,
                e.email,
                e.gender,
                e.mobile,
                e.alter_no,
                e.address,
                e.college,
                e.referral_source_id,
                DATE_FORMAT(e.enquiry_date, '%Y-%m-%d') AS enquiry_date,
                e.referred_by,
                DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob,
                e.department,
                e.enquiry_status,
                JSON_ARRAYAGG(c.course) AS course  // Changed to c.course and JSON_ARRAYAGG
            FROM enquiry e
            JOIN enquiry_course ec ON ec.enquiry_id = e.id
            JOIN course c ON c.id = ec.course_id
            JOIN gender g ON g.id = e.gender
            JOIN college_details cl ON cl.id = e.college
            JOIN referral_source ref ON ref.id = e.referral_source_id
            JOIN enquiry_status es ON es.id = e.enquiry_status
            WHERE e.id = ? AND e.is_delete = '0'
            GROUP BY e.id
        `;
        connection.query(sql1, [req.body.enquiry_id], function (err, result, fields) { // Removed async
            if (err) {
                console.log("error ocurred", err);
                res.status(400).send({
                    "code": 400,
                    "failed": "erreur survenue"
                })
            }
            else {
                if (result.length > 0) {
                    var response = [];
                    result.forEach((vals) => { // Removed await and async
                    let courses = [];
                    try {
                        // Assuming vals.course is a JSON string like '["Math", "Science"]'
                        // Or it might already be an array depending on the DB driver's handling of JSON_ARRAYAGG
                        if (typeof vals.course === 'string') {
                            courses = JSON.parse(vals.course);
                        } else if (Array.isArray(vals.course)) {
                            courses = vals.course;
                        }
                    } catch (parseError) {
                        console.error("Error parsing courses JSON for getEnquiryById:", parseError, "Raw data:", vals.course);
                    }
                        response.push({
                            "enquiry_id": vals.enquiry_id,
                            "name": vals.name,
                            "email": vals.email,
                            "gender": vals.gender,
                            "mobile": vals.mobile,
                            "alter_no": vals.alter_no,
                            "address": vals.address,
                            "college": vals.college,
                            "referral_source": vals.referral_source_id,
                            "enquiry_date": vals.enquiry_date,
                            "referred_by": vals.referred_by,
                            "dob": vals.dob,
                            "department": vals.department,
                            "enquiry_status": vals.enquiry_status,
                            "course": courses
                        });
                    });
                    // Client-side sorting removed. For a "get by ID" query, sorting is usually not critical for a single record.
                    // The SQL query already ensures we get the specific enquiry.
                    // Moved res.send outside the loop
                    res.send({
                        status: "200",
                        message: "Data Found",
                        data: response
                    });
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
}


const saveOrUpdateCourseDetails = (req, res, next) => {
    if (req.body.course == null ||
        req.body.course == "" ||
        req.body.course == undefined ||
        req.body.fees == null ||
        req.body.fees == "" ||
        req.body.fees == undefined ||
        req.body.is_active == null ||
        req.body.is_active == "" ||
        req.body.is_active == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        if (req.body.course_id != null &&
            req.body.course_id != "" &&
            req.body.course_id != undefined) {

            var sql1 = "SELECT * from course where id=?";
            connection.query(sql1, req.body.course_id, function (err, result, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (result.length > 0) {
                        var sql = "update `course` set course=?,fees=?,is_active=? where id =?";
                        connection.query(sql, [req.body.course, req.body.fees, req.body.is_active, req.body.course_id], function (err, insertenq, cache) {
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
                                    message: "Course Updated Successfully",
                                }
                                res.status(200).send(response)
                            }
                        });
                    }
                    else {
                        var response = {
                            status: '400',
                            data: "check Course Id",
                        }
                        res.status(200).send(response)
                    }
                }
            });

        }
        else {
            var sql = "insert into `course` (course,fees,is_active) values ?";
            var VALUES = [[req.body.course, req.body.fees, req.body.is_active],];
            connection.query(sql, [VALUES], function (err, insertenq, cache) {
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
                        message: "Course Inserted Successfully",
                    }
                    res.status(200).send(response)
                }
            });
        }
    }
};

const saveOrUpdateCollegeDetails = (req, res, next) => {
    if (req.body.college == null ||
        req.body.college == "" ||
        req.body.college == undefined ||
        req.body.is_active == null ||
        req.body.is_active == "" ||
        req.body.is_active == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        console.log(req.body);
        if (req.body.college_id != null &&
            req.body.college_id != "" &&
            req.body.college_id != undefined) {

            var sql1 = "SELECT * from college_details where id=?";
            connection.query(sql1, req.body.college_id, function (err, result, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (result.length > 0) {
                        var sql = "update `college_details` set college=?,contact_name=?,contact_phone=?,notes=?, is_active=? where id =?";
                        connection.query(sql, [req.body.college, req.body.contact_name, req.body.contact_phone, req.body.notes, req.body.is_active, req.body.college_id], function (err, insertenq, cache) {
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
                                    message: "CollegeDetails Updated Successfully",
                                }
                                res.status(200).send(response)
                            }
                        });
                    }
                    else {
                        var response = {
                            status: '400',
                            data: "check College Id",
                        }
                        res.status(200).send(response)
                    }
                }
            });

        }
        else {
            var sql = "insert into `college_details` (college,contact_name,contact_phone,notes,is_active) values ?";
            var VALUES = [[req.body.college, req.body.contact_name, req.body.contact_phone, req.body.notes, req.body.is_active],];
            connection.query(sql, [VALUES], function (err, insertenq, cache) {
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
                        message: "CollegeDetails Inserted Successfully",
                    }
                    res.status(200).send(response)
                }
            });
        }
    }
};

const saveOrUpdateCompanyDetails = (req, res, next) => {
    if (req.body.company == null ||
        req.body.company == "" ||
        req.body.company == undefined ||
        req.body.is_active == null ||
        req.body.is_active == "" ||
        req.body.is_active == undefined
    ) {
        console.log(req.body);
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        if (req.body.company_id != null &&
            req.body.company_id != "" &&
            req.body.company_id != undefined) {

            var sql1 = "SELECT * from companies where id=?";
            connection.query(sql1, req.body.company_id, function (err, result, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (result.length > 0) {
                        var sql = "update `companies` set company=?,contact_name=?,contact_phone=?,notes=?, is_active=? where id =?";
                        connection.query(sql, [req.body.company, req.body.contact_name, req.body.contact_phone, req.body.notes, req.body.is_active, req.body.company_id], function (err, insertenq, cache) {
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
                                    message: "CompanyDetails Updated Successfully",
                                }
                                res.status(200).send(response)
                            }
                        });
                    }
                    else {
                        var response = {
                            status: '400',
                            data: "check College Id",
                        }
                        res.status(200).send(response)
                    }
                }
            });

        }
        else {
            var sql = "insert into `companies` (company,contact_name,contact_phone,notes,is_active) values ?";
            var VALUES = [[req.body.company, req.body.contact_name, req.body.contact_phone, req.body.notes, req.body.is_active],];
            connection.query(sql, [VALUES], function (err, insertenq, cache) {
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
                        message: "CompanyDetails Inserted Successfully",
                    }
                    res.status(200).send(response)
                }
            });
        }
    }
};


const saveOrUpdateBatchDetails = (req, res, next) => {
    if (req.body.course_id == null ||
        req.body.course_id == "" ||
        req.body.course_id == undefined ||
        req.body.batch_name == null ||
        req.body.batch_name == "" ||
        req.body.batch_name == undefined ||
        req.body.batch_startdate == null ||
        req.body.batch_startdate == "" ||
        req.body.batch_startdate == undefined ||
        req.body.batch_enddate == null ||
        req.body.batch_enddate == "" ||
        req.body.batch_enddate == undefined ||
        req.body.batch_duration == null ||
        req.body.batch_duration == "" ||
        req.body.batch_duration == undefined ||
        req.body.is_active == null ||
        req.body.is_active == "" ||
        req.body.is_active == undefined
    ) {
        console.log(req.body);
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        if (req.body.batch_id != null &&
            req.body.batch_id != "" &&
            req.body.batch_id != undefined) {

            var sql1 = "SELECT * from batch where id=?";
            connection.query(sql1, req.body.batch_id, function (err, result, fields) {
                if (err) {
                    console.log("error ocurred", err);
                    res.status(400).send({
                        "code": 400,
                        "failed": "erreur survenue"
                    })
                }
                else {
                    if (result.length > 0) {
                        var sql = "update `batch` set course_id=?,batch_name=?,batch_startdate=?,batch_enddate=?,batch_duration=?, is_active=? where id =?";
                        connection.query(sql, [req.body.course_id, req.body.batch_name, req.body.batch_startdate, req.body.batch_enddate, req.body.batch_duration, req.body.is_active, req.body.batch_id], function (err, insertenq, cache) {
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
                                    message: "BatchDetails Updated Successfully",
                                }
                                res.status(200).send(response)
                            }
                        });
                    }
                    else {
                        var response = {
                            status: '400',
                            data: "check College Id",
                        }
                        res.status(200).send(response)
                    }
                }
            });

        }
        else {
            var sql = "insert into `batch` (course_id,batch_name,batch_startdate,batch_enddate, batch_duration,is_active) values ?";
            var VALUES = [[req.body.course_id, req.body.batch_name, req.body.batch_startdate, req.body.batch_enddate, req.body.batch_duration, req.body.is_active],];
            connection.query(sql, [VALUES], function (err, insertenq, cache) {
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
                        message: "BatchDetails Inserted Successfully",
                    }
                    res.status(200).send(response)
                }
            });
        }
    }
};



const getCourseByid = (req, res, next) => {
    if (req.body.course_id == null ||
        req.body.course_id == "" ||
        req.body.course_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        var sql1 = "SELECT * FROM course c WHERE c.id=?";
        connection.query(sql1, [req.body.course_id], function (err, result, cache) {
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
    }
};

const getCompanyDetailsByid = (req, res, next) => {
    if (req.body.company_id == null ||
        req.body.company_id == "" ||
        req.body.company_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        var sql1 = "SELECT * FROM companies c WHERE c.id=?";
        connection.query(sql1, [req.body.course_id], function (err, result, cache) {
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
    }
};


const getBatchDetailsByid = (req, res, next) => {
    if (req.body.batch_id == null ||
        req.body.batch_id == "" ||
        req.body.batch_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        var sql1 = " select b.id,b.course_id,b.batch_duration,  b.batch_name,DATE_FORMAT( b.batch_startdate,'%Y-%m-%d') as batch_startdate,DATE_FORMAT( b.batch_enddate,'%Y-%m-%d') as batch_enddate,b.is_active  FROM batch b WHERE b.id=?";
        connection.query(sql1, [req.body.batch_id], function (err, result, cache) {
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
    }
};


const getCollegeDetailsByid = (req, res, next) => {
    if (req.body.college_id == null ||
        req.body.college_id == "" ||
        req.body.college_id == undefined
    ) {
        res.status(200).send({
            status: "400",
            message: "Wrong Data Entry",
            data: req.body,
        });
    }
    else {
        var sql1 = "SELECT * FROM college_details c WHERE c.id=?";
        connection.query(sql1, [req.body.course_id], function (err, result, cache) {
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
    }
};



module.exports = {
    insertEnquiry, updateEnquiry_Status, getGender, getCourse, getReferral_Source, getCollegeDetails, getCompanyDetails
    , getAllEnquiry, getEnquiryById, getEnquiryStatus, saveOrUpdateCourseDetails, getCourseByid, getCompanyDetailsByid,
    getCollegeDetailsByid, saveOrUpdateCollegeDetails, saveOrUpdateCompanyDetails, saveOrUpdateBatchDetails, getBatchDetailsByid
};