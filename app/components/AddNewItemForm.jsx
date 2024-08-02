// AddNewItemForm.jsx
import React from 'react';
import { Box, Collapse, Grid, TextField, MenuItem, Typography, Button } from '@mui/material';

const AddNewItemForm = ({
  CATEGORIES,
  openForm,
  itemName,
  setItemName,
  category,
  setCategory,
  qty,
  setQty,
  unitPrice,
  setUnitPrice,
  supplier,
  setSupplier,
  purchaseDate,
  setPurchaseDate,
  addItem,
  handleClose
}) => {
  return (
    <Box >
      <Collapse in={openForm}>
        <Box sx={{
          marginTop: 5,
          border: '1px solid grey',
          borderRadius: '15px', 
          backgroundColor: "white",
          padding: '30px'
          }}>
          <Typography sx = {{marginBottom:2, fontWeight:"bold", fontFamily: '"Montserrat", sans-serif',}}>ADD NEW ITEM</Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={2.5}>
              <TextField
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                label="Category"
                select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={1.5}>
                <TextField
                    label="Quantity"
                    type="number"
                    value={qty}
                    onChange={(e) => {
                    // Use a regex to allow only integer values
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                        setQty(value);
                    }
                    }}
                    inputProps={{ min: 0, step: 1 }}
                    fullWidth
                />
            </Grid>

            <Grid item xs={12} sm={1.5}>
              <TextField
                label="Unit Price"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                inputProps={{ min: 0, step: 'any' }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <TextField
                label="Total Value"
                type="number"
                value={(parseFloat(unitPrice) * parseInt(qty)).toFixed(2) || 0}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Purchase Date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={1.5}>
              <Button
                onClick={handleClose}
                fullWidth
                sx={{
                  height:"30px",
                  border: "1px solid black",
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  textTransform: 'uppercase',
                  color: "black",
                  '&:hover': {
                    backgroundColor: '#ebebeb', 
                  }
                }}
              >
                Remove All
              </Button>
            </Grid>

            <Grid item xs={12} sm={1.5}>
              <Button
                onClick={addItem}
                fullWidth
                sx={{
                  height:"30px",
                  backgroundColor: 'black',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  textTransform: 'uppercase',
                  color: "white",
                  '&:hover': {
                    backgroundColor: '#212121', 
                  }
                }}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddNewItemForm;
