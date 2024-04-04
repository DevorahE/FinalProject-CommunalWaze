import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CategoryIcon from '@mui/icons-material/Category';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import FlagIcon from '@mui/icons-material/Flag';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AddPoint, DeletePoint, ExistPoint, SetAddRouteReport, SetDestination, SetOrigin } from '../../Redux/Actions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NearMeIcon from '@mui/icons-material/NearMe';
import StartIcon from '@mui/icons-material/Start';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';


//חלונית של פרטים של הדיווח
export const ReportDetails = (props) => {
  let dispatch = useDispatch()
  let language = useSelector(x => x.language)

  let nav = useNavigate()

  const sendPoint = (myLat, myLng) => {
    let point = { location: { lat: parseFloat(myLat), lng: parseFloat(myLng) }, stopover: true }
    debugger;

    dispatch(AddPoint(point))

  }

  const deletePoint = (myLat, myLng) => {
    let point = { location: { lat: parseFloat(myLat), lng: parseFloat(myLng) }, stopover: true }

    dispatch(DeletePoint(point))

  }


  function createData(icon, content) {
    return { icon, content };
  }


  const rows = [
    createData(<ContentPasteIcon sx={{ color: props.colorCategory }} />, props.content),
    createData(<EventNoteIcon sx={{ color: props.colorCategory }} />, props.data),
    createData(<HomeIcon sx={{ color: props.colorCategory }} />, props.formattedAddress),
    createData(<Button key={`delete${props.codeReport}`} color="error" variant="outlined" startIcon={<DeleteOutlineIcon />}
      onClick={() => deletePoint(props.lat, props.lng)}>
      {language == 'he' ? ' מחיקה מהמסלול' : 'Delete from the track'}
    </Button>,
      <Button key={`add${props.codeReport}`} color="secondary" variant="outlined" startIcon={<FlagIcon />}
        onClick={() => sendPoint(props.lat, props.lng)}>
        {language == 'he' ? 'לעבור כאן' : 'Pass here'}
      </Button>),
    createData(<Button key={`StartPoint${props.codeReport}`} sx={{ color: '#7CD330' }} variant="outlined" startIcon={<StartIcon />}
      onClick={() => {
        dispatch(SetOrigin({
          lat: parseFloat(props.lat),
          lng: parseFloat(props.lng),
          formattedAddress: props.formattedAddress
        }))
        dispatch(SetAddRouteReport(`origin${props.codeReport}`))
        nav('/RoutePlanning')
      }}>
      {language == 'he' ? 'הוספת כנקודת התחלה' : 'Add as a starting point'}
    </Button>,
      <Button key={`Destination${props.codeReport}`} sx={{ color: '#7CD330' }} variant="outlined" startIcon={<NearMeIcon />}
        onClick={() => {
          dispatch(SetDestination({
            lat: parseFloat(props.lat),
            lng: parseFloat(props.lng),
            formattedAddress: props.formattedAddress
          }))
          dispatch(SetAddRouteReport(`destination${props.codeReport}`))
          nav('/RoutePlanning')
        }}>
        {language == 'he' ? 'הוספת כיעד' : 'Add as a destination'}
      </Button>)
  ];

  return <>

    <TableContainer component={Paper} style={{ borderRadius: '22px' }}>
      <Table sx={{ width: 100 }} aria-label="simple table" key={`Table${props.codeReport}`}>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={`TableRow${row.content}`}

            >   {/** sx={{ '&:last-child td, &:last-child th': { border: 0 } }} */}
              <TableCell component="th" scope="row" key={`TableCell1${row.content}`}>
                {row.icon}
              </TableCell>
              <TableCell align="right" key={`TableCell2${row.content}`}>{row.content}</TableCell>

            </TableRow>
          ))}


        </TableBody>
      </Table>
    </TableContainer>

  </>
}