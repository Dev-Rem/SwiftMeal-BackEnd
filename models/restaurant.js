import mongoose from 'mongoose';
import { isEmail } from 'validator';
const { Schema } = mongoose;

const RestaurantSchema = new Schema({
    address: { type: Schema.Types.ObjectId, ref: 'Address'},
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [ isEmail, 'invalid email' ],
    },
    menus: [{ type: Schema.Types.ObjectId, ref: 'Menu'}],

},
{
  timestamps: true
});

module.exports = mongoose.model('Restaurant', RestaurantSchema );