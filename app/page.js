"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Grid,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Link,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FilterPopup from './components/FilterPopup.jsx';
import AddNewItemForm from './components/AddNewItemForm.jsx';
import SearchBar from './components/SearchBar';
import SortingPopup from './components/SortingPopup';
import { Height } from "@mui/icons-material";

export default function Home() {
  const [openForm, setOpenForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemID, setItemID] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [qty, setQty] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const cellStyles = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '12px',
    padding: '10px',
    textAlign: 'left',
  };
  
  const headCellStyles = {
    ...cellStyles,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  };

  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [sort, setSort] = useState('item_name');
  const [filters, setFilters] = useState({
    category: "",
    supplier: "",
    purchaseDate: "",
    totalValueMin: "",
    totalValueMax: "",
  });
  
  const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Furniture',
    'Books',
    'Kids',
    'Sports',
    'Kitchen',
    'Miscellaneous'
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the data for the current page
  const displayedRows = filteredInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  
  useEffect(() => {
    const fetchAndInitialize = async () => {
      await updateInventory();
    };

    fetchAndInitialize();
  }, []); // Run once on mount

  
  // Fetch inventory data
  const updateInventory = async () => {
    const snapshot = collection(firestore, 'inventory');
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filteredInventory with full inventory
  };
  
  // Function to sort table
  const sortInventory = (items) => {
    let sortedInventory = [...items];
    switch (sort) {
      case 'item_name':
        sortedInventory.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case 'purchase_date':
        sortedInventory.sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
        break;
      case 'total_value':
        sortedInventory.sort((a, b) => a.total_value - b.total_value);
        break;
      case 'item_id':
        sortedInventory.sort((a, b) => a.item_id.localeCompare(b.item_id));
        break;
      default:
        break;
    }
    return sortedInventory;
  };

  useEffect(() => {
    if (inventory.length > 0) {
      const sorted = sortInventory(inventory);
      setFilteredInventory(sorted);
    }
  }, [inventory, sort]); // Depend on both inventory and sort


  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Function to apply filters
  const applyFilters = () => {
    const filtered = inventory.filter((item) => {
      const isCategoryMatch = filters.category ? item.category === filters.category : true;
      const isSupplierMatch = filters.supplier ? item.supplier === filters.supplier : true;
      const isDateMatch = filters.purchaseDate ? new Date(item.purchase_date).toLocaleDateString() === filters.purchaseDate : true;
      const isTotalValueInRange =
        (filters.totalValueMin === '' || item.total_value >= parseFloat(filters.totalValueMin)) &&
        (filters.totalValueMax === '' || item.total_value <= parseFloat(filters.totalValueMax));

      return isCategoryMatch && isSupplierMatch && isDateMatch && isTotalValueInRange;
    });

    setFilteredInventory(filtered);
    console.log('Filtered inventory:', filtered); // Log the filtered inventory
  };
  
  
  // function to clear filters
  const clearFilters = () => {
    // Reset filter values
    setFilters({
      category: '',
      supplier: '',
      purchaseDate: '',
      totalValueMin: '',
      totalValueMax: ''
    });
    
    // Reset filtered inventory to original inventory
    setFilteredInventory(inventory);
  };

  // Toggle add item form visibility
  const handleToggleForm = () => {
    setOpenForm(!openForm);
  };


  //function to generate unique ID
  const generateUniqueID = async () => {
    const generateID = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let id = '';
  
      // Generate the first 3 letters
      for (let i = 0; i < 3; i++) {
        id += letters.charAt(Math.floor(Math.random() * letters.length));
      }
  
      // Generate the next 4 numbers
      for (let i = 0; i < 4; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
  
      return id;
    };
  
    let id = generateID();
    let itemSnap = await getDoc(doc(firestore, "inventory", id));
  
    // Check for uniqueness
    while (itemSnap.exists()) {
      id = generateID();
      itemSnap = await getDoc(doc(firestore, "inventory", id));
    }
  
    return id;
  };


  // Function to add an item
  const addItem = async () => {
    // Validation checks
    if (!itemName || !category || !qty || !unitPrice || !supplier || !purchaseDate) {
      // You can use an alert or show an error message to the user
      alert("Please fill out all fields.");
      return;
    }
    
    // Ensure qty and unitPrice are valid numbers
    const quantity = parseInt(qty);
    const price = parseFloat(unitPrice);
    if (isNaN(quantity) || isNaN(price)) {
      alert("Quantity and Unit Price must be valid numbers.");
      return;
    }
    
    // Generate a unique item ID
    const uniqueID = await generateUniqueID();

    // Calculate total value
    const totalValue = price * quantity;

    // Create new item object
    const newItem = {
      item_id: uniqueID,
      item_name: itemName,
      category,
      qty: quantity,
      unit_price: price,
      total_value: totalValue,
      supplier,
      purchase_date: purchaseDate,
    };

    try {
      // Add new item to the Firestore
      await setDoc(doc(firestore, "inventory", uniqueID), newItem);
      // Update inventory list
      await updateInventory();
      // Close the form or modal
      handleClose();
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error adding item: ", error);
      alert("An error occurred while adding the item. Please try again.");
    }
  };

  
  
  // function to edit an item
  const editItem = async () => {
    const totalValue = parseFloat(unitPrice) * parseInt(qty);
  
    const item = {
      item_id: itemID,
      item_name: itemName,
      category,
      qty: parseInt(qty),
      unit_price: parseFloat(unitPrice),
      total_value: totalValue,
      supplier,
      purchase_date: purchaseDate,
    };
  
    await setDoc(doc(firestore, "inventory", selectedItem.id), item);
    await updateInventory();
    handleClose();
  };
  

  const removeItem = async (id) => {
    await deleteDoc(doc(firestore, "inventory", id));
    await updateInventory();
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      setSelectedItem(item);
      setItemID(item.item_id);
      setItemName(item.item_name);
      setCategory(item.category);
      setQty(item.qty);
      setUnitPrice(item.unit_price);
      setTotalValue(item.total_value);
      setSupplier(item.supplier);
      setPurchaseDate(item.purchase_date);
    } else {
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItemID("");
    setItemName("");
    setCategory("");
    setQty("");
    setUnitPrice("");
    setTotalValue("");
    setSupplier("");
    setPurchaseDate("");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box >
      <AppBar position="static"
              sx={{ backgroundColor: "black",
                    boxShadow: 'none'
              }}>
        <Toolbar>
          <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontFamily: '"Montserrat", sans-serif',
                letterSpacing: "2px"
              }}
            >
            STOX
          </Typography>

          
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 5, backgroundColor: "#f7f7f7"}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
          <Typography variant="h4" sx={{ 
                flexGrow: 1, 
                fontFamily: '"Montserrat", sans-serif',
                textTransform: "uppercase"
                }}>
            Inventory
          </Typography>
          <Button
            onClick={handleToggleForm}
            sx={{
              backgroundColor: 'black',
              borderRadius: '0px',
              padding: '10px 20px',
              fontFamily: "'Montserrat', sans-serif",
              textTransform: 'uppercase',
              fontSize: "12px",
              color: "white",
              '&:hover': {
                backgroundColor: '#212121', 
              }
            }}
          >
            {openForm ? 'Hide Form' : 'Add New Item'}
          </Button>

        </Box>

        <AddNewItemForm
          CATEGORIES={CATEGORIES}
          openForm={openForm}
          itemName={itemName}
          setItemName={setItemName}
          category={category}
          setCategory={setCategory}
          qty={qty}
          setQty={setQty}
          unitPrice={unitPrice}
          setUnitPrice={setUnitPrice}
          supplier={supplier}
          setSupplier={setSupplier}
          purchaseDate={purchaseDate}
          setPurchaseDate={setPurchaseDate}
          addItem={addItem}
          handleClose={handleClose}
        />

      
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' , marginTop: 4, gap:"50px"}}>
          <SearchBar
            inventory={inventory}
            setFilteredInventory={setFilteredInventory}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <SortingPopup currentSort={sort} setSort={setSort} />
            <FilterPopup
              CATEGORIES={CATEGORIES}
              filters={filters}
              handleFilterChange={handleFilterChange}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          </Box>
        </Box>

        
        
        <TableContainer component={Paper} sx={{ marginTop: 3, padding: "8px 20px", border: "2px solid white" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellStyles}>Item ID</TableCell>
                <TableCell sx={headCellStyles}>Item Name</TableCell>
                <TableCell sx={headCellStyles}>Category</TableCell>
                <TableCell sx={headCellStyles}>Quantity</TableCell>
                <TableCell sx={headCellStyles}>Unit Price</TableCell>
                <TableCell sx={headCellStyles}>Total Value</TableCell>
                <TableCell sx={headCellStyles}>Supplier</TableCell>
                <TableCell sx={headCellStyles}>Purchase Date</TableCell>
                <TableCell sx={headCellStyles}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={cellStyles}>{item.item_id}</TableCell>
                  <TableCell sx={cellStyles}>{item.item_name}</TableCell>
                  <TableCell sx={cellStyles}>{item.category}</TableCell>
                  <TableCell sx={cellStyles}>{item.qty}</TableCell>
                  <TableCell sx={cellStyles}>${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell sx={cellStyles}>${item.total_value.toFixed(2)}</TableCell>
                  <TableCell sx={cellStyles}>{item.supplier}</TableCell>
                  <TableCell sx={cellStyles}>{new Date(item.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="black" onClick={() => removeItem(item.id)}>
                      <DeleteIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                    <IconButton color="black" onClick={() => handleOpen(item)}>
                      <EditIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredInventory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Modal open={open} onClose={handleClose}>
          <Box sx={{ padding: 2, margin: 'auto', width: '400px', backgroundColor: 'white' }}>
            <Typography variant="h6">Edit Item</Typography>
            <Stack spacing={2} sx={{ marginTop: 2 }}>
              <TextField
                label="Item ID"
                value={itemID}
                InputProps={{
                  readOnly: true,
                }}
                onChange={(e) => setItemID(e.target.value)}
              />
              <TextField
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
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

              <TextField
                label="Quantity"
                type="number"
                value={parseFloat(qty)}
                onChange={(e) => setQty(e.target.value)}
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField
                label="Unit Price"
                type="number"
                value={parseFloat(unitPrice).toFixed(2)}
                onChange={(e) => setUnitPrice(e.target.value)}
                inputProps={{ min: 0, step: 'any' }}
              />
              <TextField
                label="Total Value"
                value={(parseFloat(unitPrice) * parseInt(qty)).toFixed(2)} 
                InputProps={{
                  readOnly: true, 
                }}
              />
              <TextField
                label="Supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <TextField
                label="Purchase Date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" onClick={editItem} sx={{
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
                Update Item
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
