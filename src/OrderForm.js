import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

function OrderForm({ userId, handleOrderSuccess }) {
  const [orderItems, setOrderItems] = useState([{ product: '', quantity: '' }]);
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch products and their quantities
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://h6ojqasxe5.execute-api.us-west-2.amazonaws.com/Prod/get-products'
        );

        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const handleProductChange = (index, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index].product = value;
    setOrderItems(updatedItems);
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = value;
    setOrderItems(updatedItems);
  };

  const handlePlaceOrder = async () => {
    try {
      // Create the order details array
      const orderDetails = orderItems.map((item) => ({
        product_name: item.product,
        quantity: item.quantity,
      }));

      // Make an API call to place the order
      const response = await axios.post('https://h6ojqasxe5.execute-api.us-west-2.amazonaws.com/Prod/place-order', {
        user_id: userId,
        order_details: orderDetails,
      });

      if (response.status === 200) {
        // Show the order success dialog
        setOpenDialog(true);
      }
    } catch (error) {
      // Handle order placement error
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Clear order items after successful order
    setOrderItems([{ product: '', quantity: '' }]);
    // Inform the parent component about successful order
    handleOrderSuccess();
  };

  const handleClear = () => {
    setOrderItems([{ product: '', quantity: '' }]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" my={2}>
      <Typography variant="h5" gutterBottom>
        Place Your Order
      </Typography>
      {orderItems.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" my={1}>
          <Box sx={{ width: 200, maxWidth: '100%', marginRight: 10 }}>
            <Select
              value={item.product}
              onChange={(e) => handleProductChange(index, e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            >
              {products.map((product) => (
                <MenuItem key={product.product_name} value={product.product_name}>
                  {product.product_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ width: 100, maxWidth: '100%', marginRight: 10 }}>
            <Select
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              required
            >
              {[...Array(products.find((product) => product.product_name === item.product)?.quantity || 0).keys()].map(
                (value) => (
                  <MenuItem key={value + 1} value={value + 1}>
                    {value + 1}
                  </MenuItem>
                )
              )}
            </Select>
          </Box>
          {orderItems.length > 1 && (
            <Button variant="outlined" color="secondary" onClick={() => handleRemoveItem(index)}>
              Remove
            </Button>
          )}
        </Box>
      ))}
      <Box display="flex" alignItems="center" my={2}>
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
        <Box mx={2}> {/* Add the desired space between buttons */}
          <Button variant="contained" style={{ backgroundColor: 'grey', color: 'white' }} onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        disabled={!userId || orderItems.some((item) => !item.product || !item.quantity)}
        mt={2}
        sx={{ width: '200px', marginTop: '16px' }}
      >
        Place Order
      </Button>
      {/* Order Success Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Order Placed Successfully!!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Please check your email for order confirmation.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderForm;
