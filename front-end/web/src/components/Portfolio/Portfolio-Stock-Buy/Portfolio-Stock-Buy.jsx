import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { stockData } from '../stocks';
import PortfolioAlertMessage from '../Portfolio-Alert/PortfolioAlertMessage';

import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import './style.css'
const PortfolioStockBuy = ({ portfolioId, isStockAdded, setIsStockAdded }) => {
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    quantity: 0,
    quantityError: true,
    stockError: true,
    stockId: "",
    currentPrice: 0
  });

  const [stocks] = useState(stockData);
  const [status, setStatus] = useState("");
 
  
  useEffect(() => {
    const getStockPrice = async () => {
      const response = await axios.get("http://localhost:9001/portfolio/getStockById/" + inputs.stockId);
      setInputs({ ...inputs, currentPrice: response.data.current_price })
    }
    if (inputs.stockId !== "") {
      getStockPrice();
    }
  }, [inputs.stockId])


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setInputs({ stockId: "", currentPrice: 0, quantity: 0, quantityError: true, stockError: true });
    setOpen(false);
  };
  const handleSubmit = async () => {
    try {
      console.log(inputs.quantity)
      const response = await axios.put(`http://localhost:9001/portfolio/buyStock/${inputs.quantity}`,null,{params:{stockId:inputs.stockId,portfolioId:portfolioId}});
      if (response.status === 201 || response.status === 200) {
        setStatus({ msg: "Success", key: Math.random() });
        setIsStockAdded(!isStockAdded);
      }
    } catch (error) {
      setStatus({ msg: "Invalid", key: Math.random(), color: "error" });
    }
    setInputs({ stockId: "", currentPrice: 0, quantity: 0, quantityError: true, stockError: true });
    setOpen(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleValidQuantity = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, quantityError: inputs.quantity <= 0 });
  };

  const handleValidStock = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, stockError: inputs.stockId === "" });
  };
  return (
    <div>
      <div>
        <Button variant="contained" size="small" startIcon={<AddCircleIcon />} onClick={handleClickOpen} >Buy Stocks</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='porfolio-buy-sell-dialogTitle'>Buy Stocks</DialogTitle>
          <DialogContent className="porfolio-buy-sell-dialogContent" sx={{ m: 1}} >
            <TextField
              id="outlined-select-currency"
              required
              select
              label="Select"
              name='stockId'
              onChange={handleChange}
              onBlurCapture={handleValidStock}
              value={inputs.stockId}
              sx={{ m: 1 }}
              fullWidth
            >
              {stocks.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              required
              id="outlined-required"
              label="Quantity"
              name="quantity"
              type="number"
              onBlurCapture={handleValidQuantity}
              fullWidth
              sx={{ m: 1 }}
              onChange={handleChange}
            />
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Current Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount-read-only-input-current"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Current Price"
                name="currentPrice"
                value={inputs.currentPrice}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount-read-only-input"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                name="Amount"
                className="amount"
                value={inputs.currentPrice !== 0 ? inputs.currentPrice * inputs.quantity : 0}
              />
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button variant="contained" size="small" disabled={inputs.quantityError === true || inputs.stockError === true} color="primary" onClick={handleSubmit}>Buy Stock</Button>
            <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
      {status ? <PortfolioAlertMessage key={status.key} message={status.msg} /> : null}
    </div>
  )
}

export default PortfolioStockBuy
