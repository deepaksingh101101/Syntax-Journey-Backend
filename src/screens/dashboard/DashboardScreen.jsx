import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";
import ConsentForm from "../../components/consentForm/ConsentForm";
import "./consentForm.css"
const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop title='Consent Form'/>
      <ConsentForm/>
    </div>
   
  );
};

export default Dashboard;
