import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';

/**
 * InstructionsDialog displays a modal with step-by-step instructions for adding an order.
 */
const InstructionsDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Instructions for adding an order</DialogTitle>
      <DialogContent >
        <Typography color="textSecondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
          To add an order, follow these steps:
          {'\n'}1. <strong>Select a supplier</strong> from the list.
          {'\n'}2. <strong>Click "Add to Order"</strong> next to the desired product.
          {'\n'}3. <strong>Update the product quantity</strong> as needed.
          {'\n'}4. Finally, click <strong>"Submit Order"</strong> at the bottom of the screen.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionsDialog;
