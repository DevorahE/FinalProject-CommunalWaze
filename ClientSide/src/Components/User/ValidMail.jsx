import { useState } from "react"
import { CssTextField } from "../Style/CssTextField"
import { Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { ConnectUser } from "../../Redux/Actions"
import { useLocation, useNavigate } from "react-router-dom"
import InfoAccessible from "../Style/InfoAccessible"
import axios from "axios"

export const ValidMail = () => {

  const [code, setCode] = useState()
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let language = useSelector(x => x.language)

  const location = useLocation();
  const state = location.state;

  const num = state.num;
  const user = state.user

  const verify = () => {
    if (code == num) {
      axios.put('https://localhost:7071/api/User/add', user).then(x => {
        dispatch(ConnectUser(x.data))
        navigate('/RoutePlanning')
        setShow(false)

        axios.put(`https://localhost:7071/api/SaveSearch`, { userId: x.data.userId, lat: '', lng: '', formattedAddress: '', nameSearch: language == 'he' ? 'בית' : 'Home' })
        axios.put(`https://localhost:7071/api/SaveSearch`, { userId: x.data.userId, lat: '', lng: '', formattedAddress: '', nameSearch: language == 'he' ? 'עבודה' : 'Work' })
      });

    }
    else {
      if (language == 'he')
        setError('הסיסמא אינה תקינה')
      else
        setError("The password isn't valid")
      setShow(true)
    }
  }

  return <>
    <div style={{ textAlign: 'center' }}>

      <p style={{ color: 'black' }}>{language == 'he' ? 'הכנס את הסיסמא שקבלת במייל' : 'Enter the password you received in the email'}</p>

      <CssTextField label={language == 'he' ? 'קוד אישור' : 'Confirmation code'} id="custom-css-outlined-input"
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '245px' }} />

      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
        <InfoAccessible sentence={language == 'he' ? 'נשלח אליך קוד אישור במייל שרשום ברישום לאתר' : 'We will send you a confirmation code to the email listed in the website registration'} /></div>

      <Button variant="contained" style={{ backgroundColor: "orange", margin: "15px" }}
        onClick={() => { verify() }}>
        {language == 'he' ? 'שליחה' : 'Send'}
      </Button>
      {show && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  </>
}
