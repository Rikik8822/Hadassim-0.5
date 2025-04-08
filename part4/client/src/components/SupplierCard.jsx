import React from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";


/**
 * SupplierCard Component
 * Displays a supplier's details and allows adding products to an order.
 */
const SupplierCard = ({
  supplier,
  selectedSupplier,
  onSupplierSelect,
  orderProducts,
  addProductToOrder,
  updateProductQty,
}) => {
  const isSelected = selectedSupplier?._id === supplier._id;

  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <Typography variant="h6">{supplier.companyName}</Typography>

      {supplier.merchandise.length > 0 ? (
        supplier.merchandise.map((product) => {
          const existing = orderProducts.find((p) => p._id === product._id);
          const qty = existing?.qty || product.minQty;

          return (
            <Box key={product._id} display="flex" alignItems="center" justifyContent="space-between" gap={2} my={1} >
              <Typography>
                {product.productName} - {product.price} ₪
              </Typography>

              {isSelected && (
                <TextField
                  label="Quantity"
                  type="number"
                  InputProps={{ inputProps: { min: product.minQty } }}
                  defaultValue={qty}
                  onChange={(e) => {
                    const newQty = Math.max(product.minQty, Number(e.target.value));
                    updateProductQty(product._id, newQty);
                  }}
                />
              )}

              <Button variant="outlined"
                onClick={() => addProductToOrder({ ...product, qty })}
                disabled={!isSelected || !!existing}
                sx={{ textTransform: "none" }}
              >
                Add to Order
              </Button>
            </Box>
          );
        })
      ) : (
        <Typography color="textSecondary">No products available.</Typography>
      )}

      <Button
        onClick={() => onSupplierSelect(supplier)}
        variant="contained"
        color="primary"
        disabled={isSelected}
        sx={{ mt: 2, textTransform: "none" }}
      >
        Select Supplier
      </Button>
    </Card>
  );
};

export default SupplierCard;
