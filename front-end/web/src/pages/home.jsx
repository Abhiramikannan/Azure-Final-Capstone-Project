import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';

const Home = () => {
  
  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default Home