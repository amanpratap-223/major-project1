const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?...", // Default URL
      set: (value) => {
        if (!value || typeof value !== "string" || value.trim() === "") {
          return "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?..."; // Default URL
        }
        return value;
      },
    }
  },
 // price: Number,
 price: { type: Number, required: true, default: 0 },

  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
