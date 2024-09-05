import React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom, styled, InputAdornment, TextField } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from "@mui/icons-material/Search";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import TablePagination from "@mui/material/TablePagination"; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css'

export function numberWithCommas(number) {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

const StyledLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#eff2f5',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#cfd6e4',
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontFamily: 'Poppins',
    fontSize: '11px'
  },
}));

const Market = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&amp;order=market_cap_desc&amp;per_page=250&amp;page=1&amp;sparkline=true&amp;price_change_percentage=24h%2C7d'

  useEffect(() => {
    setLoading(true);

    axios.get(url).then((response) => {
      setMarketData(response.data);
    }).catch((error) => {
      console.log(error)
    })

    setLoading(false);
  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleRowClick = (row) => {
    navigate(`/market/stock/${row.id}`, { state: row });
  };


  return (
    <div className='market-container'>
      <div className='header'>
        <div>Top Cryptocurrencies by Market Cap</div>
        <TextField
          id="search"
          placeholder='Search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ 
            width: 350,
            '& .MuiInputBase-root': {
              borderRadius: '10px',
              border: '1px solid #cfd6e4'
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '2px solid #cfd6e4' 
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              border: '2px solid #cfd6e4'
            },
          }}
          size='small'
          InputProps={{
            inputProps: {
              style: {
                textAlign: 'left',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '600',
                color: '#828282'
              }
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      {
        loading ? 
          <div className='loader'>
            <CircularProgress thickness={7} size={20} color='primary' />
            <div className='loader-caption'>Fetching latest market data</div>
          </div>
          :
          <>          
          <TableContainer>
            <Table sx={{minWidth: 650, "& .MuiTableRow-root:hover": { cursor: 'pointer', backgroundColor: "#f8fafd" }}} size={"small"} aria-label='a dense table'>
              <TableHead>
                <TableRow>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>#</TableCell>
                  <TableCell align='left' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>NAME</TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>PRICE</TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>24H%</TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>7D%</TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
                      <div>MARKET CAP</div>
                      <BootstrapTooltip TransitionComponent={Zoom} title={'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '-3px'}}/></BootstrapTooltip>
                    </div>
                  </TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end',  gap: '5px'}}>
                      <div>VOLUME</div>
                      <BootstrapTooltip TransitionComponent={Zoom} title={'A measure of how much of a cryptocurrency was traded in the last 24 hours.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '-3px'}}/></BootstrapTooltip>
                    </div>
                  </TableCell>
                  <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: '700', fontSize: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap:'5px'}}>
                      <div>SUPPLY</div>
                      <BootstrapTooltip TransitionComponent={Zoom} title={'The amount of coins that are circulating in the market and are in public hands. It is analogous to the flowing shares in the stock market.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '6px'}}/> </BootstrapTooltip>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  marketData?.filter((d) => d.name.toLowerCase().includes(searchInput.toLowerCase()))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((d,k) => {
                    const profit_24h = d.price_change_percentage_24h > 0;
                    const profit_7d = d.price_change_percentage_7d_in_currency > 0;
                    const derived_volume = (d.total_volume / d.current_price).toFixed(2);

                    return (
                      <TableRow key={k} onClick={() => handleRowClick(d)}>
                        <TableCell align='right' sx={{fontFamily: "Poppins", fontWeight: "500", fontSize: '12px'}}>{d.market_cap_rank}</TableCell>
                        <TableCell align='left' sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                          <div><img src={d?.image} alt={d.name} height='25'/></div>
                          <div className='stock-name-container'>
                            <div className='stock-name'>{d.name}</div>
                            <div className='stock-symbol'>{d.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                          <div className='stock-price'>${numberWithCommas(d.current_price)}</div>
                        </TableCell>
                        <TableCell align='right' style={{color: profit_24h > 0 ? "#16C784" : "#EA3943"}}>
                          <div className='stock-percentage-container'>
                            {profit_24h > 0 ? <ArrowDropUpOutlinedIcon fontSize='medium' style={{ color: '#16C784'}}/> : <ArrowDropDownOutlinedIcon fontSize='medium' style={{color: '#EA3943'}}/>}
                            <div className='stock-percentage'>{Math.abs(d.price_change_percentage_24h.toFixed(2))}%</div>
                          </div>
                        </TableCell>
                        <TableCell align='right' style={{color: profit_7d > 0 ? "#16C784" : "#EA3943"}}>
                          <div className='stock-percentage-container'>
                            {profit_7d > 0 ? <ArrowDropUpOutlinedIcon fontSize='medium' style={{ color: '#16C784'}}/> : <ArrowDropDownOutlinedIcon fontSize='medium' style={{color: '#EA3943'}}/>}
                            <div className='stock-percentage'>{Math.abs(d.price_change_percentage_7d_in_currency.toFixed(2))}%</div>
                          </div>
                        </TableCell>
                         <TableCell align='right'>
                          <div className='stock-price'>${numberWithCommas(d.market_cap)}</div>
                        </TableCell>
                        <TableCell align='right'>
                          <div className='stock-volume-container'>
                            <div className='stock-volume'>${numberWithCommas(d.total_volume)}</div>
                            <div className='stock-derived-volume'>{numberWithCommas(derived_volume)} {d.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                          <div className='stock-circulating-supply'>{numberWithCommas(d.circulating_supply)} {d.symbol}</div>
                          { d.max_supply != null ? <StyledLinearProgress variant='determinate' value={(d.circulating_supply/d.max_supply) * 100}/> : <></> }
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
                rowsPerPageOptions={[20,50,100]}
                component={"div"}
                count={marketData.filter((d) => d.name.toLowerCase().includes(searchInput.toLowerCase())).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showFirstButton={true}
                showLastButton={true}
                sx = {{
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
      }
    </div>
  )
}

export default Market