const express = require('express');
const router = express.Router();
const Tender = require('../models/tender');
// const Developer = require('../models/usertender');
const usertender = require('../models/usertender');

// Get developers who bid for a specific tender and total developers
router.post('/tender/graph', async (req, res) => {
    try {
        const tender = await Tender.findById(req.body.id)

        ////console.log(tender);
        if (tender) {
            const developersWhoBid = await usertender.find({ 'name': tender._id });
            const totalDevelopers = await usertender.countDocuments();
            ////console.log(developersWhoBid.length,'developersWhoBid')

            const graphData = {
                    totalDevelopers: totalDevelopers,
                    developersWhoBid: developersWhoBid.length
                };
                res.status(200).json({graphData});
                return
        }
        // const developersWhoBid = await Developer.find({ '_id': { $in: tender.name } });
        // const usersWhoBid = await Developer.find({ '_id': { $in: userTenders.map(ut => ut.usertender) } });
        // ////console.log(usersWhoBid,'developersWhoBid')
        // const totalDevelopers = await Developer.countDocuments();

        // const graphData = {
        //     totalDevelopers: totalDevelopers,
        //     developersWhoBid: developersWhoBid.length
        // };

        // res.json(graphData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;