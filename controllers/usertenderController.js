const express = require('express');
const router = express.Router();
const Usertender = require('../models/usertender');
const nodemailer  = require("nodemailer");
const util = require('util');
// Create
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { isAuthenticated } = require('../middleware/Auth');
const sendEmail = require('../utilis/sendEmail');
const usertender = require('../models/usertender');
const Tender = require('../models/tender');
const user = require('../models/user');
const path = require('path');

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     // region: 'YOUR_AWS_REGION'
//     apiVersion: '2006-03-01' // Add this line
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'dcpr',
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             const extension = path.extname(file.originalname);
//             cb(null, `${Date.now().toString()}${extension}`); // Use a unique key for each file and include the file extension
//         }
//     })
// });

router.post('/tenderapply', async (req, res) => {
    //console.log(req.body)
    let existingApplication = await Usertender.findOne({ name: req.body.name, usertender: req.body.usertender });
    if (existingApplication) {
        //console.log("here")
        return res.status(400).send('You have already applied for this tender. Please wait for verification.');
    }

    if (!req.body.file) {
        return res.status(400).send('No file uploaded');
    }

    const newUsertender = new Usertender({
        name: req.body.name,
        usertender: req.body.usertender,
        file: req.body.file,
    });
    const foundUsertender = await Tender.find({ _id: newUsertender.name });
    const foundUser = await user.find({ _id: newUsertender.usertender });

        const emailOptions = {
            email: 'pmc.neomodernarch@gmail.com', // your email
            subject: `Payment Notification`,
            // message: `You have applied for the tender ${foundUsertender[0].name} and the user is ${foundUser[0].name} and the file is ${newUsertender.file}`
             message :` Hi this is generated email from the system.
                ${foundUser[0].name} has applied for the tender ${foundUsertender[0].name},
             ${foundUsertender[0].title} 
             . The file is located at ${newUsertender.file}`,
        };

        // send email
        await sendEmail(emailOptions,);

        await newUsertender.save();
        res.status(200).json(newUsertender);
    
   
});


// original
// router.post('/tenderapply', async (req, res) => {
    
//     let existingApplication = await Usertender.findOne({ name: req.body.name, usertender: req.body.usertender });
//     if (existingApplication) {
//         return res.status(400).send('You have already applied for this tender. Please wait for verification.');
//     }
//     // upload.single('file',)(req, res, async function (err) {
//     //     if (err) {
//     //         console.error(err);
//     //         return res.status(500).send('Failed to upload file');
//     //     }
//         // const { name, amd, description, Value, role, user, startDate, endDate, seller, admin } = req.body;

//         if (!req.body.file) {
//             return res.status(400).send('No file uploaded');
//         }
//         // // Try to find an existing Usertender with the same details
//         // let usertender = await Usertender.findOne(req.body);

//         // // If an existing Usertender is found, return it
//         // if (usertender) {
//         //     return res.status(201).json({ message: "already applied", usertender });
//         // }

//         const newUsertender = new Usertender({
//             name: req.body.name,
//             usertender: req.body.usertender,
//             file: req.body.file,
//         });
//         // ////console.log(newUsertender, 'newUsertender');

//         const foundUsertender = await Tender.find({ _id: newUsertender.name });
//         const foundUser = await user.find({ _id: newUsertender.usertender });
//         ////console.log(foundUsertender,'foundUsertender');
//         // ////console.log(foundUsertender, 'foundUsertender');
//         // const user = await Usertender.findOne({ usertender: req.body.usertender });
//         // ////console.log(user, 'user');
//         // 
//         // const transporter = nodemailer.createTransport({
//         //     service: "gmail",
//         //     host: "smtp.gmail.com",
//         //     port: 587,
//         //     secure: false,
//         //     auth: {
//         //         user: 'pmc.neomodernarch@gmail.com',
//         //         pass: 'Route#2020'
//         //     },
//         //   });
//         // 
//         const emailOptions = {
//             email: 'pmc.neomodernarch@gmail.com', // your email
//             subject: `Payment Notifaction`,
//             // message: `You have applied for the tender ${foundUsertender[0].name} and the user is ${foundUser[0].name} and the file is ${newUsertender.file}`
//              message :` Hi this is generated email from the system.
//                 ${foundUser[0].name} has applied for the tender ${foundUsertender[0].name},
//              ${foundUsertender[0].title} 
//              . The file is located at ${newUsertender.file}`,
//         };

//         // send email
//         await sendEmail(emailOptions,);

//         await newUsertender.save();
//         res.status(200).json(newUsertender);
//     // });
// });


