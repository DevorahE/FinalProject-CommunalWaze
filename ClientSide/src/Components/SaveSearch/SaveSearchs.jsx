import NearMeIcon from '@mui/icons-material/NearMe';
import StartIcon from '@mui/icons-material/Start';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { IconButton, ListItem, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertDialogSlide from '../Style/AlertDialogSlide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SaveSearchs = (props) => {
  const [open, setOpen] = React.useState(true);
  const [listSaveSearch, setListSaveSearch] = React.useState([])
  let currentUser = useSelector(x => x.user)
  let language = useSelector(x => x.language)
  const [openAlert, setOpenAlert] = React.useState(-1)

  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    axios.get(`https://localhost:7071/api/SaveSearch/GetByUser/${currentUser.userId}`).then(x => {
      setListSaveSearch(x.data)

    })

  }
    , [listSaveSearch])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Link style={{ color: 'black', textDecoration: 'none' }} to={'/AddSaveSearch'}>
        <ListItemButton>
          <ListItemIcon style={{ color: 'pink' }}>
            <AddCircleIcon></AddCircleIcon>
          </ListItemIcon>
          <ListItemText primary={language == 'he' ? "הוספת חיפוש שמור חדש" : 'Add a new save search'} />
        </ListItemButton>
      </Link>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={language == 'he' ? "חיפושים שמורים" : 'Save search'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {listSaveSearch && listSaveSearch.map(x => (
            <ListItem sx={{ pl: 4 }} key={`key${x.searchId}`}>
              <ListItemIcon>
                <Tooltip title={language == 'he' ? "עדכון חיפוש שמור" : 'Updating the save search'} arrow>
                  <Link style={{ color: "#e83e8c" }} to={`/EditSaveSearch/${x.searchId}`}><EditIcon></EditIcon></Link>
                </Tooltip>
              </ListItemIcon>
              {(x.nameSearch !== 'בית' && x.nameSearch !== 'Home'
                && x.nameSearch !== 'עבודה' && x.nameSearch !== 'Work')
                && <Tooltip title={language == 'he' ? "מחיקת חיפוש שמור" : 'Deleting the save search'} arrow>
                  <ListItemIcon key={`delete${x.searchId}`} edge='end' onClick={() => { setOpenAlert(x.searchId) }}>
                    <DeleteIcon style={{ color: 'red' }} />
                  </ListItemIcon>
                </Tooltip>}

              {openAlert == x.searchId && <React.Fragment key={x.searchId}>
                <AlertDialogSlide openButton={true} changeOpenAlert={setOpenAlert} code={x.searchId} type={"DeleteSaveSearch"} /></React.Fragment>}


              <ListItemText primary={x.nameSearch} />
              <Tooltip title={language == 'he' ? "הוספה כנקודת מוצא" : 'Add as a starting point'} arrow>
                <IconButton key={`startPoint${x.searchId}`} edge='end' onClick={() => {
                  if (x.formattedAddress !== '') {
                    props.setOrigin(x.formattedAddress);
                    props.setOriginData({ lat: parseFloat(x.lat), lng: parseFloat(x.lng) })
                  }
                  else {
                    handleClickSnack()
                  }
                }}>
                  <StartIcon style={{ color: 'orange' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={language == 'he' ? "הוספה כיעד" : 'Add as destination'} arrow>
                <IconButton key={`destination${x.searchId}`} edge='end' onClick={() => {
                  if (x.formattedAddress !== '') {
                    props.setDestination(x.formattedAddress);
                    props.setDestinationData({ lat: parseFloat(x.lat), lng: parseFloat(x.lng) })
                  }
                  else {
                    handleClickSnack()
                  }
                }}>
                  <NearMeIcon style={{ color: 'orange' }} />
                </IconButton>
              </Tooltip>

            </ListItem>
          ))

          }

        </List>
      </Collapse>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: '100%' }}>
          {language == 'he' ? 'אין אפשרות להשתמש בחיפוש השמור הזה כי לא נשמר בו כתובת' : 'It is not possible to use this saved search because no address has been saved in it'}
        </Alert>
      </Snackbar>


    </List>
  );
}
