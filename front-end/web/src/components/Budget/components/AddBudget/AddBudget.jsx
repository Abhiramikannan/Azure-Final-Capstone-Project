import React, { useState }from 'react'
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import './style.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddBudget = ({open, handleClose, budgets, setBudgets}) => {
  const [budgetData, setBudgetData] = useState({
    name: '',
    description: '',
    amount: 0
  });

//   const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setBudgetData({
        ...budgetData,
        [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:9002/api/budget/create',budgetData);
        
        if(response.status == 200) {
            axios.get('http://localhost:9002/api/budget/all').then((response) => {
                setBudgets(response.data);
            })

            handleClose();
        } else {
            console.log("Failed to add budget");
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  return (
     <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="sm" fullWidth>
        <DialogTitle>Add Budget</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap:'15px'}}>
                <TextField
                    label="Name"
                    name="name"
                    value={budgetData.name}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Description"
                    name="description"
                    value={budgetData.description}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Amount"
                    name="amount"
                    value={budgetData.amount}
                    onChange={handleChange}
                    fullWidth
                />
                <div className='add-budget-dialog-button' onClick={handleSubmit}>Add Budget</div>
        </DialogContent>
     </Dialog>
  )
}

export default AddBudget