router.post('/tender/user/find', isAuthenticated, async (req, res) => {
    const tenderId = req.body.name;
    ////console.log(tenderId, 'tenderId');

    const users = await Usertender.find({ name: tenderId }).populate('usertender').populate('name');

    res.status(200).json({ data: users });
});
// Read
router.post('/tender/user/post', isAuthenticated, async (req, res) => {
    const userId = req.body.usertender
    ////console.log(userId, 'userId')
    const usertenders = await Usertender.find({ usertender: userId }).populate('usertender').populate('name');

    res.status(200).json({ data: usertenders });
});



router.post('/getdetails/tender', isAuthenticated, async (req, res) => {
    try {
        const tenderId = req.body.name;
        console.log(req.user, req.params.id, 'userId');

        const usertender = await Usertender.findOne({ usertender: req.user._id,name:tenderId }).populate('usertender').populate('name');
        console.log(usertender, '76')
        res.status(200).json({ data: usertender });
    } catch (err) {
        ////console.log(err);
        res.status(400).json({ message: err.message });
    }
    // // console.l
    // const usertender = await Usertender.find({name:req.user._id}).populate('usertender').populate('name');
    // res.send(usertender);
});
// 
router.get('/admin/getdetails/tender', async (req, res) => {
    try {
        // const tenderId = req.body.name;
        // ////console.log(req.user, req.params.id, 'userId');

        const usertender = await Usertender.find().sort({createdAt: -1}).populate('usertender');;
        // ////console.log(usertender, '76')
        res.status(200).json({ data: usertender });
    } catch (err) {
        ////console.log(err);
        res.status(400).json({ message: err.message });
    }
    // // console.l
    // const usertender = await Usertender.find({name:req.user._id}).populate('usertender').populate('name');
    // res.send(usertender);
});
// Read for particlura user in use
router.post('/myaccount', isAuthenticated, async (req, res) => {

    try {
        ////console.log(req.user._id, 'userId');

        const usertenders = await Usertender.find({ usertender: req.user._id }).populate('usertender').populate('name');
        ////console.log(usertenders, 'usertenders')
        // .populate('User') // assuming 'user' is the field that references the User model
        // .populate('Tender'); // assuming 'tender' is the field that references the Tender model

        res.status(200).json({ data: usertenders });
    } catch (error) {
        ////console.log(error)
        res.status(400).json({ message: error.message })
    }
    // const userId = req.body.usertender;

});

// Update
router.put('/update/:id', async (req, res) => {
    const usertender = await Usertender.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({data:usertender});
});

// Delete
router.delete('/:id', async (req, res) => {
    await Usertender.findByIdAndDelete(req.params.id);
    res.status(204).send();
});


// Upload multiple files
// const uploadFiles = upload.array('files', 10); // change 'files' to the name of the field that is going to be uploaded

// const uploadFilesMiddleware = util.promisify(uploadFiles);

// router.post('/upload', isAuthenticated, async (req, res) => {
//     try {
//         ////console.log(req.body.tenderId)
//         // Check if tender id is provided
//         //console.log(req.body)
//         if (!req.body.tenderId) {
//             return res.status(400).json({ error: 'Tender ID is required' });
//         }

//         // Check if user has applied to the tender
//         const userTender = await usertender.find({ _id: req.body.tenderId, usertender: req.user._id });
//         ////console.log(userTender, 'userTender')
//         if (userTender.length === 0) {
//             return res.status(404).json({ error: 'No tender found for this user' });
//         }

//         // if (req.files.length <= 0) {
//         //     return res.status(400).json({ error: 'You must select at least 1 file.' });
//         // }

//         let fileUrls = [];
//         for (let file of req.body.files) {
//             fileUrls.push(file.filename);
//         }

//         userTender[0].fileUrls = fileUrls;
//         await userTender[0].save();

//         return res.status(200).json({ message: 'Files have been uploaded.' });
//     } catch (error) {
//         console.error(error);

//         if (error.code === "LIMIT_UNEXPECTED_FILE") {
//             return res.status(400).json({ error: "Too many files to upload." });
//         }
//         return res.status(500).json({ error: `Error when trying upload many files: ${error}` });
//     }
// });

router.post('/upload', isAuthenticated, async (req, res) => {
    try {
        // //console.log(req.user._id)
        if (!req.body.tenderId) {
            return res.status(400).json({ error: 'Tender ID is required' });
        }

        const userTender = await usertender.find({ _id: req.body.tenderId, usertender: req.user._id });

        if (userTender.length === 0) {
            return res.status(404).json({ error: 'No tender found for this user' });
        }

        // let fileUrls
        // //  = req.body.fileUrls && req.body.files.map(file => file.filename); // Modified this line
       userTender[0].fileUrls[0]=req.body.file
        // userTender[0].req.body.fileUrls = fileUrls;
        await userTender[0].save();
        // //console.log("done")
        return res.status(200).json({ message: 'Files have been uploaded.' });
    } catch (error) {
        console.error(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: "Too many files to upload." });
        }
        return res.status(500).json({ error: `Error when trying upload many files: ${error}` });
    }
});

module.exports = router;