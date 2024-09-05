import React from 'react'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
const DeletePortfolio = ({ portfolioId, isPortfolioAdded, setIsPortfolioAdded, setSelectedIndex}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [, setStatus] = React.useState("")
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = async () => {
        try {
            const response = await axios.delete("http://localhost:9001/portfolio/delete",{params:{portfolioId:portfolioId}})
            if (response.status === 200) {
                setStatus({ msg: "Deleted Successfully", key: Math.random() })
                setIsPortfolioAdded(!isPortfolioAdded)
                setSelectedIndex(-1);

                handleClose()
                navigate("/portfolio")
            }
        } catch (err) {
            setStatus({ msg: "Error occurred", key: Math.random() })
        }
    }
    return (
        <div>
            <Tooltip title="Delete">
                <DeleteIcon
                    color="error"
                    style={{ cursor: "pointer" }}
                    onClick={handleClickOpen}
                />
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete this portfolio
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this portfolio?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleDelete}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeletePortfolio
