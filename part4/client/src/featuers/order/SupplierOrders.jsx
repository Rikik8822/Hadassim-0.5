import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Grid, } from "@mui/material";

import { confirmOrderBySupplier, getSupplierOrders } from "./orderApi";
import OrderItem from "./OrderItem";
import Swal from "sweetalert2";

/**
 * Fetches and displays a list of orders for the supplier. Allows the supplier to confirm orders.
 */
const SupplierOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCurrentSupplierOrders() {
    try {
      const res = await getSupplierOrders();
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        title: err.response.data.message,
        icon: "error",
        draggable: true
      });
    }
  }

  async function changeStatusToProcess(id) {

    try {
      let res = await confirmOrderBySupplier(id);
      console.log(res.data);

      Swal.fire({
        title: "Order confirmed successfully",
        icon: "success",
        draggable: true
      });
      fetchCurrentSupplierOrders();
    }
    catch (err) {
      Swal.fire({
        title: err.response.data.message,
        icon: "error",
        draggable: true
      });

    }
  }
  useEffect(() => {
    fetchCurrentSupplierOrders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch" >
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No orders found for this supplier
            </Typography>
          </Box>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} md={4} key={order._id} sx={{ display: "flex" }} >
              <OrderItem key={order._id} order={order} changeStatusToProcess={changeStatusToProcess} isAdmin={false} />
            </Grid>))
        )}</Grid>
    </Box>
  );
};

export default SupplierOrders;