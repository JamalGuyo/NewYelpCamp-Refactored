const mongoose = require('mongoose');
const {Schema} = mongoose;
// review schema
const reviewSchema = new Schema({
    rating:{
        type: Number,
        min: 0,
        max: 5
    },
    body:{
        type: String,
        required: true
    }
})

// export model
module.exports = mongoose.model('Review', reviewSchema);