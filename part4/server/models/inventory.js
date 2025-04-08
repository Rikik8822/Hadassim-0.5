import mongoose from "mongoose"


const inventorySchema = new mongoose.Schema({
  productName: String,
  price: Number,
  currentQuantity: { type: Number, required: true },
  minDesiredQuantity: { type: Number, required: true },
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const InventoryModel = mongoose.model('Invetory', inventorySchema);
