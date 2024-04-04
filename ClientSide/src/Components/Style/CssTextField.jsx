import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'orange',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'orange',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'orange',
        },
        '&:hover fieldset': {
            borderColor: 'orange',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'orange',
        },
    },
});