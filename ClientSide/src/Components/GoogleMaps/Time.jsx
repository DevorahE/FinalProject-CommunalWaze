import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Avatar } from '@mui/material';
import { useEffect } from 'react';


export const Time = (props) => {
    useEffect(x=>{
        console.log(props.directions);
    }, [])
    return <>
        <div style={{ borderRadius: ' 5px', backgroundColor: 'white' }}>

            <Avatar sx={{ bgcolor: 'orange' }}>
                <AccessTimeIcon />

            </Avatar>
            {props.directions.routes[0].legs.map(x =>
                <div>{x.duration.text}</div>

            )}
        </div>
    </>
}
