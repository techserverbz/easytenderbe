const { S3 } = require('@aws-sdk/client-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const Tender = require('../models/tender');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// const s3Client = new S3Client({
//     region: 'us-east-1 ',
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   apiVersion: '2006-03-01'
// });

// const s3 = new S3({ client: s3Client });
// ////console.log(s3,'s3');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // region: 'YOUR_AWS_REGION'
    apiVersion: '2006-03-01' // Add this line
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dcpr',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString()); // Use a unique key for each file
        }
    })
});

exports.createTender = async (req, res) => {
    try {
        // const tender = new Tender({
        //     title:req.body.title,
        //     State:req.body.State,
        //     property_history:req.body.property_history,
        //     scheme:req.body.scheme,
        //     Emd:req.body.Emd,
        //     description:req.body.description,
        //     tender_value:req.body.tender_value,
        //     gross_area:req.body.gross_area,   
        //     doc:req.body.doc,
        //     ward:req.body.ward,
        //     cts_number:req.body.cts_number,
        //     user:req.user.id ,
        //     endDate:req.body.endDate,
        //     document:req.body.document,
        // });

        try {
            // req.body.user = req.user.id
            console.log(req.body)
            const tender = await Tender.create(req.body);
            // await tender.save();

            // const sendEmail = require('./sendEmail'); // adjust the path according to your project structure

            // const createTender = async (req, res) => {
            //     try {
            //         req.body.user = req.user.id
            //         const tender = await Tender.create(req.body);
            //         await tender.save();

            //         // prepare email data

            //         return res.status(200).json({ message: "'saved in database'", data: tender });
            //     } catch (err) {
            //         console.error(err);
            //         res.status(500).send('Failed to saved in database');
            //     }
            // }

            return res.status(200).json({ message: "'saved in database'", data: tender });
        } catch (err) {
            console.error(err);
            res.status(500).send('Failed to saved in database');
        }
    } catch (err) {
        ////console.log(err);
    }
}
exports.getTender = async (req, res) => {
    try {
        const tenders = await Tender.find();
        ////console.log(tenders, 'ten')
        return res.status(200).json({
            message: "Tender fetch",
            count: tenders.length,
            tenders
        });
    } catch (err) {
        ////console.log(err);
    }
}

// exports.updateTender = async (req, res) => {
//     ////console.log(req.body, 'req.body')
//     try {
//         const { name, amd, description, Value, doc, role, startDate, endDate, user, seller, admin } = req.body;

//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: doc.name,
//             Body: doc.data
//         };

//         s3.upload(params, async function (err, data) {
//             if (err) {
//                 throw err;
//             }

//             const tender = await Tender.findByIdAndUpdate(req.body.id, {
//                 name,
//                 amd,
//                 description,
//                 Value,
//                 doc: data.Location,
//                 role,
//                 user,
//                 seller,
//                 admin
//             }, { new: true });

//             if (!tender) {
//                 return res.status(400).json({ message: "Tender not available" });
//             }

//             res.status(200).json(tender);
//         });
//     } catch (err) {
//         ////console.log(err);
//     }
// }
// exports.updateTender = async (req, res) => {
//     ////console.log(req.body, 'req.body')
//     try {
//         const { name, amd, description, Value, doc, role, startDate, endDate, user, seller, admin } = req.body;

//         // Ensure name is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(name)) {
//             return res.status(400).json({ message: "Invalid ObjectId for name" });
//         }

//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: doc.name,
//             Body: doc.data
//         };

//         s3.upload(params, async function (err, data) {
//             if (err) {
//                 throw err;
//             }

//             const tender = await Tender.findByIdAndUpdate(req.body.id, {
//                 name,
//                 amd,
//                 description,
//                 Value,
//                 doc: data.Location,
//                 role,
//                 user,
//                 seller,
//                 admin
//             }, { new: true });

//             if (!tender) {
//                 return res.status(400).json({ message: "Tender not available" });
//             }

//             res.status(200).json(tender);
//         });
//     } catch (err) {
//         ////console.log(err);
//     }
// }

exports.updateTender = async (req, res) => {
    try {
        const { _id, selectedValues, ...updateData } = req.body;

        // Ensure _id is a valid ObjectId
        // if (!mongoose.Types.ObjectId.isValid(_id)) {
        //     return res.status(400).json({ message: "Invalid ObjectId" });
        // }
        console.log(req.body)
        updateData.docs = selectedValues
        const tender = await Tender.findByIdAndUpdate(_id, updateData, { new: true });
        // console.log(updateData)
        if (!tender) {
            return res.status(400).json({ message: "Tender not available" });
        }

        res.status(200).json(tender);
    } catch (err) {
        ////console.log(err);
    }
}

exports.getTenderById = async (req, res) => {
    try {
        const tender = await Tender.findById(req.params.id);
        if (!tender) {
            return res.status(400).json({
                message: "Tender not found",
            });
        }
        res.status(200).json({
            message: "Tender fetched successfully",
            tender
        });
    } catch (err) {
        ////console.log(err);
    }
}

exports.deleteTender = async (req, res) => {
    try {
        console.log(req.params.id)
        const tender = await Tender.findById(req.params.id);

        const tender1 = await Tender.findByIdAndUpdate(req.params.id,{isDisabled: !tender.isDisabled}, { new: true });
        if (!tender1) {
            return res.status(400).json({
                message: "Failed to fetch or delete tender",
            });
        }
        res.status(200).json({
            message: "Tender deleted successfully",
        });
    } catch (err) {
        ////console.log(err);
    }
}


