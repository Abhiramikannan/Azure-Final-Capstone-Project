import { Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'

const PortfolioAlertMessage = ({ message }) => {
  const [open, setOpen] = React.useState(true);
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        variant="warning"
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={message}
        action={[
          <IconButton key="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        ]}
      >
      </Snackbar>
    </div>
  );
}

export default PortfolioAlertMessage
