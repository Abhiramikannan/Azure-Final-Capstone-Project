import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Plot from 'react-plotly.js';
import { Zoom, styled } from '@mui/material';
import './style.css'


export function numberWithCommas(number) {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

const BootstrapTooltip = styled(({className, ...props}) => (
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


const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 6,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#eff2f5',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#cfd6e4',
  },
}))

const StockDetails = () => {
  const { state } = useLocation();
  const stockData = state;

  const profit_7d = stockData.price_change_percentage_7d_in_currency > 0;
  const market_24h = stockData.market_cap_change_percentage_24h > 0;
  const liquidity = stockData.total_volume / stockData.market_cap;
  const supply_percentage = (stockData.circulating_supply/stockData.max_supply) * 100

  const [stock, setStock] = useState(1);
  const [usd, setUsd] = useState(stockData.current_price);

  const converter = (element) => {
      if(element && element.value) {
        setUsd(element.value * stockData.current_price);
        setStock(element.value);
      }
  }

  function convertDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const delta = today - date;

    const years = Math.round(delta / 1000 / 60 / 60 / 24 / 365);
    const months = Math.round((delta % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.round((delta % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

    let convertedDate = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (years > 0) {
      convertedDate += ` (${years} years ago)`;
    } else if (months > 0) {
      convertedDate += ` (${months} months ago)`;
    } else if (days > 0) {
      convertedDate += ` (${days} days ago)`;
    }

    return convertedDate;
  }
  

  const dataPoints = stockData.sparkline_in_7d.price;

  function generateDateLabels() {
    const currentDate = new Date();
    const dateLabels = [];

    for (let i = 0; i < 168; i++) {
      const timestamp = new Date(currentDate - i * 60 * 60 * 1000); 
    const formattedDate = timestamp.toLocaleString('default', {/* month: 'short',*/ day: '2-digit', hour: '2-digit', minute: '2-digit' }); // Format as "Oct 03 14:00"
      dateLabels.unshift(formattedDate);
    }

    return dateLabels;
  }
  // Risk Analysis
  const priceChangePercentage = stockData.price_change_percentage_7d_in_currency || 0;
  const riskThreshold = 2; // 2 percent
  const isHighRisk = Math.abs(priceChangePercentage) >= riskThreshold;

  return (
    <div className='stock-details-container'>
      <div className='details-left-section'>
        <div className='stock-details'>
          <div className='stock-details-image'><img src={stockData.image} alt={stockData.name} height="25" /></div>
          <div className='stock-details-name'>{stockData.name}</div>
          <div className='stock-details-symbol'>{stockData.symbol}</div>
        </div>
        <div className='stock-price-details'>
          <div className='stock-current-price'>${numberWithCommas(stockData.current_price)}</div>
          <div className='stock-percentage-change' style={{color: profit_7d > 0 ? "#16C784" : "#EA3943"}}>
            {profit_7d > 0 ? <ArrowDropUpOutlinedIcon style={{ color: '#16C784', fontSize: '28px'}}/> : <ArrowDropDownOutlinedIcon fontSize='medium' style={{color: '#EA3943'}}/>}
            <div style={{fontSize: '13px', fontWeight: '600'}}>{Math.abs(stockData.price_change_percentage_7d_in_currency.toFixed(2))}% (7d)</div>
          </div>
        </div>
        <div className='watchlist-button'>
          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <StarOutlineRoundedIcon fontSize='small' style={{color: '#778296'}}/>
            <div style={{fontSize: '12px', fontWeight: '600', color: '#778296'}}>Add to watchlist</div>
          </div>
          <AddRoundedIcon fontSize='small' style={{color: '#778296'}}/>
        </div>

        <div className='stock-details-metrics'>
          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Market Cap</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'The total market value of a cryptocurrency\'s circulating supply. It is analogous to the free-float capitalization in the stock market. Market Cap = Current Price x Circulating Supply.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div style={{color: market_24h > 0 ? "#16C784" : "#EA3943", display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: '600'}}>
                {market_24h > 0 ? <ArrowDropUpOutlinedIcon style={{ color: '#16C784', fontSize: '22px'}} /> : <ArrowDropDownOutlinedIcon style={{ color: '#EA3943', fontSize: '22px'}} />}
                <div>{Math.abs(stockData.market_cap_change_percentage_24h.toFixed(2))}%</div>
              </div>
              <div className='metric-value'>${numberWithCommas(stockData.market_cap)}</div>
            </div>
          </div>

          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Volume</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'A measure of how much of a cryptocurrency was traded in the last 24 hours.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>${numberWithCommas(stockData.total_volume.toString())}</div>
            </div>
          </div>

          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Volume / Market Cap</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'Indicator of liquidity. The higher the ratio, the more liquid the cryptocurrency is, which should make it easier for it to be bought/sold on an exchange close to its value.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>{liquidity.toFixed(2)}%</div>
            </div>
          </div>

          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Circulating Supply</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'The amount of coins that are circulating in the market and are in public hands. It is analogous to the flowing shares in the stock market.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>{numberWithCommas(stockData.circulating_supply)} {stockData.symbol}</div>
            </div>
          </div>

          { stockData.max_supply != null ? <StyledLinearProgress variant='determinate' value={supply_percentage}/> : <></> }

          <div className='metric-container' style={{marginTop: '10px'}}>
            <div className='metric-header'>
              <div className='metric-title'>Total Supply</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'Total supply = Total coins created - coins that have been burned (if any) It is comparable to outstanding shares in the stock market.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>{numberWithCommas(stockData.total_supply)} {stockData.symbol}</div>
            </div>
          </div>

          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Maximum Supply</div>
              <BootstrapTooltip TransitionComponent={Zoom} placement='right' title={'The maximum amount of coins that will ever exist in the lifetime of the cryptocurrency. It is analogous to the fully diluted shares in the stock market.'}><InfoOutlinedIcon sx={{fontSize: '14px', marginTop: '2px'}}/></BootstrapTooltip>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>{stockData.max_supply != null ? <>{numberWithCommas(stockData.max_supply)} {stockData.symbol}</> : <>--</>}</div>
            </div>
          </div>

          <div className='metric-container'>
            <div className='metric-header'>
              <div className='metric-title'>Fully Diluted Valuation</div>
            </div>
            <div className='metric-body'>
              <div className='metric-value'>${numberWithCommas(stockData.fully_diluted_valuation)}</div>
            </div>
          </div>

        </div>
      </div>
      <div className='details-middle-section'>
        <div className='converter'>
          <div className='converter-header'><p style={{textTransform: 'uppercase'}}>{stockData.symbol}</p> to USD Converter</div>
          <div className='converter-body'>
            <div className='converter-row'>
              <div className='converter-column'>
                <label>{stockData.symbol}</label>
                <input className="converter-input" id="stock" type="number" placeholder={stock}  value={stock} onChange={(e) => converter(e.target)}/>
              </div>
              <div className='converter-column'>
                <label>USD</label>
                <input className="converter-input" id="usd" type="number" placeholder={usd} value={usd} disabled/>
              </div>
            </div>
          </div>
        </div>

        <div className='price-performance'>
          <div className='price-performance-header'>Price Performance</div>
          <div className='price-performance-metrics'>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#778296'}}>Low (24h)</div>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#2c2c2c'}}>${numberWithCommas(stockData.low_24h)}</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#778296'}}>High (24h)</div>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#2c2c2c'}}>${numberWithCommas(stockData.high_24h)}</div>
              </div>
            </div>
            

            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#778296'}}>All-time high</div>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#2c2c2c'}}>${numberWithCommas(stockData.ath)}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#2c2c2c'}}>{convertDate(stockData.ath_date)}</div>
                <div style={{color: stockData.ath_change_percentage > 0 ? "#16C784" : "#EA3943", display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: '600'}}>
                  {stockData.ath_change_percentage > 0 ? <ArrowDropUpOutlinedIcon style={{ color: '#16C784', fontSize: '22px'}} /> : <ArrowDropDownOutlinedIcon style={{ color: '#EA3943', fontSize: '22px'}} />}
                  <div>{Math.abs(stockData.ath_change_percentage)}%</div>
                </div>
              </div>
            </div>
            


            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#778296'}}>All-time low</div>
                <div style={{fontSize: '14px', fontWeight: '600', color: '#2c2c2c'}}>${numberWithCommas(stockData.atl)}</div>
              </div>
              <div className="risk-analysis">
                <div className="risk-analysis-header">Risk Analysis</div>
                  <div className="risk-analysis-metrics">
                    <div className="risk-metric-container">
                      <div className="risk-metric-title">Price Change (7d)</div>
                      <div
                        className="risk-metric-value"
                        style={{ color: isHighRisk ? "#EA3943" : "#16C784" }} // Red for high risk, green for low risk
                      >
                        {Math.abs(priceChangePercentage.toFixed(2))}%
                      </div>
                    </div>
                    <div className="risk-metric-container">
                      <div className="risk-metric-title">Risk Level</div>
                      <div
                        className="risk-metric-value"
                        style={{ color: isHighRisk ? "#EA3943" : "#16C784" }} // Red for high risk, green for low risk
                      >
                        {isHighRisk ? "High Risk" : "Low Risk"}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{fontSize: '12px', fontWeight: '600', color: '#2c2c2c'}}>{convertDate(stockData.atl_date)}</div>
                  <div style={{color: stockData.atl_change_percentage > 0 ? "#16C784" : "#EA3943", display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: '600'}}>
                  {stockData.atl_change_percentage > 0 ? <ArrowDropUpOutlinedIcon style={{ color: '#16C784', fontSize: '22px'}} /> : <ArrowDropDownOutlinedIcon style={{ color: '#EA3943', fontSize: '22px'}} />}
                  <div>{Math.abs(stockData.atl_change_percentage)}%</div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='details-right-section'>
        <Plot
          data={[
            {
              x: generateDateLabels(),
              y: dataPoints,
              type: 'scatter',
              mode: 'lines',
              line: {color: '#0658f6'},
            }
          ]}
          layout={{ width: 550, height: 300, title: 'BTC Time Series (7d)'}}
        />
          <div className='risk-analysis-header'>Risk Analysis</div>
          <Plot
            data={[
              {
                x: generateDateLabels(),
                y: dataPoints,
                type: 'scatter',
                mode: 'lines',
                line: { color: isHighRisk ? 'red' : '#16C784' },
                name: 'Price'
              }
            ]}
            layout={{
              title: 'Price Over Last 7 Days',
              xaxis: { title: '', color: 'white' },
              yaxis: { title: 'Price (USD)', color: 'white' },
              plot_bgcolor: '#000',
              paper_bgcolor: '#000',
              font: { color: 'white' },
              showlegend: true,
              height: 300,
              width: 550
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />

      </div>



      
    </div>
    
    
    
  )
}


export default StockDetails;