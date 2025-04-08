import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
/**
 * Displays order details, including creation date, products, and status.
 */
const OrderItem = ({ order, changeStatusToComplete, isAdmin, changeStatusToProcess }) => {
  console.log(order);

  return (<>
    <Card sx={{ marginBottom: 3, height: '100%', width: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Creation Date: {new Date(order.createdAt).toLocaleString()}
          </Typography>

          <Button onClick={() => { isAdmin ? changeStatusToComplete(order._id) : changeStatusToProcess(order._id) }}
            variant="contained"
            color={order.status === "pending" ? "warning" : "info"}
            disabled={isAdmin ? order.status !== "in_process" : order.status !== "pending"}
            sx={{ textTransform: "none" }}
          >
            {order.status}
          </Button>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Products:
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.qty}</TableCell>
                <TableCell>{p.price} ₪</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>);
}

export default OrderItem;