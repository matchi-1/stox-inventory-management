// components/FilterPopup.js

import React, { useState } from 'react';
import { Button, IconButton, Popover, Box, Typography, TextField, MenuItem } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

const FilterPopup = ({ CATEGORIES, applyFilters, clearFilters, filters, handleFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #cfcfcf',
        borderRadius: '8px', 
        padding: '2px',
        height: '40px',
        backgroundColor: 'white'
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: 20,
            marginRight: '6px', 
          },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TuneIcon />
        <Typography variant="body2">Filter</Typography>
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
        <Box sx={{ padding: 3, width: 300, border: '1px solid #cfcfcf', boxShadow:"none" }}>
          <Typography sx = {{marginBottom:"15px", fontWeight:"bold", fontFamily: '"Montserrat", sans-serif',}}>FILTERS</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Category"
              name="category"
              select
              value={filters.category}
              onChange={handleFilterChange}
              fullWidth 
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              name="supplier"
              label="Supplier"
              value={filters.supplier}
              onChange={handleFilterChange}
              fullWidth
            />

            <TextField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={filters.purchaseDate}
              onChange={handleFilterChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Min Total Value"
                name="totalValueMin"
                type="number"
                value={filters.totalValueMin}
                onChange={handleFilterChange}
                inputProps={{ min: 0, step: 1 }}
                fullWidth
              />
              <TextField
                label="Max Total Value"
                name="totalValueMax"
                type="number"
                value={filters.totalValueMax}
                onChange={handleFilterChange}
                inputProps={{ min: 0, step: 1 }}
                fullWidth
              />
            </Box>

            <Box sx={{ marginTop: 2, display: 'flex', gap: 4, justifyContent: "space-around"}}>
              <Button onClick={applyFilters} sx={{
                  width: "100px",
                  height:"35px",
                  backgroundColor: 'black',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  textTransform: 'uppercase',
                  color: "white",
                  '&:hover': {
                    backgroundColor: '#212121', 
                  }
                }}>
                Apply
              </Button>
              <Button onClick={clearFilters} sx={{
                  width: "100px",
                  height:"35px",
                  border: "1px solid black",
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  textTransform: 'uppercase',
                  color: "black",
                  '&:hover': {
                    backgroundColor: '#ebebeb', 
                  }
                }}>
                Clear
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterPopup;
