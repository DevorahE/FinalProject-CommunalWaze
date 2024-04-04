import { Button, TextareaAutosize } from '@mui/material';
import * as React from 'react';
import {  useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import InfoAccessible from '../Style/InfoAccessible';
import { usePlacesWidget } from "react-google-autocomplete";
import { CssTextField } from "../Style/CssTextField";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import { Stack, Typography } from '@mui/material';
import 'dayjs/locale/de';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import { SetRenew } from '../../Redux/Actions';



const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
      color: 'orange',
    },
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {

  value: PropTypes.any,
};

const MY_KEY = 'AIzaSyBzUC69LvNgyA1vnxrxw4qiOobDcaWS-J0'
export const Report = () => {
  let today = dayjs()
  const [categories, setCategories] = React.useState([])
  let dispatch = useDispatch()
  let myUser = useSelector(x => x.user)

  let language = useSelector(x => x.language)

  const [showSuccess, setShowSuccess] = React.useState(false)
  const [category, setCategory] = React.useState(-1);
  const [newReport, setNewReport] = React.useState({})
  const [checked, setChecked] = React.useState(false);
  const [valueDateStart, setValueDateStart] = React.useState(today);
  const [valueDateEnd, setValueDateEnd] = React.useState(today);
  const [message, setMessage] = React.useState('')
  const [colorMessage, setColorMessage] = React.useState('')
  const[progress, setProgress] = React.useState(false)

  const location = useLocation();
  const report = location.state;

  const handleChange = (event) => {
    setChecked(event.target.checked);

    debugger;

    if (event.target.checked) {
      setNewReport({ ...newReport, dateStart: today.toJSON(), dateEnd: today.toJSON(), temporary: event.target.checked })
    }
    else
      setNewReport({ ...newReport, temporary: false })
    return true
  };



  React.useEffect(() => {
    console.log(report)
    console.log(myUser);
    if (report) {
      setNewReport({
        ...newReport, content: report.content, dateEnd: report.dateEnd, dateStart: report.dateStart,
        formattedAddress: report.formattedAddress, idCategory: report.idCategory, lat: report.lat, lng: report.lng,
        temporary: report.temporary, userId: report.userId
      })
      setCategory(report.idCategory)
      setChecked(report.temporary)

      if (report.temporary) {

        var d = new Date(report.dateStart)
        setValueDateStart(dayjs(d))
        var d2 = new Date(report.dateEnd)
        setValueDateEnd(dayjs(d2))


      }
    }
    else if (myUser.firstName != undefined) {
      setNewReport({ ...newReport, userId: myUser.userId })
    }

    axios.get('https://localhost:7071/api/ReportsCategory').then(x => setCategories(x.data))


  }, [myUser, location])

  const { ref: materialRef1 } = usePlacesWidget({
    apiKey: MY_KEY,
    onPlaceSelected: (place) => {
      const address = place.formatted_address.toString();
      const lat = place.geometry.location.lat().toString();
      const lng = place.geometry.location.lng().toString();
      setNewReport(newReport => ({ ...newReport, formattedAddress: address, lat: lat, lng: lng }))

    },
    //מראה של התיבת טקסט
    options: {
      types: ['address'],
      fields: ['formatted_address', 'geometry.location'],
    },


  })

  const notEmpty = () => {
    if (newReport.formattedAddress == '' || newReport.content == "" ||
      newReport.category == -1 || myUser.userId == undefined) {
      setShowSuccess(true)

      if (language == 'he')
        setMessage('חובה להכניס כתובת, תוכן וקטגוריה')
      else
        setMessage('Address, content and category must be entered')
      setColorMessage('red'); console.log(newReport);
      return false;
    }
    setMessage('')


    if (!report) {
      setProgress(true)
      axios.put('https://localhost:7071/api/Report', newReport).then(x => {
        setProgress(false)
        setShowSuccess(true)

        if (language == 'he')
          setMessage('נוסף בהצלחה, ישלח לכם מייל לכתובת מייל שאיתה נכנסת לאתר')
        else
          setMessage('Added successfully, an email will be sent to the email address you entered the website with')

        dispatch(SetRenew(true))
        setColorMessage('green')
        axios.get(`https://localhost:7071/api/SendEmail/EmailAddReport/${myUser.eMail}/${language}`).then(x => {
          console.log(x.data);
        })
      }).catch(e => console.log(e))
    }
    else {

      axios.post(`https://localhost:7071/api/Report/update/${report.codeReport}`, newReport).then(x => {
        setShowSuccess(true)
        if (language == 'he')
          setMessage('עודכן בהצלחה')
        else
          setMessage('Successfully updated')
        dispatch(SetRenew(true))
        setColorMessage('green')
      })
    }


    return true
  }




  return <>
    <div style={{ textAlign: 'center' }}>

      {myUser.firstName && <div>

        <CssTextField label={language == 'he' ? 'מקום הדיווח' : 'Place of reporting'} id="custom-css-outlined-input" defaultValue={report && report.formattedAddress}
          inputRef={materialRef1} style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '25px' }}
        />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
          <InfoAccessible sentence={language == 'he' ? 'הכנס את מקום הדיווח' : 'Enter the place of reporting'} /></div>

        <TextareaAutosize defaultValue={newReport.content} style={{ borderColor: 'orange', marginLeft: '20px', fontFamily: 'inherit', width: '19em', height: '10em' }} placeholder={language == 'he' ? 'כתב את הדיווח' : 'Write the report'} onChange={(e) => { setNewReport({ ...newReport, content: e.target.value }) }}></TextareaAutosize>


        <p style={{ color: 'black', fontSize: '15px', marginBottom: '5px', textAlign: 'center', marginTop: '25px' }}>
          {language == 'he' ? 'איזה סוג דיווח ברצונך לדווח עליו? בחר/י סוג אחד' : 'What type of report do you want to report? Choose one type:'}</p>
        <div style={{ textAlign: 'center', marginLeft: '70px' }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={category}
            name="radio-buttons-group"
            onChange={(e) => { setCategory(e.target.value); setNewReport({ ...newReport, idCategory: parseInt(e.target.value) }) }}
          >
            {categories && categories.map(x =>

              <FormControlLabel key={x.idCategory} value={x.idCategory} label={language == 'he' ? x.nameCategory : x.nameCategoryEn} control={<Radio sx={{ '&.Mui-checked': { color: 'orange' } }} />} color='orange' />
            )}
          </RadioGroup>

        </div>
        <div style={{ marginTop: '15px' }}>

          <p style={{ color: 'black', fontSize: '15px', marginBottom: '5px', textAlign: 'center', marginTop: '25px' }}>
            {language == 'he' ? 'האם ברצונך לדווח על דיווח קבוע או זמני' : 'Do you want to report a permanent or temporary report?'}</p>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: '60px' }}>
            {checked && <Typography>{language == 'he' ? 'זמני' : 'Temporary'}</Typography>}
            {!checked && <Typography>{language == 'he' ? 'קבוע' : 'Fixed'}</Typography>}
            <Switch checked={checked} color="warning" onChange={handleChange} />
            <br /><br />
          </Stack>
          {newReport.temporary && <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">



              <MobileDatePicker value={valueDateStart} minDate={today} onChange={(newValue) => { setValueDateStart(newValue); setNewReport({ ...newReport, dateStart: newValue.toJSON() }) }}
                label={language == 'he' ? 'תאריך התחלה' : 'Start Date'} />
              <br /><br />
              <KeyboardDoubleArrowDownIcon sx={{ textAlign: 'center' }} />
              <br /><br />
              <MobileDatePicker value={valueDateEnd} minDate={today} onChange={(newValue) => { setValueDateEnd(newValue); setNewReport({ ...newReport, dateEnd: newValue.toJSON() }) }}
                label={language == 'he' ? 'תאריך הסןף' : 'End Date'} />

            </LocalizationProvider>

          </div>}
        </div>
        <br />
        <Button variant="contained" style={{ margin: "20px", backgroundColor: "orange", marginLeft: "75px" }}
          onClick={() => { notEmpty() }}
        >

          {language == 'he' ? 'שליחה' : 'Send'}
        </Button>
      </div>}
      {progress && 
        <CircularProgress  style={{color:'orange', margin:'5px'}}/>
     }
      {showSuccess && <div style={{ color: colorMessage, margin: '10px' }}>{message}</div>}
    </div>
  </>
}