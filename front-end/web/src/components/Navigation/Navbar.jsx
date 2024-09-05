import React, { useState } from 'react'
import { useEffect } from 'react';
import './style.css';
import logo from "../../assets/wealthvue-coloured-logo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ViewProfile from './ViewProfile/ViewProfile';
const Navbar = () => {
  const [userDetails,setUserDetails]=useState()
  const id=sessionStorage.getItem("userId")
  const [openViewProfile, setOpenViewProfile] = useState(false);
  const pages = [
    {
      name: 'Dashboard',
      href: '/dashboard',
    },
    {
      name: 'Market',
      href: '/market',
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
    },
    {
      name: 'Budget',
      href: '/budget'
    },
    {
      name: 'Learn',
      href: '/learn',
    }
  ];
   useEffect(() => {
     const getUser=async()=>{
       const response=await axios.get("http://localhost:9003/users/"+id)
       setUserDetails(response.data)
     }
     getUser()
   }, [id])
   
  return (
    <nav>
        <div className='left-section'>
          {/* <MenuIcon className='menu-icon'/> */}
          <div className='brand-logo'>
            <div className='icon'><img src={logo} alt="logo" width="30"/></div>
            <div className='name'>SafeCryptoStocks</div>
          </div>
        </div>
        <div className='middle-section'>
          <div className='tabs'>
            {pages.map((page) => (
              <div className='tab' key={page.name}>
                <Link to={page.href} underline='none' color={"inherit"}>{page.name}</Link>
              </div>
            ))}
          </div>
        </div>
        <div className='right-section'>
          <AccountCircleIcon fontSize='medium'/>
          <div className='profile-details'>
            <div className='user-name'>{userDetails?.firstName} {userDetails?.lastName}</div>
            <div className='user-caption' onClick={()=> setOpenViewProfile(true)}>
              View Profile
            </div>
          </div>
        </div>
        <ViewProfile open={openViewProfile} handleClose={() => setOpenViewProfile(false)} userDetails={userDetails}/>
    </nav>
  )
}

export default Navbar