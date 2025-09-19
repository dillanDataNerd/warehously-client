import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';

export default function Toast({message, success}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(()=>{
    setOpen(true)
  },[])

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity= {success ? "success":"error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
            {message}
        </Alert>
      </Snackbar>
    </div>
  );
}



//   const [error, setError] = useState(null);
//      setError("Failed to Delete item. Try again later")
//      {error && <Toast message={"Image successfully uploaded"} success={false} />}


