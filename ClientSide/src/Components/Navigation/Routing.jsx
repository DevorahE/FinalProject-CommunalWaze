import { BrowserRouter, Route, Routes } from "react-router-dom"
import { SimpleMap } from "../GoogleMaps/Map"
import { Register } from "../User/Register"
import { Login } from "../User/Login"
import { RoutePlanning } from "../GoogleMaps/RoutePlanning"
import { Report } from "../Report/Report"
import { ForgetPassword } from "../User/ForgetPassword"
import { NotConnectReport } from "../Report/NotConnectReport"
import { ValidMail } from "../User/ValidMail"
import { DetailsUser } from "../User/DetailsUser"
import { EditSaveSearch } from "../SaveSearch/EditSaveSearch"


export const Routing = () => {
  return <>
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<SimpleMap></SimpleMap>}>
          <Route path="/Register" element={<Register></Register>}></Route>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route path="/RoutePlanning" element={<RoutePlanning></RoutePlanning>}></Route>
          <Route path="/Report" element={<Report></Report>}></Route>
          <Route path="/Not-connect-report" element={<NotConnectReport></NotConnectReport>}></Route>
          <Route path="/EditReport" element={<Report></Report>} ></Route>
          <Route path="/ForgetPassword" element={<ForgetPassword></ForgetPassword>}></Route>
          <Route path="/DetailsUser" element={<DetailsUser></DetailsUser>}></Route>
          <Route path="/ValidMail" element={<ValidMail></ValidMail>}></Route>
          <Route path="/EditSaveSearch/:place" element={<EditSaveSearch></EditSaveSearch>}></Route>
          <Route path="/AddSaveSearch" element={<EditSaveSearch></EditSaveSearch>}></Route>

        </Route>
      </Routes>

    </BrowserRouter>
  </>
}