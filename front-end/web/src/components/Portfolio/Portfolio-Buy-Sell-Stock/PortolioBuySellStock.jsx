import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';

import './style.css'
const PortfolioBuySellStock = ({ portfolioId, isStockAdded, setIsStockAdded, type, stockId, stockName, currentPrice, setOpenDialog, status, setStatus }) => {

  const [inputs, setInputs] = React.useState({
    quantity: 0,
    stockId: stockId !== null ? stockId : "",
    stockName: stockName !== null ? stockName : "",
    currentPrice: currentPrice !== null ? currentPrice : "",
    quantityError: true,
    stockError: true,
  });




  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9001/portfolio/${type === "addMore" ? "buyStock" : "sellStock"}/${inputs.quantity}`,null,{params:{stockId:inputs.stockId,portfolioId:portfolioId}}
      );
      console.log(response)
      if (response.status === 201 || response.status === 200) {
        setStatus({ msg: "Success", key: Math.random() });
        setIsStockAdded(!isStockAdded);
      }
    } catch (error) {
      setStatus({ msg: "Invalid Quantity", key: Math.random(), color: "error" });
    }
    setInputs({ ...inputs, quantity: 0, quantityError: true, stockError: true })
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleValidQuantity = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, quantityError: inputs.quantity <= 0 });
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <div>
        <div>

          <TextField fullWidth sx={{ m: 1, width: '50ch' }}

            margin="dense"
            id="outlined-read-only-input"
            label="Read-Only"
            name="stockName"
            type="text"
            value={inputs.stockName}
          />
          <TextField
            margin="dense"
            required
            id="outlined-required"
            label="Quantity"
            name="quantity"
            type="number"
            onBlurCapture={handleValidQuantity}
            onChange={handleChange}
            sx={{ m: 1, width: '24.5ch' }}
          />
          <TextField
            margin="dense"
            required
            id="outlined-read-only-input price"
            label="Price Per Stock"
            name="currentPrice"
            type="number"
            value={inputs.currentPrice}
            sx={{ m: 1, width: '24ch' }}
          />
          <FormControl fullWidth sx={{ m: 1, width: '50ch' }}>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount-read-only-input"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Amount"
              value={inputs.currentPrice * inputs.quantity}
            />
          </FormControl>
          <div className="buttons">
            <Button className="btn-1" variant="contained" disabled={(inputs.quantityError === true)} color="primary" onClick={handleSubmit}>Continue with Transaction</Button>
            <Button className="btn-2" variant="contained" color="error" onClick={handleCloseDialog}>Cancel</Button>
          </div>

        </div>




      </div>
    </>
  );
};

export default PortfolioBuySellStock;

