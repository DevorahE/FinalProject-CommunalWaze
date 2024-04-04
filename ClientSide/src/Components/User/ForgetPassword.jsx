import React from "react"
import { CssTextField } from "../Style/CssTextField"
import InfoAccessible from "../Style/InfoAccessible"
import { Button } from "@mui/material"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import CircularProgress from '@mui/material/CircularProgress';


export const ForgetPassword = () => {

  const [error, setError] = React.useState("")
  const [show, setShow] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [color, setColor] = React.useState('red')
  const [progress, setProgress] = React.useState(false)

  let language = useSelector(x => x.language)

  function isValidEmail(email1) {

    if (/\S+@\S+\.\S+/.test(email1) == false) {
      setShow(true)
      setError("הכנס מייל תקין")
    }
    else {
      setShow(false)
      setError("")
    }
  }

  const notEmpty = (emailVal) => {
    if (emailVal == "" || show == true) {
      if (language == 'he')
        setError("חובה להכניס מייל תקין ")
      else
        setError("You must enter a valid email")
      setShow(true)
    }
    else {
      setError("")
      setShow(false)
      send()
    }
  }

  const send = () => {
    setProgress(true)
    axios.get(`https://localhost:7071/api/SendEmail/EmailForgetPassword/${email}/${language}`).then(x => {
      setProgress(false)  
      if (x.data == "This email don't exist") {
        if (language == 'he')
          setError('המייל שהכנסת אינו קיים')
        else
          setError("This email don't exist")
        setShow(true)
      }
      else {
        if (language == 'he')
          setError('נשלח לך מייל עם הסיסמא החדשה. עליך להתחבר עם הסיסמא החדשה')
        else
          setError("We will send you an email with the new password. You must log in with the new password.")
        setColor('green')
        setShow(true)
      }
    }
    )
  }

  return <div style={{ textAlign: 'center' }}>
    <p style={{ color: 'black' }}>
      {language == 'he' ? 'הכנס את המייל שלך על מנת שנשלח לך סיסמא חדשה' : 'Enter your email in order to send you a new password.'}</p>

    {show && <div style={{ color: color, margin: "10px" }}>{error}</div>}

    {show && (error === 'המייל שהכנסת אינו תקין' || error == "This email don't exist") && <Link style={{ color: 'orange', margin: '20px', textAlign: 'center' }} to='/Register'>{language == 'he' ? 'להרשמה' : 'To register'}</Link>}

    <CssTextField label={language == 'he' ? 'מייל' : 'Mail'} id="custom-css-outlined-input" onBlur={(e) => { isValidEmail(e.target.value) }}
      onChange={(e) => setEmail(e.target.value)}
      style={{ width: '245px' }}></CssTextField>

    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
      <InfoAccessible sentence={language == 'he' ? 'נא להכניס את הכתובת מייל שאיתה נרשמת לאתר' : 'Enter the email address that you registered with'} /></div>

    <Button variant="contained" style={{ backgroundColor: "orange", margin: "15px" }}
      onClick={() => { notEmpty(email) }}>
      {language == 'he' ? 'שליחת סיסמא חדשה' : 'Send a new password'}
    </Button>
    <br></br>
    {progress && 
        <CircularProgress  style={{color:'orange', margin:'5px'}}/>
     }
  </div>
}