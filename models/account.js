import mongoose from 'mongoose';
var mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [ isEmail, 'invalid email' ],
    },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address'},
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order'}]

},
{
  timestamps: true
});

EmployeeSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});


module.exports = mongoose.model('Employee', EmployeeSchema);