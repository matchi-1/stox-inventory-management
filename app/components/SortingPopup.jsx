import React, { useState } from 'react';
import { IconButton, Popover, Box, Typography, MenuItem, Select } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

const SortingPopup = ({ currentSort, setSort }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'sorting-popover' : undefined;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #cfcfcf',
      borderRadius: '8px', 
      padding: '2px',
      height: '40px',
      backgroundColor: 'white'
    }}>
      <IconButton onClick={handleClick}
      sx={{
          '& .MuiSvgIcon-root': {
            fontSize: 20, 
            marginRight: '6px',
          },
          display: 'flex',
          alignItems: 'center',
        }}>
        <SortIcon />
        <Typography variant="body2">Sort</Typography>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ padding: 2, width: 250 }}>
        <Typography sx = {{marginBottom:"15px", fontWeight:"bold", fontFamily: '"Montserrat", sans-serif',}}>SORT BY</Typography>
          <Select
            value={currentSort}
            onChange={handleSortChange}
            fullWidth
          >
            <MenuItem value="item_name">Item Name</MenuItem>
            <MenuItem value="purchase_date">Purchase Date</MenuItem>
            <MenuItem value="total_value">Total Value</MenuItem>
            <MenuItem value="item_id">Item ID</MenuItem>
          </Select>
        </Box>
      </Popover>
    </Box>
  );
};

export default SortingPopup;
