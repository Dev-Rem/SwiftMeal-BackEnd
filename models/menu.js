import mongoose from 'mongoose';
const { Schema } = mongoose;

const MenuSchema = new Schema({
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant'},
    name: { type: String, required: true, trim: true },
},
{
  timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema );