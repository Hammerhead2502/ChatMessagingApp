import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BotMessageSquare } from 'lucide-react';
import axios from 'axios';

export default function AIReply() {
  const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState("")
    const [reply, setReply] = React.useState("")
  const handleClickOpen = () => {
    setReply("")
    setOpen(true);
  };

  const handleClose = () => {
    setMsg("")
    setOpen(false);
  };
  const aiReply = async(e) => {
    e.preventDefault()
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getAIreply`, {msg: msg}).then((res) => {
      if(res.status == 200){
        setReply(res?.data?.data)
      }
    }).catch((err) => console.log(err))
  }
  
  return (
    <React.Fragment>
      <BotMessageSquare className='text-gray-400 inline ml-3 relative right-20 cursor-pointer' onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Ask me anything</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Eg. What is the meaning of Exhumation?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Ask AI"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setMsg(e.target.value)}
          />
          <textarea
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            placeholder="Your reply will show up here"
            type="text"
            variant="standard"
            value={reply}
            readOnly
            rows="10"
            className='w-full mt-2'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={aiReply}>Ask</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}