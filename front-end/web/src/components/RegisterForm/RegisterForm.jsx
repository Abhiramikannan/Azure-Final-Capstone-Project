import React, { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import FaceIcon from '@mui/icons-material/Face';
import BadgeIcon from '@mui/icons-material/Badge';
import logo from "../../assets/wealthvue-coloured-logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./style.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    profilePictureUrl: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = "http://localhost:9003/users/register";

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data.success);
        if (data !== null) {
          alert("User registration successful!");
        }

        setFormData({
          username: "",
          password: "",
          email: "",
          firstName: "",
          lastName: "",
          address: "",
          phoneNumber: "",
          profilePictureUrl: "",
        });

        navigate('/login');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="registration-container">
      <div className="registration-form-container">
        <div className="registration-container-header">
          <div className="registration-container-header-logo">
            <div><img src={logo} alt="logo" width="35" /></div>
            <div style={{fontWeight: '600', fontSize: '18px', color: '#2c2c2c'}}>SafeCryptoStocks</div>
          </div>
          <div className="registration-container-header-title">Sign Up</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="registration-form-field">
            <PersonIcon style={{color: '#828282', fontSize: '24px'}}/>
            <input
              type="text"
              name="username"
              className="registration-form-input"
              placeholder="Username"
              value={formData.username}
              onChange={(event) =>
                setFormData({ ...formData, username: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <LockIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="password"
              name="password"
              className="registration-form-input"
              placeholder="Password"
              value={formData.password}
              onChange={(event) =>
                setFormData({ ...formData, password: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <MailIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="email"
              name="email"
              className="registration-form-input"
              placeholder="Email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <BadgeIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="text"
              name="firstName"
              className="registration-form-input"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(event) =>
                setFormData({ ...formData, firstName: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <BadgeIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="text"
              name="lastName"
              className="registration-form-input"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(event) =>
                setFormData({ ...formData, lastName: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <HomeIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="text"
              name="address"
              className="registration-form-input"
              placeholder="Address"
              value={formData.address}
              onChange={(event) =>
                setFormData({ ...formData, address: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <PhoneInTalkIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="text"
              name="phoneNumber"
              className="registration-form-input"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(event) =>
                setFormData({ ...formData, phoneNumber: event.target.value })
              }
            />
          </div>

          <div className="registration-form-field">
            <FaceIcon style={{ color: '#828282', fontSize: '24px' }} />
            <input
              type="text"
              name="profilePictureUrl"
              className="registration-form-input"
              placeholder="Profile Picture URL"
              value={formData.profilePictureUrl}
              onChange={(event) =>
                setFormData({ ...formData, profilePictureUrl: event.target.value })
              }
            />
          </div>
          <button type="submit" className="registration-form-button">
            Register
          </button>

          <div className="registration-form-login-link">
            <div>Already have an account?</div>
            <Link to='/login' underline='none' style={{color: '#0658f6', fontWeight: '700', cursor: 'pointer'}} >Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
