import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import RegistrationForm from './RegistrationForm';
import OrderForm from './OrderForm';

function App() {
  const [userId, setUserId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistrationSuccess = (userId) => {
    setUserId(userId);
    setIsRegistered(true);
  };

  const handleOrderSuccess = () => {
    setIsRegistered(false); // Enable the RegistrationForm after successful order
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} mt={15}> {/* Add additional top margin */}
        {isRegistered ? (
          <OrderForm userId={userId} handleOrderSuccess={handleOrderSuccess} />
        ) : (
          <RegistrationForm
            handleRegistrationSuccess={handleRegistrationSuccess}
            title="Register Yourself"
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
