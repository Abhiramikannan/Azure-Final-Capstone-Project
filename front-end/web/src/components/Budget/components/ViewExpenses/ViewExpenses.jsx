import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import Slide from '@mui/material/Slide';
import './style.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function formatDate(rawDate) {
    const date = new Date(rawDate);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    return date.toLocaleDateString('en-US', options);
}

const ViewExpenses = ({ open, handleClose, expensesData }) => {

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="sm" fullWidth>
            <DialogTitle>Expenses</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {expensesData.map((e, k) => {
                    return (
                        <div key={k} className='view-expense-dialog-row'>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '0px'}}>
                                <div className='view-expense-description'>{e.description}</div>
                                <div className='view-expense-date'>{formatDate(e.createdAt)}</div>
                            </div>
                            <div className='view-expense-amount'>${e.amount}</div>
                        </div>
                    ); 
                })}
            </DialogContent>
        </Dialog>
    );
};

export default ViewExpenses;
