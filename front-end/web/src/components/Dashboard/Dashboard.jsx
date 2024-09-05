import React, { useEffect, useState } from 'react';
import './style.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import { News } from './News';
import ChatBox from './ChatBox';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export function numberWithCommas(number) {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export const Dashboard = () => {
    const [trendingData, setTrendingData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [portfolioData, setPortfolioData] = useState([]);
    const navigate = useNavigate();
    const id = sessionStorage.getItem("userId");
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendingResponse, marketResponse, userResponse, portfolioResponse] = await Promise.all([
                    axios.get('https://api.coingecko.com/api/v3/search/trending'),
                    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                        params: {
                            vs_currency: 'usd',
                            order: 'market_cap_desc',
                            per_page: 250,
                            page: 1,
                            sparkline: true,
                            price_change_percentage: '24h,7d'
                        }
                    }),
                    axios.get(`http://localhost:9003/users/${id}`),
                    axios.get("http://localhost:9001/portfolio/getPortfolioData", { params: { userId: id } })
                ]);

                setTrendingData(trendingResponse.data.coins.map(d => d.item));
                setMarketData(marketResponse.data.slice(0, 10));
                setUserDetails(userResponse.data);
                setPortfolioData(portfolioResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleRowClick = (row) => {
        navigate(`/market/stock/${row.id}`, { state: row });
    };

    return (
        <div className='dashboard-container'>
            <div className='dashboard-header'>
                <div className='dashboard-header-title'>Hi, {userDetails?.firstName} {userDetails?.lastName} 👋</div>
                <div className='dashboard-header-caption'>Let's grow your Stocks with SafeCryptoStocks</div>
            </div>
            <div className='dashboard-body'>
                {/* LEFT SECTION */}
                <div className='dashboard-body-left-section'>
                    {loading ? (
                        <div className='loader'>
                            <CircularProgress thickness={7} size={20} color='primary' />
                            <div className='loader-caption'>Setting everything up for you</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div className='dashboard-trending-container'>
                                <div className='dashboard-body-title'>Top Trending Coins 🔥</div>
                                <div className='dashboard-trending-cards'>
                                    {trendingData?.map((d, k) => (
                                        <div className='dashboard-trending-card' key={k}>
                                            <div className='trending-card-header'>
                                                <div className='trending-card-header-image'>
                                                    <img src={d.large} alt={d.name} height="25" />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ fontWeight: '600', color: "#0658f6", fontSize: '13px' }}>{d.name}</div>
                                                    <div style={{ marginTop: '-5px', textTransform: 'uppercase', fontWeight: '600', color: "#828282", fontSize: '11px' }}>{d.symbol}</div>
                                                </div>
                                            </div>
                                            <div className='trending-card-body'>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <div style={{ fontWeight: '600', color: "#828282", fontSize: '12px' }}>Market Rank</div>
                                                    <div style={{ fontWeight: '600', color: "#2c2c2c", fontSize: '12px' }}>{d.market_cap_rank}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='dashboard-top-coins-container'>
                                <div className='dashboard-body-title'>Top Cryptocurrencies by Market Cap ⭐</div>
                                <TableContainer>
                                    <Table
                                        sx={{ width: "100%", "& .MuiTableRow-root:hover": { cursor: 'pointer', backgroundColor: "#f8fafd" } }}
                                        size="small"
                                        aria-label='a dense table'
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>#</TableCell>
                                                <TableCell align='left' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>NAME</TableCell>
                                                <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>PRICE</TableCell>
                                                <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>24H%</TableCell>
                                                <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: '700', fontSize: '10px' }}>7D%</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {marketData?.map((d, k) => {
                                                const profit_24h = d.price_change_percentage_24h > 0;
                                                const profit_7d = d.price_change_percentage_7d_in_currency > 0;

                                                return (
                                                    <TableRow key={k} onClick={() => handleRowClick(d)}>
                                                        <TableCell align='right' sx={{ fontFamily: "Poppins", fontWeight: "500", fontSize: '12px', borderBottom: "none" }}>
                                                            {d.market_cap_rank}
                                                        </TableCell>
                                                        <TableCell align='left' sx={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: "none" }}>
                                                            <div><img src={d?.image} alt={d.name} height='20' /></div>
                                                            <div className='stock-name-container'>
                                                                <div className='stock-name'>{d.name}</div>
                                                                <div className='stock-symbol' style={{ marginTop: '-5px' }}>{d.symbol}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align='right' sx={{ borderBottom: "none" }}>
                                                            <div className='stock-price'>${numberWithCommas(d.current_price)}</div>
                                                        </TableCell>
                                                        <TableCell align='right' style={{ color: profit_24h ? "#16C784" : "#EA3943", borderBottom: "none" }}>
                                                            <div className='stock-percentage-container'>
                                                                {profit_24h ? <ArrowDropUpOutlinedIcon fontSize='medium' style={{ color: '#16C784' }} /> : <ArrowDropDownOutlinedIcon fontSize='medium' style={{ color: '#EA3943' }} />}
                                                                <div className='stock-percentage'>{Math.abs(d.price_change_percentage_24h.toFixed(2))}%</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align='right' style={{ color: profit_7d ? "#16C784" : "#EA3943", borderBottom: "none" }}>
                                                            <div className='stock-percentage-container'>
                                                                {profit_7d ? <ArrowDropUpOutlinedIcon fontSize='medium' style={{ color: '#16C784' }} /> : <ArrowDropDownOutlinedIcon fontSize='medium' style={{ color: '#EA3943' }} />}
                                                                <div className='stock-percentage'>{Math.abs(d.price_change_percentage_7d_in_currency.toFixed(2))}%</div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION */}
                <div className='dashboard-body-right-section'>
                    {/* Existing right section components... */}
                    <News /> {/* Add the News component */}
                    <ChatBox />
                </div>
            </div>
        </div>
    );
};
