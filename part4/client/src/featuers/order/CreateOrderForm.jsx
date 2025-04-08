import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { serverGetSuppliers } from "../user/userApi";
import { createOrder } from "../order/orderApi";
import SupplierCard from "../../components/SupplierCard";
import InstructionsDialog from "../../components/InstructionsDialog";

/**
 * Manages supplier selection, product addition, and order submission with total price calculation.
 */
const CreateOrderForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await serverGetSuppliers();
        setSuppliers(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error loading suppliers",
          icon: "error",
          draggable: true
        });
      }
    };
    fetchSuppliers();
  }, []);

  const calculateTotalPrice = (products) => {
    const total = products.reduce(
      (acc, product) => acc + product.qty * product.price,
      0
    );
    setTotalPrice(total);
  };

  const handleSupplierChange = (supplier) => {
    setSelectedSupplier(supplier);
    setOrderProducts([]);
    setTotalPrice(0);
  };

  const addProductToOrder = (product) => {
    const exists = orderProducts.find((p) => p._id === product._id);
    if (exists) return;

    const newOrder = [...orderProducts, product];
    setOrderProducts(newOrder);
    calculateTotalPrice(newOrder);
  };

  const updateProductQty = (productId, qty) => {
    const updated = orderProducts.map((p) =>
      p._id === productId ? { ...p, qty } : p
    );
    setOrderProducts(updated);
    calculateTotalPrice(updated);
  };

  const onSubmit = async () => {
    if (orderProducts.length === 0) {
      Swal.fire({
        title: "Please add products to the order",
        icon: "error",
        draggable: true
      });
      return;
    }

    const orderData = {
      supplier: selectedSupplier._id,
      totalPrice,
      products: orderProducts.map((p) => ({
        productName: p.productName,
        price: p.price,
        qty: p.qty,
      })),
    };

    try {
      await createOrder(orderData);
      Swal.fire({
        title: "Order successfully placed!",
        icon: "success",
        draggable: true
      });
      reset();
      setOrderProducts([]);
      setTotalPrice(0);
    } catch (error) {
      Swal.fire({
        title: error.response?.data?.message || "Error in sending order",
        icon: "error",
      });
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={3} sx={{ marginTop: 20 }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ textTransform: "none" }}>
          Show Instructions for Order Creation
        </Button>
        <InstructionsDialog open={open} onClose={handleClose} />

        {suppliers.map((supplier) => (
          <SupplierCard
            key={supplier._id}
            supplier={supplier}
            selectedSupplier={selectedSupplier}
            onSupplierSelect={handleSupplierChange}
            orderProducts={orderProducts}
            addProductToOrder={addProductToOrder}
            updateProductQty={updateProductQty}
          />
        ))}
      </Box>

      {orderProducts.length > 0 && (
        <Typography variant="h6" fontWeight="bold">
          Total: {totalPrice} ₪
        </Typography>
      )}

      <Box display="flex" justifyContent="center" mt={3}>
        <Button type="submit" variant="contained" color="primary" disabled={orderProducts.length === 0} sx={{ textTransform: "none" }}>
          Submit Order
        </Button>
      </Box>
    </form>
  );
};

export default CreateOrderForm;

