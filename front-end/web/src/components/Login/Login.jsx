import React, { useState } from "react";
import './style.css'
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import logo from "../../assets/wealthvue-coloured-logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    emailError:true,
    passwordError:true
  })
  const navigate=useNavigate()
  
  const handleLogin=async(event)=>{
    
    
      event.preventDefault();
  
      const url = "http://localhost:9003/users/login";
  
      axios
        .post(url, inputs, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          const data = response.data;
          console.log(data)
          if (data !=null) {
            sessionStorage.setItem("userId", data);
          }
  
          setInputs({
            email: "",
            password: ""
          });
  
          navigate('/');
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  return (
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-container-header">
            <div className="login-container-header-logo">
              <div><img src={logo} alt="logo" width="35" /></div>
              <div style={{fontWeight: '600', fontSize: '18px', color: '#2c2c2c'}}>SafeCryptoStocks</div>
            </div>
            <div className="login-container-header-title">Sign In</div>
          </div>
  
          <form className="login-form" onSubmit={handleLogin}>
            
          <div className="login-form-field">
              <MailIcon style={{ color: '#828282', fontSize: '24px' }} />
              <input
                type="email"
                name="email"
                className="login-form-input"
                placeholder="Email"
                value={inputs.email}
                onChange={(event) =>
                  setInputs({ ...inputs, email: event.target.value })
                }
              />
            </div>
            <div className="login-form-field">
              <LockIcon style={{ color: '#828282', fontSize: '24px' }} />
              <input
                type="password"
                name="password"
                className="login-form-input"
                placeholder="Password"
                value={inputs.password}
                onChange={(event) =>
                  setInputs({ ...inputs, password: event.target.value })
                }
              />
            </div>
            <button type="submit" className="login-form-button">
              Login
            </button>
  
            <div className="login-form-register-link">
              <div>Don't have an account?</div>
              <Link to='/registration' underline='none' style={{color: '#0658f6', fontWeight: '700', cursor: 'pointer'}} >Register</Link>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Login
