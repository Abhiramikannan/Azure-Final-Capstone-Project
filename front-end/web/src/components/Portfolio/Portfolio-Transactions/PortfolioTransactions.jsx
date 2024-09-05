import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, TablePagination } from '@mui/material';
import './style.css'
const PortfolioTransactions = () => {
    const [stockData, setStockData] = useState();
    const [transactionsList, setTransactionsList] = useState([]);
    const [holdings, setHoldings] = useState(0);
    const [returns, setReturns] = useState(0);
    const [loading, setLoading] = useState(true)
    const { stockId } = useParams();
    const { id } = useParams();
    useEffect(() => {
        const getAllStocks = async () => {
            const response = await axios.get("http://localhost:9001/portfolio/getTransaction",{params:{portfolioId:id,stockId:stockId}})
            setStockData(response.data.stock);
            setTransactionsList(response.data.transactionsDetailsList);
            setHoldings(response.data.holdings);
            setReturns(response.data.returns);
            setLoading(false)
        }
        getAllStocks();
    }, [id, stockId])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            {loading === true ?
                <div className="portfolio-spinner"><CircularProgress /></div> :
                stockData === null ?
                    <div className="portfolio-transactions-no-assests-div">
                        <h4 className="portfolio-transactions-no-assets">No Transaction to be display</h4>
                    </div> :
                    <div className='portfolio-transactions'>
                        <div className="portfolio-transactions-nav">
                            <div className="portfolio-transactions-current-balance">
                                <div className="portfolio-transactions-balance-title">{stockData.length !== 0 && stockData.stockName}({stockData.length !== 0 && stockData.stockSymbol.toUpperCase()}) Balance</div>

                                <div className="portfolio-transactions-balance-price">${holdings.toFixed(2)}
                                </div>
                                <div className="portfolio-transactions-transactions-btn">
                                    <div className="portfolio-transactions-quantity">
                                        <div className="portfolio-transactions-quantity-title">Quantity</div>
                                        <div className="portfolio-transactions-quantity-price">{stockData.quantity} {stockData.stockSymbol.toUpperCase()}</div>
                                    </div>
                                    <div className="portfolio-transactions-avgBuyPrice">
                                        <div className="portfolio-transactions-avgBuyPrice-title">Avg Buy Price</div>
                                        <div className="portfolio-transactions-avgBuyPrice-price">${stockData.avgBuyPrice.toFixed(2)}</div>
                                    </div>
                                    <div className="portfolio-transactions-profit-loss">
                                        <div className="portfolio-transactions-profit-loss-title">
                                            Profit/Loss
                                        </div>
                                        {returns && returns >= 0 ?
                                            (<div className="portfolio-transactions-balance-gain-loss portfolio-transactions-gain">${returns.toFixed(2)}</div>)
                                            : (<div className="portfolio-transactions-balance-gain-loss portfolio-transactions-loss">-${Math.abs(returns.toFixed(2))}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="portfolio-transactions">
                            <h4>Transactions History</h4>

                            <TableContainer component={Paper} className='portfolio-transactions-table-container'>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tablecellheading" align="center">#</TableCell>
                                            <TableCell className="tablecellheading" align="left">Type</TableCell>
                                            <TableCell className="tablecellheading" align="center">Amount</TableCell>
                                            <TableCell className="tablecellheading" align="center">Quantity</TableCell>
                                        </TableRow>

                                    </TableHead>
                                    <TableBody>
                                        {transactionsList
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell className="portfolio-transactions-tableData" align="center">{index + 1}</TableCell>
                                                    <TableCell align="left" className='portfolio-transactions-tablecell'>
                                                        <div>
                                                            <img className="portfolio-transactions-img" src={stockData.stockImage} alt="img" />
                                                        </div>
                                                        <div className='portfolio-transactions-name-symbol'>
                                                            <span className="portfolio-transactions-tableData">{item.type}</span>
                                                            <span className="portfolio-transactions-symbol">{new Date(item.createdAt).toISOString().slice(0, 10)}</span>
                                                        </div>

                                                    </TableCell>
                                                    <TableCell className="portfolio-transactions-tableData" align="center">
                                                        ${item.amount.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="portfolio-transactions-tableData" align="center">{item.quantity}</TableCell>


                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component='div'
                                count={transactionsList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>

            }
        </>
    )
}


export default PortfolioTransactions
