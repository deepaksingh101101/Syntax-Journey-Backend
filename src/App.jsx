import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound} from "./screens";
import {Login} from "./screens"
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PrivateComponent from './middlewares/PrivateComponent'

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
            <Route path="/createCourse" element={<Dashboard />} />
          </Route>

          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
