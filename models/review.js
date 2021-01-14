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
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// export model
module.exports = mongoose.model('Review', reviewSchema);