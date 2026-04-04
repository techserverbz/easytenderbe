const User = require('../models/user');
const Tender = require('../models/tender');
const usertender = require('../models/usertender');


const getUserTenders = async (req, res) => {
    try {
        // Get the user from the request object (set by the auth middleware)
        const user = req.user;
        ////console.log(user, 'user')
        // Check if user's role is 'society'
        if (user.role === 'society') {
            // Find all tenders created by the user
            const tenders = await Tender.find({ user: user._id });

            // Send the tenders in the response
            res.status(200).json({ data: tenders });

        }
        // Send the tenders in the response
        // res.status(200).json({ data: tenders });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};



const getSocietyTenders = async (req, res) => {
    try {
        // Step 1: Check if user's role is 'society'
        const user = req.user;
        if (user.role !== 'society') {
            return res.status(403).json({ message: 'Access denied. User is not a society.' });
        }

        // Step 2: Check if the user has created any tenders
        const tenderId = req.body.tenderId;
        const tender = await Tender.findOne({ _id: tenderId, user: user._id });
        if (!tender) {
            return res.status(404).json({ message: 'No tender found for this society with the given ID.' });
        }

        ////console.log(tender, 'tenders')
        // Step 3: Get all UserTenders that belong to the tenders created by the user
        // const tenderIds = tender.map(tender => tender._id);
        const userTenders = await usertender.find({ name: tenderId }).populate('usertender');

        // Send the UserTenders in the response
        res.status(200).json({ data: userTenders });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getUserTenders,
    getSocietyTenders
};