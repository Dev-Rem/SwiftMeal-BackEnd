import mongoose from 'mongoose';
const { Schema } = mongoose;

const AddressSchema = new Schema({
    
    streetNumber: { type: String, required: true, trim: true },
    streetName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: Number, required: true, trim: true },
    country: { type: String, required: true, trim: true },
},
{
  timestamps: true
})

module.exports = mongoose.model('Address', AddressSchema);