import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export const NotConnectReport = () => {
    let language = useSelector(x => x.language)

    return <>
        <div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'black', margin: '20px', textAlign: 'center' }}>
                    {language == 'he' ? 'אין אפשרות לכתוב דיווח אם אינך מחובר' : 'Logging in is necessary to write a report'}</div>
                <Link style={{ color: 'orange', margin: '20px', textAlign: 'center' }} to='/Login'>{language == 'he' ? 'להתחברות' : 'To log in'}</Link>
            </div>

        </div>
    </>
}
