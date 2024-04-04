import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Tabs } from '@mui/material';
import InfoAccessible from '../Style/InfoAccessible';
import { CssTextField } from '../Style/CssTextField';
import { usePlacesWidget } from "react-google-autocomplete";
import { useDispatch, useSelector } from 'react-redux';
import { SetAddRouteReport, SetDestination, SetLetsGo, SetOrigin, SetRenew, SetTransport } from '../../Redux/Actions';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Tab from '@mui/material/Tab';
import { SaveSearchs } from '../SaveSearch/SaveSearchs';


export const RoutePlanning = () => {
 
    //const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: MY_KEY, libraries: ['places'], });
    let dispatch = useDispatch()
    const [addressDataOrigin, setAddressDataOrigin] = React.useState({
        lat: null,
        lng: null,
    });
    const [addressDataDestination, setAddressDataDestination] = React.useState({
        lat: null,
        lng: null,
    });

    const [transport, setTransport] = React.useState('WALKING')
    const [origine, setOrigine] = React.useState("")
    const [destination, setDestinationL] = React.useState("")
    const [error, setError] = React.useState("")
    const [showError, setShowError] = React.useState(false)
    const [showRemove, setShowRemove] = React.useState(false)

    let currentUser = useSelector(x => x.user)
    let originRedux = useSelector(x => x.origin)
    let destinationRedux = useSelector(x => x.destination)
    let addRouteReport = useSelector(x => x.addRouteReport)


    React.useEffect(() => {
        if (addRouteReport != "") {
            if(addRouteReport.includes("origin")){
                setOrigine(originRedux.formattedAddress)
                setAddressDataOrigin({
                    lat: originRedux.lat,
                    lng: originRedux.lng,
                })
            }
            if(addRouteReport.includes("destination")){
               setAddressDataDestination({
                lat: destinationRedux.lat,
                lng: destinationRedux.lng,
            }) 
                setDestinationL(destinationRedux.formattedAddress)
            }
            
        }
    }, [addRouteReport])

    //REF כדי שישלים לנו אוטומטי את הכתובת
    const { ref: materialRef1 } = usePlacesWidget({
        //apiKey: MY_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            setOrigine(place.formatted_address);

            //קבלת ערכי lat lng
            const latitude = parseFloat(place.geometry.location.lat());
            const longitude = parseFloat(place.geometry.location.lng());
            setAddressDataOrigin({
                lat: +latitude,
                lng: +longitude,
            });

        },
        //מראה של התיבת טקסט
        options: {
            types: ['address'],
            fields: ['formatted_address', 'geometry.location'],
        }

    });
    const { ref: materialRef2 } = usePlacesWidget({
        // apiKey: MY_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            setDestinationL(place.formatted_address);
            const latitude = parseFloat(place.geometry.location.lat());
            const longitude = parseFloat(place.geometry.location.lng());
            setAddressDataDestination({
                lat: +latitude,
                lng: +longitude,
            });
        },
        options: {
            types: ['address'],
            fields: ['formatted_address', 'geometry.location'],
        }

    });

    const [valueTab, setValueTab] = React.useState(0);

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    let language = useSelector(x => x.language)
    //פונקציה כדי להפך את הכתובות
    const inverse = () => {
        let tempFormattedAdress = origine
        let tempAddressData = addressDataOrigin
        setOrigine(destination)
        setDestinationL(tempFormattedAdress)
        setAddressDataOrigin(addressDataDestination)
        setAddressDataDestination(tempAddressData)

    }
    const notEmpty = (origineVal, destinationVal) => {
        if (origineVal == "" || destinationVal == "") {
            if (language == 'he')
                setError("חובה להכניס נקודת מוצא ונקודת יעד")
            else
                setError("You must enter a starting point and a destination point")
            setShowError(true);
            return false;
        }
        else {
            setError("")
            setShowError(false)
            return true;
        }
    }
    const sendData = () => {
        dispatch(SetAddRouteReport(""))
        dispatch(SetOrigin(addressDataOrigin))
        dispatch(SetDestination(addressDataDestination))
        dispatch(SetTransport(transport))
        dispatch(SetLetsGo(true))
        setShowRemove(true)
    }
    const removeroute = () => {
        dispatch(SetDestination({ lat: 0, lng: 0, formattedAddress: '' }))
        dispatch(SetOrigin({
            lat: 0,
            lng: 0,
            formattedAddress: ''
        }))
        dispatch(SetTransport('DRIVING'))
        dispatch(SetLetsGo(false))
        setOrigine("")
        setDestinationL("")
        setAddressDataOrigin({
            lat: null,
            lng: null,
        })
        setAddressDataDestination({
            lat: null,
            lng: null,
        })
        setShowRemove(false)
    }
    const theme = createTheme({
        palette: {
            primary: { main: amber[300] }
        }
    });
    return (
        <>
            <div style={{ textAlign: 'center' }}>

                {showError && <p style={{ color: 'red' }}>{error}</p>}
                <ThemeProvider theme={theme}>
                    <Tabs sx={{ marginBottom: '25px', marginLeft: '10px' }} value={valueTab} onChange={handleChangeTab} aria-label="icon tabs example">
                        <Tab icon={<DirectionsWalkIcon />} aria-label="WALKING" onClick={() => setTransport("WALKING")} />
                        <Tab icon={<DirectionsCarIcon />} aria-label="DRIVING" onClick={() => setTransport("DRIVING")} />
                        <Tab icon={<DirectionsBikeIcon />} aria-label="BICYCLING" onClick={() => setTransport("BICYCLING")} />
                    </Tabs>
                </ThemeProvider>
                {//isLoaded &&
                    <CssTextField label={language == 'he' ? 'נקודת מוצא' : 'Starting point'} id="custom-css-outlined-input"
                        inputRef={materialRef1} value={origine} onChange={(e) => {
                            setOrigine(e.target.value)
                        }}
                    />}
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
                    <InfoAccessible sentence={language == 'he' ? 'מאיזה נקודה/מקום את/ה רוצה לצאת' : 'From which point/place do you want to leave'} /></div>
                <br></br>

                <div style={{ marginLeft: '240px', marginTop: '6px' }} onClick={() => {
                    inverse()
                }}>
                    <ImportExportIcon></ImportExportIcon>
                </div>

                {//isLoaded &&
                    <CssTextField label={language == 'he' ? 'נקודת יעד' : 'Destination point'} id="custom-css-outlined-input"
                        value={destination} onChange={(e) => setDestinationL(e.target.value)}
                        inputRef={materialRef2}
                    />}
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>
                    <InfoAccessible sentence={language == 'he' ? 'לאיזה נקודה/מקום את/ה רוצה להגיע' : 'What point/place do you want to go to'} /></div>
                <br></br><br></br>


                <Button variant="contained"
                    style={{ backgroundColor: "orange", marginLeft: "30px", marginTop: "30px" }}
                    onClick={() => { notEmpty(origine, destination) && sendData() }}>
                    {language == 'he' ? 'חיפוש' : 'Search'}
                </Button>

                {showRemove &&
                    <Button variant="contained"
                        style={{ backgroundColor: "orange", marginLeft: "50px", marginTop: "30px" }}
                        onClick={() => { removeroute() }}
                    >
                        {language == 'he' ? 'מחיקת המסלול' : 'Remove the route'}
                    </Button>
                }
                {currentUser.userId && <SaveSearchs setOriginData={setAddressDataOrigin} setDestinationData={setAddressDataDestination}
                    setOrigin={setOrigine} setDestination={setDestinationL}></SaveSearchs>}
            </div>
        </>
    );
}