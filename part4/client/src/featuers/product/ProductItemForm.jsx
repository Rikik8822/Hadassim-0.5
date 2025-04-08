import { Box, IconButton, TextField } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

/**
 * ProductItemForm Component
 * A form that allows the user to add or edit a product item with name, price, and minimum quantity.
 */
const ProductItemForm = ({ register, item, remove, index }) => {
  return (
    <Box key={item.id} border={1} borderRadius={2} borderColor="grey.300" p={2} mb={2} sx={{ width: "20vw" }}>
      <TextField
        {...register(`merchandise.${index}.productName`)}
        label="Product Name"
        variant="filled"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        {...register(`merchandise.${index}.price`)}
        type="number"
        label="Price"
        variant="filled"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        {...register(`merchandise.${index}.minQty`)}
        type="number"
        label="Minimum Quantity"
        variant="filled"
        fullWidth
        required
        margin="normal"
      />
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={() => remove(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProductItemForm;
