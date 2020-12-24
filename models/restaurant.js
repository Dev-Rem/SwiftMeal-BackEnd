import mongoose from 'mongoose';
import { isEmail } from 'validator';
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
const { Schema } = mongoose;

const RestaurantSchema = new Schema({
    address_id: { type: Schema.Types.ObjectId, ref: 'Address'},
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [ isEmail, 'invalid email' ],
    },
},
{
  timestamps: true
});

RestaurantSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});


module.exports = mongoose.model('Restaurant', RestaurantSchema );