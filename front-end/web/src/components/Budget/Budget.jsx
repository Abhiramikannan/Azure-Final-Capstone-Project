import React, {useState, useEffect} from 'react'
import AddBudget from './components/AddBudget/AddBudget';
import AddExpense from './components/AddExpense/AddExpense';
import AddViewExpenses from './components/ViewExpenses/ViewExpenses';
import DeleteIcon from '@mui/icons-material/Delete';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TablePagination from "@mui/material/TablePagination";
import { styled } from '@mui/material';
import axios from 'axios';
import './style.css'


const BudgetLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 15,
    borderRadius: 8,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#d9e6ff',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#0658f6',
    },
}));

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

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewExpenseData, setViewExpenseData] = useState([]);

  const [openAddBudget, setOpenAddBudget] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openViewExpense, setOpenViewExpense] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:9002/api/budget/all').then((response) => {
        setBudgets(response.data);
    })

    axios.get('http://localhost:9002/api/expense/all').then((response) => {
        setExpenses(response.data);
    })
  }, []);

  const handleDeleteBudget = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:9002/api/budget/delete/${id}`)
        if (response.status == 200) {
            axios.get('http://localhost:9002/api/budget/all').then((response) => {
                setBudgets(response.data);
            })
        } else {
            console.log('Failed to delete budget');
        } 
    } catch(error) {
        console.log("Error : ", error);
    }
    
  };

  const handleViewExpense = (id) => {
      const filteredExpenses = expenses.filter((expense) => expense.budgetId === id);
      setViewExpenseData(filteredExpenses);
      setOpenViewExpense(true);
  }

    function handleChangePage(event, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

  return (
    <div className='budget-container'>
        <div className='budget-cards-container'>
            <div className='budget-cards-container-header'>
                  <div className='budget-header-body-title'>Budgets</div>
                  <div className='budget-buttons-container'>
                    <div className='budget-add-button' onClick={() => setOpenAddBudget(true)}>+ Add Budget</div>
                    <div className='budget-add-button' onClick={() => setOpenAddExpense(true)}>+ Add Expense</div>
                  </div>
            </div>
            <div className='budget-cards-container-body'>
                {
                    budgets.length != 0 ? 
                    budgets.map((b,k) => {
                        return(
                            <div className='budget-card-container' key={k}>
                                <div className='budget-card-header'>
                                    <div className='budget-card-name'>{b.name}</div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <DeleteIcon sx={{ fontSize: '22px', color: '#778296' }} onClick={() => handleDeleteBudget(b.id)}/>
                                        <RequestQuoteIcon sx={{ fontSize: '22px', color: '#778296'}} onClick={() => handleViewExpense(b.id)}/>
                                    </div>
                                </div>
                                <div className='budget-card-body'>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <div className='budget-card-description'>{b.description}</div>
                                        <div className='budget-card-metrics'>${b.expenses} / ${b.amount}</div>
                                    </div>
                                    <BudgetLinearProgress variant='determinate' value={(b.expenses / b.amount) * 100} />
                                </div>
                            </div>
                        )
                    }) : 
                    <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', fontWeight: '600', fontSize: '15px', color: '#828282', height: '500px'}}>
                        <div style={{width: '250px', textAlign: 'center'}}>Manage your personal wealth by creating budgets</div>
                    </div>
                }
            </div>
        </div>
        <div className='budget-transactions-container'>
            <div className='budget-transactions-header'>
                <div className='budget-header-body-title'>Expense History</div>
            </div>
              {
                  expenses.length != 0 ?
                      <>
                      <TableContainer>
                          <Table sx={{ width: "100%", "& .MuiTableRow-root:hover": { cursor: 'pointer', backgroundColor: "#f8fafd" } }} size={"small"} aria-label='a dense table'>
                              <TableHead>
                                  <TableRow>
                                      <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>#</TableCell>
                                      <TableCell align='left' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>DESCRIPTION</TableCell>
                                      <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>AMOUNT</TableCell>
                                      <TableCell align='left' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>BUDGET</TableCell>
                                      <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>DATE & TIME</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {
                                      expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, k) => {
                                          const expense_budget = budgets.find((budget) => budget.id === e.budgetId);
                                          return (
                                              <TableRow key={k}>
                                                  <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: "600", fontSize: '12px', borderBottom: "none" }}>{k + 1}</TableCell>
                                                  <TableCell align='left' sx={{ fontFamily: "Poppins", fontWeight: "600", fontSize: '12px', borderBottom: "none" }}>{e.description}</TableCell>
                                                  <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: "600", fontSize: '12px', borderBottom: "none" }}>
                                                      {e.amount}
                                                  </TableCell>
                                                  <TableCell align='left' style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: '12px', borderBottom: "none" }}>
                                                      {expense_budget!=null ?expense_budget.name:"-"}
                                                  </TableCell>
                                                  <TableCell align='right' style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: '12px', borderBottom: "none" }}>
                                                      {formatDate(e.createdAt)}
                                                  </TableCell>
                                              </TableRow>
                                          )

                                      })
                                  }
                              </TableBody>
                          </Table>
                      </TableContainer>
                          <TablePagination
                              rowsPerPageOptions={[10, 15, 25]}
                              component={"div"}
                              count={expenses.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              showFirstButton={true}
                              showLastButton={true}
                              sx={{
                                  '.MuiTablePagination-selectLabel': {
                                      fontFamily: 'Poppins !important',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      color: '#2c2c2c'
                                  },
                                  '.MuiTablePagination-displayedRows': {
                                      fontFamily: 'Poppins !important',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      color: '#2c2c2c'
                                  },
                                  '.MuiTablePagination-input': {
                                      fontFamily: 'Poppins !important',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      color: '#2c2c2c'
                                  },
                                  '.MuiInputBase-root': {
                                      fontFamily: 'Poppins !important',
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      backgroundColor: 'white'
                                  }
                              }}
                          />
                      </>
                      :
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', color: '#828282', height: '500px' }}>
                          <div style={{ width: '250px', textAlign: 'center' }}>There are no record of expenses to view currently.</div>
                      </div>
              }
        </div>



        <AddBudget open={openAddBudget} handleClose={() => setOpenAddBudget(false)} setBudgets={setBudgets}/>
        <AddExpense open={openAddExpense} handleClose={() => setOpenAddExpense(false)} budgets={budgets} setExpenses={setExpenses} setBudgets={setBudgets}/>
        <AddViewExpenses open={openViewExpense} handleClose={() => setOpenViewExpense(false)} expensesData={viewExpenseData} />
    </div>
  )
}

export default Budget