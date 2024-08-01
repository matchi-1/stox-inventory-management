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

  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState(inventory);
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
  
  useEffect(() => {
    const fetchAndInitialize = async () => {
      await updateInventory();
    };

    fetchAndInitialize();
  }, []); // Run once on mount
  
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

  
  const handleToggleForm = () => {
    setOpenForm(!openForm); // Toggle add item form visibility
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


  //function to add item
  const addItem = async () => {
    // Generate a unique item ID
    const uniqueID = await generateUniqueID();
    
    const totalValue = parseFloat(unitPrice) * parseInt(qty);
  
    const newItem = {
      item_id: uniqueID,
      item_name: itemName,
      category,
      qty: parseInt(qty),
      unit_price: parseFloat(unitPrice),
      total_value: parseFloat(totalValue),
      supplier,
      purchase_date: purchaseDate,
    };
  
    await setDoc(doc(firestore, "inventory", uniqueID), newItem);
    await updateInventory();
    handleClose();
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
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            STOX
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/dashboard" color="inherit" underline="none">
              Dashboard
            </Link>
            <Link href="/inventory" color="inherit" underline="none">
              Inventory
            </Link>
          </Box>
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

      <Box sx={{ padding: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
          <Typography variant="h4">
            Your Inventory
          </Typography>
          <Button variant="contained" onClick={handleToggleForm}>
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

        <FilterPopup
          CATEGORIES={CATEGORIES}
          filters={filters}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />


        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.item_id}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.qty.toFixed(2)}</TableCell>
                  <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell>${item.total_value.toFixed(2)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{new Date(item.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpen(item)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                value={parseFloat(qty).toFixed(2)}
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
              <Button variant="contained" onClick={editItem}>
                Update Item
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
