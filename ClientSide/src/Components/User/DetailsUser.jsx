
import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Report';
import PlaceIcon from '@mui/icons-material/Place';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, ListItem, Popper, Tooltip, Typography } from '@mui/material';
import AlertDialogSlide from '../Style/AlertDialogSlide';
import { ConnectUser } from '../../Redux/Actions';
import { useState } from 'react';
export const DetailsUser = () => {

  const [open, setOpen] = React.useState(false);
  const [showButton, setShowButton] = React.useState(-1)
  const [listReport, setListReport] = React.useState([]);
  const [len, setLen] = React.useState();
  const myUser = useSelector(x => x.user)
  const [openAlert, setOpenAlert] = React.useState(-1)

  const handleClick = () => {
    setOpen(!open);
  };
  const [openPopper, setOpenPopper] = useState(0)
  const [anchorEl, setAnchorEl] = React.useState(null);

  let dispatch = useDispatch()
  let naviguate = useNavigate()
  const language = useSelector(x => x.language)
  useEffect(() => {

    axios.get(`https://localhost:7071/api/Report/GetReportsByUser/${myUser.userId}`).then(w => {

      setListReport(w.data)
      setLen(w.data.length)
    })

  }, [myUser, listReport])

  const clickButton = (codeReport) => {
    if (showButton != -1)
      setShowButton(-1)
    else
      setShowButton(codeReport)
  }
  let navigate = useNavigate()

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {language == 'he' ? 'פרטי משתמש' : 'User Information'}
        </ListSubheader>
      }
    >

      <Link style={{ color: 'black', textDecoration: 'none' }} to={'/Register'}>
        <ListItemButton >
          <ListItemIcon>
            <PersonIcon style={{color:'C4F599'}}></PersonIcon>
          </ListItemIcon>
          <ListItemText primary={language == 'he' ? 'פרטים אישיים' : 'Personal Information'} />
        </ListItemButton></Link>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ReportIcon style={{color:'C4F599'}}></ReportIcon>
        </ListItemIcon>
        <ListItemText primary={language == 'he' ? "הדיווחים שלי" : 'My reports'} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>


          {listReport.map((list) => (
            <ListItem sx={{ pl: 4 }} key={list.codeReport}>
              <ListItemIcon>
                <PlaceIcon style={{ color: list.colorCategory }} ></PlaceIcon>
              </ListItemIcon>
              {list.content}

              <Tooltip title={language == 'he' ? "מחיקת דיווח" : 'Deleting the report'} arrow>
                <IconButton key={`delete${list.codeReport}`} edge='end' onClick={() => { setOpenAlert(list.codeReport) }}>
                  <DeleteOutlineIcon style={{ color: 'red' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={language == 'he' ? "עדכון דיווח" : 'Update the report'} arrow>
                <IconButton key={`update${list.codeReport}`} edge='end' onClick={() => { navigate('/EditReport', { state: list }) }}>
                  <SettingsSuggestIcon style={{ color: 'orange' }} />
                </IconButton>
              </Tooltip>

              {openAlert == list.codeReport && <React.Fragment key={list.codeReport}>
                <AlertDialogSlide openButton={true} changeOpenAlert={setOpenAlert} code={list.codeReport} type={"DeleteReport"} /></React.Fragment>}

            </ListItem>
          ))}

        </List>
      </Collapse>
      <ListItemButton onClick={() => {
        dispatch(ConnectUser([]))
        naviguate('/Login')
      }}>
        <ListItemIcon>
          <LogoutIcon style={{color:'C4F599'}}/>
        </ListItemIcon>
        <ListItemText primary={language == 'he' ? "התנתקות" : 'Logging out'} />
      </ListItemButton>
    </List>
  );
}




