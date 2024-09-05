import React from 'react'
import { Dialog, DialogTitle, DialogContent} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LogoutIcon from '@mui/icons-material/Logout';
import Slide from '@mui/material/Slide';
import './style.css'
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ViewProfile = ({open, handleClose,userDetails}) => {
  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    // window.location.href = '/login';
    navigate('/login')
  }
  const navigate = useNavigate();
  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} maxWidth="xs" fullWidth>
        <DialogTitle sx={{fontFamily: 'Poppins', fontSize: '15px', fontWeight: '600', color: '#778296', textAlign: 'center'}}>Profile</DialogTitle>
        <DialogContent>
            <div className='profile-details-container'>
                <div className='profile-details-header'>
                    <div className='profile-details-profile-picture'><img src={userDetails?.profilePictureUrl} alt="Profile" style={{borderRadius: '50%'}} height="80"/></div>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className='profile-details-full-name'>{userDetails?.firstName} {userDetails?.lastName}</div>
                        <div className='profile-details-user-name'>{userDetails?.username}</div>
                    </div>
                </div>

                <div className='profile-details-row'>
                    <MailIcon sx={{fontSize: '22px', color: '#778296'}}/>
                    <div className='profile-details-column'>
                        <div className='profile-details-key'>Email Address</div>
                        <div className='profile-details-value'>{userDetails?.email}</div>
                    </div>
                </div>

                <div className='profile-details-row'>
                    <HomeIcon sx={{fontSize: '22px', color: '#778296'}}/>
                    <div className='profile-details-column'>
                        <div className='profile-details-key'>Address</div>
                        <div className='profile-details-value'>{userDetails?.address}</div>
                    </div>
                </div>

                <div className='profile-details-row'>
                    <PhoneInTalkIcon sx={{fontSize: '22px', color: '#778296'}}/>
                    <div className='profile-details-column'>
                        <div className='profile-details-key'>Contact Number</div>
                        <div className='profile-details-value'>{userDetails?.phoneNumber}</div>
                    </div>
                </div>


                <div className='logout-button' onClick={handleLogout}>
                    <LogoutIcon sx={{fontSize: '20px', color: 'white'}}/>
                    <div>Logout</div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ViewProfile