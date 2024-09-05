import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './style.css'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, TablePagination } from '@mui/material';
import PortfolioAlertMessage from '../Portfolio-Alert/PortfolioAlertMessage';
import PortfolioBuySellContainer from '../Portfolio-Buy-Sell-Container/PortfolioBuySellContainer';
import PortfolioStockBuy from '../Portfolio-Stock-Buy/Portfolio-Stock-Buy';




const PortfolioStock = () => {
  const [stockData, setStockData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0.0);
  const [totalReturns, setTotalReturns] = useState(0.0);

  const [isStockAdded, setIsStockAdded] = useState(false);
  const [loading, setLoading] = useState(true)
  const [status] = React.useState("")
  const { id } = useParams();
  useEffect(() => {
    const getAllStocks = async () => {
      try{
      const response = await axios.get("http://localhost:9001/portfolio/getAllStocks",{params:{portfolioId:id}})
         setStockData(response.data.stockDetails);
         setTotalBalance(response.data.totalBalance);
         setTotalReturns(response.data.totalReturns);
         setLoading(false)
      }catch(err){
     console.log(err)
     }
    }
    getAllStocks();
  }, [id, isStockAdded])
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
          <div className="no-assests-div">
            <h4 className="no-assets">No Assets to be display</h4>
            <PortfolioStockBuy portfolioId={id} isStockAdded={isStockAdded} setIsStockAdded={setIsStockAdded} />
          </div> :
          <div className='portfolio-stocks'>
            <div className="portfolio-stocks-nav">
              <div className="portfolio-stocks-current-balance">
                <div className="portfolio-stocks-balance-title">Current Balance</div>
                <div className="portfolio-stocks-balance-value">
                  <div className="portfolio-stocks-balance-price">${totalBalance && totalBalance.toFixed(2)}</div>
                </div>
                {totalReturns && totalReturns >= 0 ?
                  (<div className="portfolio-stocks-balance-gain-loss portfolio-stocks-gain">${totalReturns.toFixed(2)}</div>)
                  : (<div className="portfolio-stocks-balance-gain-loss portfolio-stocks-loss">-${Math.abs(totalReturns.toFixed(2))}</div>)}
              </div>
              <div className="portfolio-stocks-addStocksBtn">
                <PortfolioStockBuy portfolioId={id} isStockAdded={isStockAdded} setIsStockAdded={setIsStockAdded} />
              </div>
            </div>
            <div className="portfolio-stocks-assests-title">
              <h4>Your Assets</h4>

              <TableContainer component={Paper} className='portfolio-stocks-table-container'>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="tablecellheading" align="center">#</TableCell>
                      <TableCell className="tablecellheading" align="left">Name</TableCell>
                      <TableCell className="tablecellheading" align="right">Price</TableCell>
                      <TableCell className="tablecellheading" align="center">24H%</TableCell>
                      <TableCell className="tablecellheading" align="center">Holdings</TableCell>
                      <TableCell className="tablecellheading" align="center">Avg. Buy Price</TableCell>
                      <TableCell className="tablecellheading" align="center">Profit/Loss</TableCell>
                      <TableCell className="tablecellheading" align="center">Actions</TableCell>
                    </TableRow>

                  </TableHead>
                  <TableBody>
                    {stockData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell className="portfolio-stocks-tableData" align="center">{index + 1}</TableCell>
                          <TableCell align="left" className='portfolio-stocks-tablecell'>
                            <div>
                              <img className="portfolio-stock-img"src={item.stock.stockImage} alt="img" />
                            </div>
                            <div className='portfolio-stocks-name-symbol'>
                              <span className="portfolio-stocks-tableData"><Link to={`/portfolio/transaction/${item.stock.stockId}/${id}`}>{item.stock.stockName}</Link></span>
                              <span className="portfolio-stocks-symbol">{item.stock.stockSymbol}</span>
                            </div>

                          </TableCell>
                          <TableCell className="portfolio-stocks-tableData" align="right">${item.currentPrice && item.currentPrice.toFixed(2)}</TableCell>

                          <TableCell className="portfolio-stocks-tableData" align="center">
                            {item.priceChangePercentage24h && item.priceChangePercentage24h >= 0 ?
                              (<div className="portfolio-stocks-gain portfolio-stocks-price-change"><ArrowDropUpIcon />{item.priceChangePercentage24h.toFixed(2)}%</div>)
                              : (<div className="portfolio-stocks-loss portfolio-stocks-price-change"><ArrowDropDownIcon />{Math.abs(item.priceChangePercentage24h.toFixed(2))}%</div>)}
                          </TableCell>
                          <TableCell className="portfolio-stocks-tableData" align="center">${item.holdings && item.holdings.toFixed(2)}</TableCell>
                          <TableCell className="portfolio-stocks-tableData" align="center">${item.stock.avgBuyPrice.toFixed(2)}</TableCell>
                          <TableCell className="portfolio-stocks-tableData" align="center">
                            {item.returns && item.returns >= 0 ?
                              (<div className="portfolio-stocks-gain">${item.returns.toFixed(2)}</div>)
                              : (<div className="portfolio-stocks-loss">-${Math.abs(item.returns.toFixed(4))}</div>)}
                          </TableCell>
                          <TableCell align="center">
                            <PortfolioBuySellContainer portfolioId={id} isStockAdded={isStockAdded} setIsStockAdded={setIsStockAdded} stockId={item.stock.stockId} stockName={item.stock.stockName} currentPrice={item.currentPrice} image={item.stock.stockImage} symbol={item.stock.stockSymbol} />

                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={stockData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>

            {status ? <PortfolioAlertMessage key={status.key} message={status.msg} /> : null}
          </div>
      }
    </>
  )
}

export default PortfolioStock
