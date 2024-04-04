import { Avatar, Box, Tooltip } from "@mui/material";
import "flag-icons/css/flag-icons.min.css";
import { useDispatch } from "react-redux";
import { SetLanguage } from "../../Redux/Actions";

export const ChooseLanguage = () => {
    let dispatch = useDispatch()
    return <>
        <div style={{ backgroundColor: 'white', borderRadius: ' 5px', }}>
            <Tooltip title="English">
                <div style={{ display: 'inline-block', margin: 3 }} onClick={() => { dispatch(SetLanguage('en')) }}>
                    <span className="fi fi-us"></span>
                </div>
            </Tooltip>
            <Tooltip title="עברית">
                <div style={{ display: 'inline-block', margin: 3 }} onClick={() => { dispatch(SetLanguage('he')) }}>
                    <span className="fi fi-il"></span>
                </div>
            </Tooltip>
        </div>
    </>
}