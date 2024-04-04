import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { CssTextField } from '../Style/CssTextField';
import InfoAccessible from '../Style/InfoAccessible';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectUser } from '../../Redux/Actions';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';



const CssTextPassword = styled(FormControl)({
  '& label.Mui-focused': {
    color: 'orange',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'orange',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'orange',
    },
    '&:hover fieldset': {
      borderColor: 'orange',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'orange',
    },
  },
});

//This is a Register Component 
export const Register = () => {
  const [FName, setFName] = React.useState("")
  const [LName, setLName] = React.useState("")
  const [password, setPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")
  const [newUser, setNewUser] = React.useState({})
  const [showButton, setshowButton] = React.useState("")
  const [showb, setShowb] = React.useState(false)
  const [passwordVerify, setPasswordVerify] = React.useState("")
  const [updateEmail, setupdateEmail] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [show, setShow] = React.useState(false)
  const [showEmail, setShowEmail] = React.useState(false)
  const[progress, setProgress] = React.useState(false)

  const myUser = useSelector(x => x.user)
  let language = useSelector(x => x.language)
  let dispatch = useDispatch()

  const nav = useNavigate()

  //mui
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {

    if (myUser.userId != undefined) {
      debugger
      if (language == 'he')
        setshowButton("לשמירת השינויים")
      else
        setshowButton("Save changes")
      setShowb(true)

      setFName(myUser.firstName)
      setLName(myUser.lastName)
      setPassword(myUser.password)
      setPasswordVerify(myUser.password)
      setEmail(myUser.eMail)
      setupdateEmail(myUser.eMail)
    }

    else {
      if (language == 'he')
        setshowButton("הרשמה")
      else
        setshowButton("Register")
    }

  }, [myUser])

  //בדיקת מייל
  function isValidEmail(email1) {

    if (/\S+@\S+\.\S+/.test(email1) == false) {
      setShowEmail(true)
    }
    else {
      setShowEmail(false)
    }
  }
  //בדיקת שדות החובה שאינם ריקים
  const notEmpty = () => {

    if (email == "" || password == "" || FName == "" || LName == "" || showEmail == true) {
      debugger
      if (language == 'he')
        setError("חובה למלא את כל השדות")
      else
        setError("All fields must be filled in")
      setShow(true)
      return;
    }

    if (password !== passwordVerify) {

      if (language == 'he')
        setError("הכנסת סיסמאות שאינם זהות")
      else
        setshowButton("Using passwords that are not identical")
      setShow(true)
      return;
    }

    else {
      setNewUser({ FName, LName, password, email })

      setError("")
      setShow(false)
      if (showButton == "הרשמה" || showButton == 'Register') {
        axios.get(`https://localhost:7071/api/User/ExistEmail/${email}`).then(x => {
          if (x.data == true) {

            if (language == 'he')
              setError("המייל שהכנסת כבר קיים במערכת")
            else
              setError("The email you entered already exists in the system")
            setShow(true)
          }
          else {
            setProgress(true)
            const num = (Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000).toString()
            axios.get(`https://localhost:7071/api/SendEmail/EmailRegister/${email}/${num}/${language}`).then(y =>
              nav('/ValidMail', {
                state: {
                  num: num, user: {
                    firstName: FName, lastName: LName, password: password, eMail: email
                  }
                }
              }))
          }
        })


      }
      else {

        axios.post(`https://localhost:7071/api/User/update/${updateEmail}`,
          { firstName: FName, lastName: LName, password: password, eMail: email }
        ).then(x => {

          dispatch(ConnectUser(x.data))
          nav('/RoutePlanning')
        })
      }

    }
  }


  return (

    <div style={{ textAlign: 'center', marginTop: 5 }}>
      {show && <div style={{ color: 'red', margin: '10px' }}>{error}</div>
      }
      {showEmail && <div style={{ color: 'red', margin: '10px' }}>{language == 'he' ? 'הכנס מייל תקין' : 'Enter a valid email'}</div>
      }
      <CssTextField label={language == 'he' ? 'שם פרטי' : 'First Name'} id="custom-css-outlined-input" defaultValue={myUser.firstName}
        onChange={(e) => { setFName(e.target.value) }}

        style={{ width: '245px' }}></CssTextField>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? ' שדה חובה ' : 'Required field'} /></div>

      <br></br><br></br>
      <CssTextField label={language == 'he' ? 'שם משפחה' : 'Last Name'} id="custom-css-outlined-input"

        defaultValue={myUser.lastName}
        onChange={(e) => { setLName(e.target.value) }}
        style={{ width: '245px' }}></CssTextField>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'שם משפחה' : 'Last Name'} /></div>

      <br></br><br></br>
      <CssTextField label={language == 'he' ? 'מייל' : 'Email'} id="custom-css-outlined-input" defaultValue={myUser.eMail}
        onBlur={(e) => { isValidEmail(e.target.value) }}
        onChange={(e) => { setEmail(e.target.value) }}
        style={{ width: '245px' }}></CssTextField>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'הכנס מייל תקין' : 'Enter a valid mail'} /></div>

      <br></br><br></br>
      <CssTextPassword type={'password'} onChange={(e) => { setPassword(e.target.value) }}>
        <InputLabel htmlFor="outlined-adornment-password"   > {language == 'he' ? 'סיסמא' : 'Password'}</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          defaultValue={myUser.password}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label={language == 'he' ? 'סיסמא' : 'Password'}
        />
      </CssTextPassword>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'הכנס את סיסמאתך' : 'Enter your password'} /></div>
      <br></br><br></br>
      <CssTextPassword type={'password'} onChange={(e) => { setPasswordVerify(e.target.value) }}>
        <InputLabel htmlFor="outlined-adornment-password"   >{language == 'he' ? 'אימות סיסמא' : 'Confirm Password'}</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          defaultValue={myUser.password}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label={language == 'he' ? 'אימות סיסמא' : 'Confirm Password'}
        />
      </CssTextPassword>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'הכנס שוב את סיסמאתך לאימות הסיסמא' : 'Re-enter your password Password verification'} /></div>


      <div>
        <br></br>
        <Stack direction="row" spacing={2}>

          <Button variant="contained" style={{ backgroundColor: "orange", marginLeft: "90px" }}
            onClick={() => { notEmpty() }}>
            {showButton}
          </Button>
         
        </Stack>
        {progress && 
                  <CircularProgress  style={{color:'orange', margin:'5px'}}/>
          }
      </div>
    </div>
  );
}