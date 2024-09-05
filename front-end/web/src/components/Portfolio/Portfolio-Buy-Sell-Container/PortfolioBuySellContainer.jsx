import { Dialog } from '@mui/material';
import React from 'react'
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PortfolioBuySellStock  from '../Portfolio-Buy-Sell-Stock/PortolioBuySellStock';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import { DialogActions } from '@mui/material';
import './style.css'
import PortfolioAlertMessage from '../Portfolio-Alert/PortfolioAlertMessage';

const PortfolioBuySellContainer= ({ portfolioId, isStockAdded, setIsStockAdded, stockId, stockName, currentPrice }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState("");
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button variant="text" size="large" color="primary" onClick={handleOpenDialog}>
        
          <AddCircleIcon />
       
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle className='portfolio-buy-sell-container-dialogTitle'>Add Transaction</DialogTitle>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab className='portfolio-buy-sell-container-tabLabel' label="Buy" />
          <Tab className='portfolio-buy-sell-container-tabLabel' label="Sell" />
        </Tabs>
        <DialogContent>
          {selectedTab === 0 && <PortfolioBuySellStock  portfolioId={portfolioId} type={"addMore"} isStockAdded={isStockAdded} setIsStockAdded={setIsStockAdded} stockId={stockId} stockName={stockName} currentPrice={currentPrice} setOpenDialog={setOpenDialog} openDialog={openDialog} status={status} setStatus={setStatus} />}
          {selectedTab === 1 && <PortfolioBuySellStock  portfolioId={portfolioId} type={"remove"} isStockAdded={isStockAdded} setIsStockAdded={setIsStockAdded} stockId={stockId} stockName={stockName} currentPrice={currentPrice} setOpenDialog={setOpenDialog} openDialog={openDialog} status={status} setStatus={setStatus} />}
        </DialogContent>
        <DialogActions>

        </DialogActions>
      </Dialog>
      {status ? <PortfolioAlertMessage key={status.key} message={status.msg} /> : null}
    </div>
  )
}

export default PortfolioBuySellContainer
