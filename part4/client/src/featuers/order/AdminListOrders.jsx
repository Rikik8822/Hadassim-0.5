import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Stack, Pagination, Grid } from "@mui/material";
import { completeOrder, confirmOrderBySupplier, getAllOrders, getSupplierOrders, getTotalPages } from "./orderApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "./orderSlice";
import OrderItem from "./OrderItem";


/**
 * AdminListOrders Component
 * Displays a list of orders for admin with pagination and filtering options based on status.
 */
const AdminListOrders = () => {

  let dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  let limit = 6;

  let orders = useSelector(state => state.order.orders);

  /**
   * Fetch all orders based on the current status and page.
   */
  async function fetchAllOrders() {
    try {
      const res = await getAllOrders(status, currentPage, limit);
      console.log(res);
      dispatch(fetchOrders(res.data));

    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }

    /**
   * Change order status to "completed".
   */
  async function changeStatusToComplete(id) {
    try {
      let res = await completeOrder(id);
      console.log(res);
      fetchAllOrders();
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [status, currentPage]);

  useEffect(() => {
    async function fetchPages() {
      try {
        let res = await getTotalPages(limit);
        setTotalPages(res.data)
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchPages();
  }, [])

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Orders in the Grocery
      </Typography>

      {/* Status Buttons */}
      <Box minHeight="64px" mb={3}>
        <Stack direction="row" spacing={2} mb={3}>
          {["pending", "in_process", "completed", "all"].map((s) => (
            <Button
              key={s}
              variant={status === s ? "contained" : "outlined"}
              onClick={() => { setStatus(s), setCurrentPage(1) }}

            >
              {s}
            </Button>
          ))}
        </Stack>
      </Box>

      <Box
        minHeight="70vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Grid container spacing={3} justifyContent="center" alignItems="stretch" >
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : orders.length > 0 ? (

            orders.map((order) => (
              <Grid item xs={12} md={4} key={order._id} sx={{ display: "flex" }} >
                <OrderItem order={order} changeStatusToComplete={changeStatusToComplete} isAdmin={true} />
              </Grid>
            ))
          ) : <Typography>No orders in this category</Typography>}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={totalPages} color="primary" page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminListOrders;
