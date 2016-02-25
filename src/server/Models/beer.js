import mongoose from 'mongoose';

export const beer = mongoose.model('beer', {
  name: String,
  bar: String,
  brewery: String,
  abv: String,
  rating: String,
  style: String,
  url: String,
  serving: String
});