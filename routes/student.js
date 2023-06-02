var express = require('express');
const mongoose = require('mongoose')
const { dbUrl } = require('../Common/dbConfig');
const { studentModel } = require('../Models/Student');
const { mentorModel } = require('../Models/mentor');

mongoose.connect(dbUrl)

var studentRouter = express.Router();
/* Create a new Students*/
studentRouter.post('/student', async (req, res) => {

    try {

        const addStudent = new studentModel({
            "name": req.body.name,
            "batch": req.body.batch,
            "mentor": req.body.mentor ? req.body.mentor : undefined
        })

        const newStudent = await addStudent.save();
        res.status(200).send({
            message: "Students Created Successfully!!",
            newStudent
        })
    } catch (err) {
        res.status(500).send({
            message: "Server Error",
            err
        });

    }
})
studentRouter.get('/all-students', async (req, res) => {
    try {
        const students = await studentModel.find({})
        res.status(200).send({
            message: "all Students",
            students
        })


    } catch (err) {
        res.status(500).send({
            err
        });
    }

})
/* select one mentor and add to multiple students */
studentRouter.patch('/assign-mentor-students', async (req, res) => {
    const { mentor, stud_list } = req.body;
    console.log(stud_list)
    try {
        stud_list.map(async (stud_id) => {
            const student = await studentModel.findById(stud_id)
            student.mentor = mentor;
            await student.save();
        })
        res.status(200).send({
            message: "Updated Successfully"
        });
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error",
            err
        });
    }
})

/*  List of students with no mentors */

studentRouter.get('/no-mentors', async (req, res) => {
    try {
        const students = await studentModel.find({ mentor: undefined })
        res.status(200).send({
            students
        });
    } catch (error) {
        res.status(500).send({
            error
        })
    }

})
/*  select one student and assign one mentor */
studentRouter.patch('/assign-mentor/:id', async (req, res) => {
    const { id } = req.params;
    const { mentor } = req.body;
    try {
        const student = await studentModel.findById(id);
        student.mentor = mentor;
        await student.save();
        res.status(200).send({
            student
        });
    } catch (err) {
        res.status(500).send({
            err
        });

    }
})

/* show all students for a particular mentor */
studentRouter.get('/mentor-students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const students = await studentModel.find({ mentor: id });
        res.status(200).send({
            students
        });
    } catch (err) {
        res.status(500).send({
            err
        });
    }
})

// Get the previously assigned mentor for a student
studentRouter.get('/:studentId/mentor', async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find the student by ID
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).send({
                message: 'Student not found',
                error
            });
        }
        res.status(200).send({
            student
        })

        // Find the previously assigned mentor for the student
        const mentorId = studentModel.mentorId;

        if (!mentorId) {
            return res.status(404).send({
                message: 'Mentor not assigned for this student',
                error
            });
        }
        res.status(200).send({
            mentorId
        })

        const mentor = await mentorModel.findById(mentorId);
        if (!mentor) {
            return res.status(404).send({
                message: 'Mentor not found',

            });
        }

        res.status(200).send({
            mentor
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Server error',
            err
        });
    }
});






module.exports = studentRouter;