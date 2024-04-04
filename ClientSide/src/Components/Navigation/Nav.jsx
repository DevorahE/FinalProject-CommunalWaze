import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { orange } from '@mui/material/colors';


export const Nav = () => {
  let myUser = useSelector(x => x.user)
  let language = useSelector(x => x.language)

  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(myUser);
  };

  const theme = createTheme({
    palette: {
      primary: { main: orange[700] }
    }
  });

  return (

    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 250 }}>
      <ThemeProvider theme={theme}>
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example"
          orientation="vertical"
          variant="scrollable"
          indicatorColor="primary"
          sx={{ borderRight: 1, borderColor: 'divider', height: "1000px", width: "300px" }}
        >

          <Tab key={"תכנון מסלול"} label={language == 'he' ? 'תכנון מסלול' : 'Route Planning'} className={"LinkTab"}
            component={Link} to={"/RoutePlanning"} />

          {myUser.firstName && <Tab key={"דיווח על תקלה"} label={language == 'he' ? 'דיווח קהילתי' : 'Community Reporting'} className={"LinkTab"}
            component={Link} to={"/Report"} />}

          {!myUser.firstName && <Tab key={"לא מחובר דיווח על תקלה"} label={language == 'he' ? 'דיווח קהילתי' : 'Community Reporting'} className={"LinkTab"}
            component={Link} to={"/Not-connect-report"} />}


          {!myUser.firstName && <Tab key={"התחברות"} label={language == 'he' ? 'התחברות ' : 'Log In'} className={"LinkTab"}
            component={Link} to={"/Login"} />}

          {myUser.firstName && <Tab key={"פרטי משתמש"} label={language == 'he' ? 'פרטי משתמש' : 'User Information'} className={"LinkTab"}
            component={Link} to={"/DetailsUser"} />}

        </Tabs>
      </ThemeProvider>
    </Box>
  );
}
