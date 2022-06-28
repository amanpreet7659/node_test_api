const express = require("express");
const router = express.Router();
const mongose = require("mongoose");
const User = require('../models/user');

// to get all users
router.get("/", (req, res, next) => {
    // const totalCount=User.count()
    // console.log(totalCount,"totalCount");
    User.find({ isDeleted: false })
        .exec()
        .then(doc => {
            res.status(200).json({
                data: doc,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: "Error occurs"
            });
        });
});

// to add user 
router.post("/", (req, res, next) => {
    const newUser = new User({
        _id: new mongose.Types.ObjectId(),
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middelName: req.body.middelName,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        image_url: req.body.image_url,
        isDeleted: false
    })

    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            res.status(400).json({
                message: "User already exist"
            });
        } else {
            newUser.save().then(
                response => {
                    res.status(201).json({
                        data: response
                    });
                }
            ).catch(err => {
                console.log(err)
            })
        };
    });
})

// update record

router.patch("/:id", (req, res, next) => {
    const id = req.params.id;
    const updateProduct = {
        _id: id,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middelName: req.body.middelName,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        image_url: req.body.image_url,
        isDeleted: false
    };
    User.update({ _id: id }, { $set: updateProduct })
        .exec()
        .then(resp => {
            res.status(200).json(resp);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
})

// to get single user
router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// soft delete record

router.delete("/delete/:id", (req, res, next) => {
    const id = req.params.id;
    const updateProduct = {
        _id: id,
        isDeleted: true
    };
    User.update({ _id: id }, { $set: updateProduct })
        .exec()
        .then(resp => {
            // success(resp,{message: "Deleted Successfully"})
            res.status(200).json({
                message: "Deleted Successfully"
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
})

// to hard delete

router.delete('/hardDelete/:id', (req, res, next) => {
    const id = req.params.id;
    User.remove({ _id: id })
        .then(response => {
            res.status(200).json({
                message: "Successfully Deleted",
                data: response
            })
        })
        .catch(err =>
            res.status(500).json({ err })
        )
})
module.exports = router