import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
    menu: { type: Schema.Types.ObjectId, ref: 'Menu'},
    foods: [{ type: Schema.Types.ObjectId, ref: 'Food'}],
},
{
  timestamps: true
});

module.exports = mongoose.model('Section', SectionSchema );