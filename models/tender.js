const mongoose = require('mongoose')

const tenderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    title: {
        type: String,
        required:false,
        trim: true
    },
    State: {
        type: String,
        required:false
    },
    property_history: {
        type:String,
        required:false
    },
    scheme:{
        type:String,
        required:false
    },
    Emd: {
        type: Number,
        required:false,
        default: 0.0
    },
    description: {
        type: String,
        required:false
    },
    tender_value: {
        type: String,
        default: 0,
        required:false
    },
    gross_area:{
        type:Number,
        required:false
    },
    doc: {
        type: String,
        ref: 'Document',
        required:false
    },
    docs: [{
        name: String,
        url: String,
        // required:false
    }],
    ward: {
        type: String,
        required:false
    },
    cts_number: {
        type: String,
        required:false
    },
    // role: {
    //     type: String,
    //     required: true,
    //     enum: {
    //         values: [
    //             'user',
    //             'seller',
    //             'admin'
    //         ],
    //         message: '{VALUE} is not supported'
    //     }
    // },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required:false
    },
    startDate: {
        type: String,
        required:false
        // required: true
    },
    endDate: {
        type: String,
        required:false
        // required: true
    },
    isDisabled:{
        type:Boolean,
        default:false
    }
})

// tenderSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Tenders', tenderSchema)