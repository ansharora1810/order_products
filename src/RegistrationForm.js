import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import axios from 'axios';

function RegistrationForm({ handleRegistrationSuccess, title }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true); // Start the loader
      const response = await axios.post(
        'https://h6ojqasxe5.execute-api.us-west-2.amazonaws.com/Prod/register-user',
        {
          name,
          email,
          phone,
        }
      );

      const { user_id } = response.data;
      localStorage.setItem('user_id', user_id);

      // Show the confirmation dialog
      setOpenDialog(true);
      setIsLoading(false); // Stop the loader
    } catch (error) {
      console.error(error);
      // Handle registration error here
      setIsLoading(false); // Stop the loader in case of an error
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Inform the parent component about successful registration
    handleRegistrationSuccess(localStorage.getItem('user_id'));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={2}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleRegister}>
        {isLoading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thank you for registering!!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            We have sent a subscription request to your provided email address. Please
            confirm your subscription to proceed.
          </Typography>
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

export default RegistrationForm;
