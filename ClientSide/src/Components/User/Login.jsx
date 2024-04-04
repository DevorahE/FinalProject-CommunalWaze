import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import { CssTextField } from '../Style/CssTextField';
import InfoAccessible from '../Style/InfoAccessible';
import { Link, useNavigate } from 'react-router-dom';
import { CssTextPassword } from '../Style/CssTextPassword';
import { ConnectUser } from '../../Redux/Actions';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';


export const Login = () => {

  let dispatch = useDispatch()
  let language = useSelector(x => x.language)

  const [show, setShow] = React.useState(false)
  const [showEmail, setShowEmail] = React.useState(false)
  const [error, setError] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const [showMessage, setShowMessage] = React.useState(false)
  const [message, setMessage] = React.useState("")

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const connect = (emailVal, passwordVal) => {
    axios.get(`https://localhost:7071/api/User/getById/${emailVal}/${passwordVal}`).then(x => {

      dispatch(ConnectUser(x.data))

      if (x.data.length == 0) {
        if (language == 'he')
          setMessage("שם המשתמש או הססמא לא נכונים , נסה שנית")
        else
          setMessage("The username or password is incorrect, try again.")
        setShowMessage(true)
      }

      else {
        if (language == 'he')
          setMessage("ברוך הבא")
        else
          setMessage("Welcome")
        setShowMessage(true)

      }

    })
  }

  const notEmpty = (emailVal, passwordVal) => {
    if (emailVal == "" || passwordVal == "" || showEmail == true) {
      if (language == 'he')
        setError("חובה להכניס מייל תקין וסיסמא")
      else
        setError("You must enter a valid email and password")

      setShow(true)
      return false
    }
    else {
      setError("")
      setShow(false)
      return true
    }
  }

  function isValidEmail(email1) {

    if (/\S+@\S+\.\S+/.test(email1) == false) {
      setShowEmail(true)
    }
    else {
      setShowEmail(false)

    }
  }


  return (
    <div style={{ textAlign: 'center', marginTop: 5 }}>
      {show && <div style={{ color: 'red', margin: '10px' }}>{error}</div>
      }
      {showEmail && <div style={{ color: 'red', margin: '10px' }}>{language == 'he' ? 'הכנס מייל תקין' : 'Enter a valid mail'}</div>
      }
      <CssTextField label={language == 'he' ? 'מייל' : 'Mail'} id="custom-css-outlined-input" onBlur={(e) => { isValidEmail(e.target.value) }}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '245px', marginLeft:'5px' }}></CssTextField>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'נא להכניס את הכתובת מייל שאיתה נרשמת לאתר' : 'Enter the email address that you registered with'} /></div>

      <br></br><br></br>
      <CssTextPassword type={'password'} onChange={(e) => setPassword(e.target.value)} style={{marginLeft:'3.35%'}}>
        <InputLabel htmlFor="outlined-adornment-password">{language == 'he' ? 'סיסמא' : 'Password'}</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
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
        <InfoAccessible sentence={language == 'he' ? 'נא להכניס את סיסמאתך' : 'Enter your password'} /></div>

      <Link style={{ color: 'orange', margin: '20px' }} to='/ForgetPassword'>{language == 'he' ? ' שכחתי סיסמא' : 'I Forgot my password'}</Link>


      <div style={{ margin: "30px" }}>{language == 'he' ? 'אין לך חשבון ל' : "You haven't a account? To "}<Link style={{ color: 'black' }} to='/Register'>{language == 'he' ? 'יצירת חשבון חדש' : 'Create a new account'}</Link>
      </div>

      <Stack direction="row" spacing={2}>

        <Button variant="contained" disabled={message == 'Welcome' || message == 'ברוך הבא'} style={{ backgroundColor: "orange", marginLeft: "75px" }}
          onClick={(event) => {
            notEmpty(email, password) && connect(email, password)
          }}>

          {language == 'he' ? 'התחברות' : 'Log In'}
        </Button>

      </Stack>
      {showMessage && <div style={{ color: 'green', margin: '10px' }}>{message}</div>
      }

    </div>
  );
}