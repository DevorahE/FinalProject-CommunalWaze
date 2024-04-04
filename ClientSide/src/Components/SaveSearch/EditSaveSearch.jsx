import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CssTextField } from '../Style/CssTextField';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import InfoAccessible from '../Style/InfoAccessible';
import { useParams } from 'react-router-dom';

export const EditSaveSearch = () => {
  let language = useSelector(x => x.language)

  const [addressData, setAddressData] = React.useState({lat: '', lng: '', formattedAddress:''})
  const [show, setShow] = useState(false)
  const [showHomeWork, setShowHomeWork] = useState(false)
  const [messageFinal, setMessageFinal] = useState('')
  const [saveSearch, setSaveSearch] = useState({})
  const [title, setTitle] = useState(language == 'he' ? 'חיפוש שמור חדש' : 'New save search')

  let myParams = useParams()
  let dispatch = useDispatch()


  let currentUser = useSelector(x => x.user)

  useEffect(() => {
    if (myParams.place != undefined) {
      axios.get(`https://localhost:7071/api/SaveSearch/GetByName/${myParams.place}/${currentUser.userId}`).then(x => {
        setSaveSearch(x.data)
        setTitle(language == 'he' ? 'עדכון חיפוש שמור' : 'Update save search')
        if (x.data.nameSearch == 'בית' || saveSearch.nameSearch == 'Home'
          || saveSearch.nameSearch == 'עבודה' || saveSearch.nameSearch !== 'Work') {
          setShowHomeWork(true)
        }
      })

    }
  }
    , [])

  const save = () => {
    if (myParams.place != undefined) {
      axios.post(`https://localhost:7071/api/SaveSearch/update/${myParams.place}/${currentUser.userId}`,
        { userId: currentUser.userId, lat: addressData.lat, lng: addressData.lng, formattedAddress: addressData.formattedAddress, nameSearch: saveSearch.nameSearch })
        .then(x => {
          console.log(x.data);
          setShow(true)
          setMessageFinal(language == 'he' ? 'עודכן בהצלחה' : 'Successfully updated')
        })
    }
    else {
      axios.put(`https://localhost:7071/api/SaveSearch`, { userId: currentUser.userId, lat: addressData.lat, lng: addressData.lng, formattedAddress: addressData.formattedAddress, nameSearch: saveSearch.nameSearch }).then(x => {
        console.log(x.data);
        setShow(true)
        setMessageFinal(language == 'he' ? 'התווסף בהצלחה' : 'Added successfully')
      })
    }
  }

  const { ref: materialRef } = usePlacesWidget({
    //apiKey: MY_KEY,
    onPlaceSelected: (place) => {
      const address = place.formatted_address.toString();
      const lat = place.geometry.location.lat().toString();
      const lng = place.geometry.location.lng().toString();
      setAddressData({
        lat: lat,
        lng: lng,
        formattedAddress: address
      });
      setSaveSearch(saveSearch => ({ ...saveSearch, formattedAddress: address }))
    },
    //מראה של התיבת טקסט
    options: {
      types: ['address'],
      fields: ['formatted_address', 'geometry.location'],
    }

  });

  return (<div style={{ textAlign: 'center' }}>


    <div style={{ color: 'orange', fontSize: 20, marginTop: 10, marginBottom: 20 }}>{title}</div>
    {showHomeWork &&
      <div style={{ color: 'orange', fontSize: 15, marginTop: 10 }}>{saveSearch.nameSearch}</div>}

    {!showHomeWork &&
      <div>
        <CssTextField value={saveSearch.nameSearch || ''} label={language == 'he' ? 'שם החיפוש השמור' : 'Name of the save search'} id="custom-css-outlined-input"
          onChange={e => setSaveSearch({ ...saveSearch, nameSearch: e.target.value })}
          style={{ width: '235px', margin: '10' }} />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
          <InfoAccessible sentence={language == 'he' ? 'נא הכנס את השם שברצונך לתת לחיפוש השמור' : 'Please enter the name you want to give the saved search'} /></div>
      </div>}
    <br /><br />
    <CssTextField label={language == 'he' ? 'כתובת' : 'Address'} id="custom-css-outlined-input"
      inputRef={materialRef} style={{ width: '235px', margin: '10' }}
      onChange={(e) => {
        setSaveSearch({ ...saveSearch, formattedAddress: e.target.value })
      }}
      value={saveSearch.formattedAddress || ''} />
    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
      <InfoAccessible sentence={language == 'he' ? 'נא הכנסת את כתובת החיפוש השמור' : 'Please enter the saved search address'} /></div>

    <br /><br />

    <Button variant="contained" style={{ backgroundColor: "orange", height: '35px', width: '50px' }}
      onClick={() => { save() }}>
      שמור
    </Button>
    {show && <div style={{ margin: 15, color: 'green' }}>{messageFinal}</div>}


  </div>
  );
}
