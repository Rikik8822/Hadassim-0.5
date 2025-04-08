import { InventoryModel } from "../models/inventory.js";
import { UserModel } from "../models/user.js";
import { OrderModel } from "../models/order.js";

/**
 * Retrieves all inventory items from the database.
 */

export const getInventory = async (req, res) => {
  try {
    let inventory = await InventoryModel.find()
    res.json(inventory);
  }
  catch (err) {
    return res.status(500).json({ message: err.message, title: "An error in getting inventory" });
  }
}

/**
 * Handles purchases from the register, updating inventory and placing orders if stock is low.
 * Checks if the stock is below the desired quantity and places an order with the cheapest supplier.
 */
export const handlePurchaseFromRegister = async (req, res) => {
  const soldItems = req.body;
  const results = [];

  try {
    for (const [itemName, quantitySold] of Object.entries(soldItems)) {
      const item = await InventoryModel.findOne({ productName: itemName });

      if (!item) {
        results.push({
          itemName,
          status: "not_found",
          message: `Sorry, the product "${itemName}" is currently out of stock.`,
        });
        continue;
      }

      item.currentQuantity -= quantitySold;
      await item.save();


      if (item.currentQuantity < item.minDesiredQuantity) {
        const suppliers = await UserModel.find({ role: "supplier" }).populate("merchandise");


        if (!suppliers.length) {
          results.push({
            itemName,
            status: "no_supplier",
            message: `Sorry, no suppliers currently offer the product "${itemName}".`,
          });
          continue;
        }

        let cheapestSupplier = null;
        let cheapestPrice = Infinity;

        suppliers.forEach((supplier) => {
          supplier = supplier.toObject();
          const product = supplier.merchandise.find((p) => p.productName === itemName);
          if (product && product.price < cheapestPrice) {
            cheapestPrice = product.price;
            cheapestSupplier = supplier;
          }
        });

        if (!cheapestSupplier) {
          results.push({
            itemName,
            status: "no_price_found",
            message: `There is currently no price offer available for the product "${itemName}".`,
          });
          continue;
        }

        try {
          const order = await OrderModel.create({
            supplier: cheapestSupplier._id,

            products: [
              {
                productName: itemName,
                qty: item.minDesiredQuantity - item.currentQuantity,
                price: cheapestPrice,
              },
            ],
            status: "pending",
          });


          results.push({
            itemName,
            status: "success",
            message: `The product was automatically ordered from the supplier "${cheapestSupplier.companyName}".`,
            orderId: order._id,
          });
        } catch (orderError) {
          results.push({
            itemName,
            status: "order_failed",
            message: `There was an error while creating the order: ${orderError.message}`,
          });
        }
      } else {
        results.push({
          itemName,
          status: "no_action_needed",
          message: "The quantity is sufficient. No order was placed."
        });
      }
    }

    res.json({ message: "Inventory update completed", results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
