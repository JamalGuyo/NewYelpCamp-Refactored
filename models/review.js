const mongoose = require('mongoose');
const {Schema} = mongoose;
// review schema
const reviewSchema = new Schema({
    rating:{
        type: Number,
        required: true
    },
    body:{
        type: String,
        required: true
    }
})

// export model
module.exports = mongoose.model('Review', reviewSchema);