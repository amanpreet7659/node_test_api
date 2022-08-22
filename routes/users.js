const express = require("express");
const router = express.Router();
const mongose = require("mongoose");
const User = require('../models/user');
const { success, error } = require("../services/response");

// to get all users

router.get("/", async (req, res, next) => {
    let { limit = 10, page = 1, orderBy = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page) - 1;
    const totalData = await User.find({ isDeleted: false }).sort({ firstName: orderBy }).count()
    User.find({ isDeleted: false })
        .sort({ firstName: orderBy })
        .limit(limit)
        .skip(page * limit)
        .then(data => {
            success(res, { data, totalData })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "Error occurs"
            });
        });
});

// get all soft deleted

router.get("/deleted", async (req, res, next) => {
    let { limit = 10, page = 1 } = req.query;
    limit = parseInt(limit);
    page = parseInt(page) - 1;
    const totalData = await User.find({ isDeleted: true }).count()
    User.find({ isDeleted: true })
        // .exec()
        .limit(limit)
        .skip(page * limit)
        .then(data => {
            success(res, { data, totalData })
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
        .then(data => {
            success(res, { data })
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
        .then(data => {
            if (data.isDeleted == false) {
                success(res, data)
            }
            if (data.isDeleted != false) {
                error(res, { message: "No record found" })
            }
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
        .then(data => {
            success(res, { message: "Deleted Successfully", data })
        })
        .catch(err => {
            error(res, err)
        });
})

// to hard delete

router.delete('/hardDelete/:id', (req, res, next) => {
    const id = req.params.id;
    User.remove({ _id: id })
        .then(response => {
            success(res, {
                message: "Successfully Deleted",
                data: response
            })
        })
        .catch(err =>
            error(res, err)
        )
})

// filteration 

router.get('/search/:string', async (req, res, next) => {
    const searchString = req.params.string
    User.find({ isDeleted: false }).exec().then(response => {
        if (searchString.split(" ").length > 1) {
            const searchQuery = searchString.split(" ").map((_) => _.toLowerCase())
            const data = response.filter((_) => (searchQuery.includes(_.firstName.toLowerCase())) || searchQuery.includes(_.lastName.toLowerCase()))
            const totalData = data.length
            success(res, { data, totalData })
        } else {
            const filterUser = response.filter((data) => (data.firstName.toLowerCase().includes(searchString.toLowerCase())
                || data.lastName.toLowerCase().includes(searchString.toLowerCase())
                || data.email.toLowerCase().includes(searchString.toLowerCase())
                || data.phoneNumber.toString().includes(searchString.toString())))
            success(res, { data: filterUser, totalData: filterUser.length })
        }
    })
        .catch(err => {
            error(res, err)
            console.log(err);
        })
})

// upload bulk record

router.post('/bulk', async (req, res, next) => {
    try {
        const { columns, data } = req.body
        const bulkData = data.map((d) => {
            return {
                _id: new mongose.Types.ObjectId(),
                firstName: d.firstName,
                lastName: d.lastName,
                email: d.email,
                // dateOfBirth: d.dateOfBirth.toString(),
                phoneNumber: d.phoneNumber,
                isDeleted: false
            }
        })
        console.log(bulkData);
        const result = await User.insertMany(bulkData)
        success(res, { data: result })
    } catch (err) {
        error(res, err)
    }
})

// // sorting

// router.get('/sortData/data/:orderBy', async (req, res, next) => {
//     let { limit = 10, page = 1 } = req.query;
//     const { orderBy } = req.params
//     try {
//         const totalData = await User.find({ isDeleted: false }).sort({ firstName: orderBy }).count()
//         User.find({ isDeleted: false }).sort({ firstName: -1 })
//             .limit(limit)
//             .skip(page * limit)
//             .then(record => {
//                 success(res, { data: record, totalData })
//             })
//         // })
//     } catch (err) {
//         error(res, err)
//     }
// })

module.exports = router