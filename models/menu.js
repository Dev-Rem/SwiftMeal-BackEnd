import mongoose from 'mongoose';
const { Schema } = mongoose;

const MenuSchema = new Schema({
    name: { type: String, required: true, trim: true },
    sections: [{ type: Schema.Types.ObjectId, ref: 'Section'}]
},
{
  timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema );