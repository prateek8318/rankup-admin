import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const CircularSize: React.FC = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <CircularProgress size="20px"   />
    
    </Stack>
  );
};

export default CircularSize;
