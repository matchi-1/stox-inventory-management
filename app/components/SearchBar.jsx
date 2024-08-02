// SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ inventory, setFilteredInventory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filterItems = () => {
      const filtered = inventory.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInventory(filtered);
    };

    filterItems();
  }, [searchQuery, inventory, setFilteredInventory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      sx={{
        width: '280px',
        maxWidth: '100%',
        backgroundColor: "white",
        borderRadius: '50px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px', 
          '& fieldset': {
            borderColor: 'grey', 
          },
        },
      }}
    >
      <TextField
        placeholder="Search by Item Name"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ fontSize: '18px', marginRight: '5px' }} /> 
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputLabel-root': {
            fontSize: '13px', 
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px', 
            '& input': {
              padding: '8px 12px', 
              fontSize: '14px',
              height: 'auto', 
              lineHeight: '1.5',
              boxSizing: 'border-box', 
            },
          },
          '& .MuiInputAdornment-root': {
            fontSize: '16px',
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
