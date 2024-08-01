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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleClick}>
        <TuneIcon  />
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
        <Box sx={{ padding: 2, width: 300 }}>
          <Typography variant="h6">Filters</Typography>
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

            <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outlined" onClick={clearFilters} sx={{ marginLeft: 1 }}>
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterPopup;
