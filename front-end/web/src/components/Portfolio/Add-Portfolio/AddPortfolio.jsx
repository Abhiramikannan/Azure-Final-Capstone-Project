import React from 'react'
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import PortfolioAlertMessage from '../Portfolio-Alert/PortfolioAlertMessage';
import "./style.css"
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const AddPortfolio = ({ portfolioId, isPortfolioAdded, setIsPortfolioAdded, type, portfolioName, portfolioDesc }) => {

  const portfoliodata = [
    { name: 'Community-Investing', id: '1' },
    { name: 'Ethical-Investing', id: '2' },
    { name: 'Green-Investing', id: '3' },
    { name: 'Impact-Investing', id: '4' },
    { name: 'Mission-related Investing', id: '5' },
    { name: 'Responsible-Investing', id: '6' },
    { name: 'Socially-Responsible-Investing', id: '7' },
    { name: 'Values-based investing', id: '8' },
  ];

  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    portfolioName: portfolioName != null ? portfolioName : '',
    investmentAgenda: portfolioDesc != null ? portfolioDesc : '',
    portfolioNameError: false,
    portfolioInvestmentError: true,
  });
  const [status, setStatus] = useState('');
  const id = sessionStorage.getItem('userId');
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    { type === "add" ? setInputs({ portfolioName: '', investmentAgenda: '', portfolioNameError: false, portfolioInvestmentError: false }) : setInputs({ ...inputs, portfolioNameError: false, portfolioInvestmentError: false }) }
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      
      const response = await axios.post(`http://localhost:9001/portfolio/add`, inputs,{params:{userId:id}});
      if (response.status === 201) {
        setStatus({ msg: 'Portfolio Added successfully', key: Math.random() });
        setIsPortfolioAdded(!isPortfolioAdded);
      }
    } catch (error) {
      console.error('Error adding portfolio:', error);
      setStatus({ msg: 'Error', key: Math.random() });
    }
    setInputs({ portfolioName: '', investmentAgenda: '', portfolioNameError: false, portfolioInvestmentError: false });
    setOpen(false);
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:9001/portfolio/update`, inputs,{params:{portfolioId:portfolioId}});
      if (response.status === 200) {
        setStatus({ msg: 'Portfolio Updated Successfully', key: Math.random() });
        setIsPortfolioAdded(!isPortfolioAdded);
      }
    } catch (error) {
      console.error('Error updating portfolio', error);
      setStatus({ msg: 'Error', key: Math.random() });
    }
    setInputs({ ...inputs, portfolioNameError: false, portfolioInvestmentError: false });
    setOpen(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleValidName = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, portfolioNameError: inputs.portfolioName.length === 0 });
  };

  const handleValidAgenda = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, portfolioInvestmentError: inputs.investmentAgenda === '' });
  };

  return (
    <div>
      {type === 'add' ? (
        <Tooltip title="Create a new portfolio">
          <div onClick={handleClickOpen}><AddIcon className="add-portfolio-circle-icon" style={{ fontSize: 30 }} /></div>
        </Tooltip>
      ) : (
        <Tooltip title="Edit">
          <EditNoteIcon color="primary" style={{ cursor: 'pointer' }} onClick={handleClickOpen} />
        </Tooltip>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className='add-portfolio-dialogTitle'>{type === 'add' ? 'Create Portfolio' : 'Edit Portfolio'}</DialogTitle>
        <DialogContent sx={{ height: '200px', width: smallScreen ? '80%' : '400px' }}>
          <TextField
            margin="dense"
            required
            id="outlined-required"
            label="Name"
            name="portfolioName"
            value={inputs.portfolioName}
            onChange={handleChange}
            onBlurCapture={handleValidName}
            type="text"
            className='add-portfolio-input-field'
            fullWidth
          />
          <TextField
            id="outlined-required select"
            required
            select
            label="Select"
            name="investmentAgenda"
            value={inputs.investmentAgenda}
            onChange={handleChange}
            onBlurCapture={handleValidAgenda}
            className='add-portfolio-input-field'
            fullWidth
          >
            {portfoliodata.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {type === 'add' ? (
            <Button variant="contained" disabled={inputs.portfolioNameError || inputs.portfolioInvestmentError} onClick={handleSubmit}>
              Add
            </Button>
          ) : (
            <Button variant="contained" disabled={inputs.portfolioNameError && inputs.portfolioInvestmentError} onClick={handleEdit}>
              Edit
            </Button>
          )}
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {status ? <PortfolioAlertMessage key={status.key} message={status.msg} /> : null}
    </div>
  );
};

export default AddPortfolio;

