import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound} from "./screens";
import {Login} from "./screens"
import {CreateTemplate} from "./screens"
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PrivateComponent from './middlewares/PrivateComponent'
import ConsentList from "./screens/consent/ConsentList";
import ViewConsent from "./screens/consent/ViewConsent";
import EditConsent from "./screens/consent/EditConsent";
import TemplateList from "./screens/Create-template/TemplateList";
import ViewTemplate from "./screens/Create-template/ViewTemplate";
import EditTemplate from "./screens/Create-template/EditTemplate";
import CreateAdmin from "./screens/admin/CreateAdmin";
import ViewAdmin from "./screens/admin/ViewAdmin";

function App() {
  

  

  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<Login/>}/>
          <Route element={<BaseLayout />}>
            <Route path="/x" element={<PageNotFound />} />
          </Route>

          <Route element={<PrivateComponent/>}> 
          <Route element={<BaseLayout />}>
            <Route path="/Das" element={<Dashboard />} />
            <Route path="/consentList" element={<ConsentList />} />
            <Route path="/viewConsent/:_id" element={<ViewConsent />} />
            <Route path="/editConsent/:_id" element={<EditConsent />} />
            <Route path="/create-template" element={<CreateTemplate/>} />
            <Route path="/templateList" element={<TemplateList/>} />
            <Route path="/viewTemplate/:_id" element={<ViewTemplate/>} />
            <Route path="/editTemplate/:_id" element={<EditTemplate/>} />
            <Route path="/createAdmin" element={<CreateAdmin/>} />
            <Route path="/viewAdmin" element={<ViewAdmin/>} />
          </Route>

          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
