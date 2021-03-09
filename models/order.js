const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = Schema({
    account_id: { type: Schema.Types.ObjectId, ref: 'Account'},
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant'},
    data: { type: Date, required: true},
    status: { type: String, required: true, trim: true },
    time: { type : Date, default: Date.now },
},
{
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);