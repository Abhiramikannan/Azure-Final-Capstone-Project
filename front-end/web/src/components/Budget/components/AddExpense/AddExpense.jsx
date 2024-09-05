import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, Autocomplete, Box} from '@mui/material';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import './style.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddExpense = ({open, handleClose, budgets, setExpenses, setBudgets}) => {
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: 0,
    budgetId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({
        ...expenseData,
        [name]: value,
    })
  }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:9002/api/expense/create', expenseData);
            
            if (response.status === 200) {
                axios.get('http://localhost:9002/api/expense/all').then((response) => {
                    setExpenses(response.data);
                })

                axios.get('http://localhost:9002/api/budget/all').then((response) => {
                    setBudgets(response.data);
                })

                handleClose();
            } else {
                console.log("Failed to add expense");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    

  return (
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="sm" fullWidth>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextField
                  label="Description"
                  name="description"
                  value={expenseData.description}
                  onChange={handleChange}
                  fullWidth
              />

              <TextField
                  label="Amount"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleChange}
                  fullWidth
              />

              <Autocomplete
                  id="select-budget"
                  fullWidth
                  options={budgets}
                  disableClearable
                  autoHighlight
                  getOptionLabel={(option) => option.name ? option.name : ""}
                  onChange={(e, newValue) => {
                      setExpenseData({
                        ...expenseData,
                        budgetId: newValue.id,
                      })
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <div>{option.name}</div>
                    </Box>
                  )}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          label="Choose the budget"
                          inputProps={{
                              ...params.inputProps,
                              type: 'search',
                          }}
                      />
                  )}
              />

              <div className='add-expense-dialog-button' onClick={handleSubmit}>Add Expense</div>
          </DialogContent>
      </Dialog>
  )
}

export default AddExpense