import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = Schema({
    data: { type: Date, required: true},
    status: { type: String, required: true, trim: true },
    time: { type : Date, default: Date.now },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item'}],

},
{
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);