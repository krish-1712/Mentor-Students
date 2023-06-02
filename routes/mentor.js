var express = require('express');
const mongoose = require('mongoose')
const { dbUrl } = require('../Common/dbConfig');
const { mentorModel } = require('../Models/mentor');

mongoose.connect(dbUrl)

var mentorRouter = express.Router();

/* create mentor */
mentorRouter.post('/mentor', async (req, res) => {
    const { name, email, course } = req.body;
    const addMentor = new mentorModel({
        "name": name,
        "email": email,
        "course": course
    })

    try {
        const newMentor = await addMentor.save();

        res.status(200).send({
            message: "Mentor Created Sucessfully!!",
            newMentor
        })
    } catch (err) {
        res.status(500).send({
            message: "Server Error",
            err
        });
    }
})

/* get all mentor details */
mentorRouter.get('/', async (req, res) => {
    try {
        const mentors = await mentorModel.find();
        res.status(200).send({
            message: "All Mentor Details",
            mentors
        });
    } catch (err) {
        res.status(400).send({
            message: "Internal Server Error",
            err
        });
    }

})

/* get mentor based on ID */
mentorRouter.get('/get-mentor/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const mentor = await mentorModel.findById({ _id: id })
        res.status(200).send({
            message: "Mentors Based On ID",
            mentor
        });
    } catch (err) {
        res.status(400).send({
            message: "Internal Server Error",
            err
        });
    }
})



module.exports = mentorRouter;
