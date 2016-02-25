import mongoose from 'mongoose';

export const bar = mongoose.model('bar', {
  name: String,
  beers: Array
});