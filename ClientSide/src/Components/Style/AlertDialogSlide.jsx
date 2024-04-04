import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SetRenew } from '../../Redux/Actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  let dispatch = useDispatch()
  let language = useSelector(x => x.language)

  const [message, setMessage] = React.useState("")

  const confirmDelete = () => {
    let url
    if (props.type == "DeleteReport")
      url = `https://localhost:7071/api/Report/DeleteReport/${props.code}`
    else if (props.type == "DeleteSaveSearch")
      url = `https://localhost:7071/api/SaveSearch/DeleteSaveSearch/${props.code}`
    props.changeOpenAlert(-1)
    dispatch(SetRenew(true))
    axios.delete(url)
  }

  useEffect(() => {
    if (props.type == "DeleteReport")
      setMessage(language == 'he' ? " ?האם הנך בטוח שברצונך למחוק דיווח זו" : "Are you sure you want to delete this report?")
    else if (props.type == "DeleteSaveSearch")
      setMessage(language == 'he' ? " ?האם הנך בטוח שברצונך למחוק את חיפוש השמור הזה " : "Are you sure you want to delete this saved search?")

  }, [])

  return (
    <div>

      <Dialog
        key={props.code}
        open={props.openButton}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => props.changeOpenAlert(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{message}</DialogTitle>
        <DialogContent>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => confirmDelete()}>{language == 'he' ? 'אישור' : 'Yes'}</Button>
          <Button onClick={() => props.changeOpenAlert(-1)}>{language == 'he' ? 'ביטול' : 'No'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
