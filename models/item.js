import mongoose from 'mongoose';
const { Schema } = mongoose;

const ItemSchema = new Schema({
    food = { type: Schema.Types.ObjectId, ref: 'Food'},
    discount: { type: Number, required: false},
    quantity: { type: Number, required: false},
},
{
  timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);