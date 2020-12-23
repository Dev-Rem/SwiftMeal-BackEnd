import mongoose from 'mongoose';
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order'},
    total: { type: Number, required: true, },
    method: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },

},
{
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);