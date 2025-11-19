import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    productImage: {
      type: String,
      required: false,
    },  

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, 
    },

    detailsContent: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
