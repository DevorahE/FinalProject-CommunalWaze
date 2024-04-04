import ColorizeIcon from '@mui/icons-material/Colorize';
import PlaceIcon from '@mui/icons-material/Place';
import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SetColor } from '../../Redux/Actions';



export const ColorMaps = () => {
  const [categories, setCategories] = React.useState([])
  let dispatch = useDispatch()
  let language = useSelector(x => x.language)
  React.useEffect(() => {
    axios.get('https://localhost:7071/api/ReportsCategory').then(x => {
      setCategories(x.data)
    })
  }, [])
  const sendColor = (idColor) => {
    dispatch(SetColor(idColor))
  }

  return (
    <Box
      sx={{
        width: 153,
        height: 203,
        position: 'absolute',
        top: '15%',
        backgroundColor: 'beige',
        borderRadius: '20px'
      }}
    ><div style={{ textAlign: 'center' }}>{language == 'he' ? 'סוגי קטגוריות' : 'Types of categories'}
      </div>
      <br />
      {categories.map(x => <div onClick={() => sendColor(x.idCategory)} key={x.idCategory}>
        <PlaceIcon style={{ color: x.colorCategory }} key={x.idCategory}></PlaceIcon>
        {language == 'he' ? x.nameCategory : x.nameCategoryEn}<br></br>
      </div>
      )}

      <div onClick={() => sendColor(-1)}>{language == 'he' ? 'להצגת כל הקטגויות' : 'For viewing all categories'}</div>
    </Box>

  );
}
