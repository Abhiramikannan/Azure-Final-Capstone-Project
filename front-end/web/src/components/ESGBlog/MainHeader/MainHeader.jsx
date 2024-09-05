import React from 'react'
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import './style.css'
const MainHeader = () => {
  return (
    <Paper

    elevation={3} // Add shadow to the paper for a raised effect
    style={{
        padding: '20px',
        background: '#081264',
        width: '100%', // Adjust the width as a percentage or a fixed value
        height: '350px', // Adjust the height as needed
        margin: 'auto', // Center the Jumbotron horizontally
    }}
  >
    <div className='esg-jumbotron'>
        <div className='esg-jumbotron-text'>
          <h1 className='esg-heading'>Learn</h1>
          <div className='esg-subheading'>Learn about the latest trends in cryptocurrency</div>
        </div>
        <div className='esg-header-image'>
            <img src="https://coinmarketcap.com/academy/images/homepage/strategy.png" alt=""/>
        </div>
    </div>

  </Paper>
  )
}

export default MainHeader
