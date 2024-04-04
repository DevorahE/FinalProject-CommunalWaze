import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { GoogleMap, InfoBox, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { Nav } from "../Navigation/Nav";
import axios from "axios";
import { ReportDetails } from "../Report/ReportDetails";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import { SetRenew } from "../../Redux/Actions";
import { Time } from "./Time";
import { ColorMaps } from "../Report/ColorMaps";
import { ChooseLanguage } from "../User/ChooseLanguage";


export const SimpleMap = () => {

  const [reports, setReports] = React.useState([])
  const [selectedMarkerId, setSelectedMarkerId] = React.useState(-1);
  const [dataOrigin, setDataOrigin] = React.useState({})
  const [dataDestination, setDataDestination] = React.useState({})

  let myOrigin = useSelector(x => x.origin)
  let myDestination = useSelector(x => x.destination)
  let myListPoint = useSelector(x => x.point)
  let myTransport = useSelector(x => x.transport)
  let myColor = useSelector(x => x.color)
  let renew = useSelector(x => x.renew)
  let letsGo = useSelector(x => x.letsGo)

  let dispatch = useDispatch()

  const containerStyle = {
    width: '100%',
    height: '100vh'
  };

  const defaultProps = {
    center: { lat: 31.76713188478315, lng: 35.18456246668386 },
    zoom: 14
  };



  useEffect(() => {
    if (myColor == -1)
      axios.get('https://localhost:7071/api/Report').then(x => {
        setReports(x.data);
        dispatch(SetRenew(false))
      })
    else
      axios.get(`https://localhost:7071/api/Report/GetReportsByColor/${myColor}`).then(s => {
        setReports(s.data);
      })
    setDataOrigin({ lat: myOrigin.lat, lng: myOrigin.lng })
    setDataDestination({ lat: myDestination.lat, lng: myDestination.lng })
  }, [myOrigin, myDestination, myTransport, myListPoint, myColor, renew, letsGo])
  const [directions, setDirections] = React.useState(null);


  let count = React.useRef(0);
  //When running the function to search for a path, this function is called
  const directionsCallback = React.useCallback(res => {
    //If he found the way, the status is OK
    // (inserts all the points into the path) and therefore will insert the answer into the path
    console.log(myListPoint);
    if (res !== null) {
      if (res.status == 'OK' && count.current < 2) {
        count.current += 1;
        setDirections(res);
      }
      else {
        count.current = 0;
      }
    }
  }, [])
  //Properties of the road
  const directionsOptions = {
    origin: dataOrigin,
    destination: dataDestination,
    travelMode: myTransport,
    waypoints: myListPoint
  };

  return (
    // Important! Always set the container height explicitly 
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultProps.center}
        zoom={defaultProps.zoom}
        onClick={() => setSelectedMarkerId(-1)}

      >
        {
          letsGo &&
          <>
            {<DirectionsService options={directionsOptions} callback={directionsCallback} />}
            {directions && <DirectionsRenderer onLoad={console.log(directions)} directions={directions} options={{
              polylineOptions: { strokeColor: 'orange', strokeOpacity: 0.5, },
              suppressMarkers: true
            }} />}
          </>
        }
        {reports && reports.map(x => {
          return (<React.Fragment key={x.codeReport}>
            {/** Marker - Pins that show the reports*/}
            <Marker key={x.codeReport} position={{ lat: parseFloat(x.lat), lng: parseFloat(x.lng) }}
              onMouseOver={() => setSelectedMarkerId(x.codeReport)}
              icon={`http://maps.google.com/mapfiles/ms/icons/${x.colorCategory}-dot.png`}
            >
              {/*The details that appear when you go over the pin of the report*/}
              {selectedMarkerId === x.codeReport &&
                <InfoBox
                  key={x.codeReport} position={{ lat: parseFloat(x.lat), lng: parseFloat(x.lng) }}
                  options={{ closeBoxURL: '', enableEventPropagation: true }}

                ><React.Fragment key={x.codeReport}>
                    <ReportDetails codeReport={x.codeReport} data={x.data} content={x.content} nameCategory={x.nameCategory}
                      lat={x.lat} lng={x.lng} formattedAddress={x.formattedAddress} colorCategory={x.colorCategory}></ReportDetails></React.Fragment>
                </InfoBox>
              }
            </Marker>


          </React.Fragment>)
        })}

      </GoogleMap>

      <div style={{ display: 'flex', marginRight: '5px', marginLeft: '1200px', marginTop: '5%', position: 'absolute' }}>
        <ChooseLanguage />
      </div>

      {directions && (myDestination.lng !== 0) && (myDestination.lat !== 0) &&
        <div style={{ display: 'flex', marginRight: '5px', marginLeft: '1200px', marginTop: '17%', position: 'absolute' }}>
          <Time directions={directions}></Time>
        </div>}

      <div style={{ position: 'absolute', top: '8px', left: '16px' }}> <Nav></Nav> </div>
      <div style={{ position: 'absolute', top: '158px', left: '16px', backgroundColor: 'white', height: "400px", width: "300px", overflow: 'auto' }}>

        <Outlet></Outlet>
      </div>
      <div style={{ display: 'flex', marginRight: '5px', marginLeft: '1050px', marginTop: '25%', position: 'absolute' }}>
        <ColorMaps /></div>
    </div>
  );
}