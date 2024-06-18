import { useEffect, useState } from "react";
import { AreaTop } from "../../components";
import CaseTypeStats from "../../components/caseTypeStats/CaseTypeStats";
import ConsentFormBarChart from "../../components/consentFormChart/ConsentFormChart";
import Patients from "../../components/patients/Patients";
import { getApi } from "../../helpers/requestHelpers";
import AgeGroup from "../../components/ageGroup/AgeGroup";

export default function Stats() {
  const data = [
    { date: '2024-06-01', admin: 'Admin1', createdForms: 5, gender: 'male' },
    { date: '2024-07-02', admin: 'Admin1', createdForms: 7, gender: 'female' },
    { date: '2024-06-02', admin: 'Admin1', createdForms: 3, gender: 'male' },
    { date: '2024-06-03', admin: 'Admin1', createdForms: 6, gender: 'other' },
    { date: '2024-08-02', admin: 'Admin1', createdForms: 9, gender: 'female' },
    { date: '2024-06-04', admin: 'Admin1', createdForms: 70, gender: 'male' },
    { date: '2025-01-07', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-01-08', admin: 'Admin1', createdForms: 22, gender: 'female' },
    { date: '2025-01-09', admin: 'Admin1', createdForms: 22, gender: 'female' },
    { date: '2025-01-10', admin: 'Admin1', createdForms: 22, gender: 'other' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
   { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
  ];

  const ageData = [
    {date: '2024-06-01', age: '1-17', ageType: 'child', caseType: 'type1', cases: 10 },
    {date: '2024-06-01', age: '18-40', ageType: 'adult', caseType: 'type1', cases: 1 },
    {date: '2024-06-01', age: '41-60', ageType: 'middleAge', caseType: 'type1', cases: 22 },
    {date: '2024-06-01', age: '61-100', ageType: 'oldAge', caseType: 'type1', cases: 10 },
    {date: '2024-07-01', age: '1-17', ageType: 'child', caseType: 'type1', cases: 10 },
    {date: '2024-07-01', age: '18-40', ageType: 'adult', caseType: 'type1', cases: 1 },
    {date: '2024-07-01', age: '41-60', ageType: 'middleAge', caseType: 'type1', cases: 22 },
    {date: '2024-07-01', age: '61-100', ageType: 'oldAge', caseType: 'type1', cases: 10 },
 
  ];




  const [allCaseType, setAllCaseType] = useState()

  const getAllcaseType = async () => {
    let allCase = await getApi("get", "/api/template/getAllCaseType")

    setAllCaseType(allCase?.data?.caseType)

}

useEffect(() => {
  // Fetch case types when component mounts
  getAllcaseType();

  // Set up form validation

}, []);

  const data2 = [
    { date: '2024-06-01', admin: 'Admin1', caseType: 'type1', cases: 10 },
    { date: '2024-06-02', admin: 'Admin1', caseType: 'type1', cases: 1 },
    { date: '2024-06-03', admin: 'Admin1', caseType: 'type1', cases: 22 },
    { date: '2024-07-02', admin: 'Admin1', caseType: 'type1', cases: 10 },
    { date: '2024-08-02', admin: 'Admin1', caseType: 'type1', cases: 2 },
    { date: '2025-01-07', admin: 'Admin1', caseType: 'type1', cases: 11 },
  ];

  return (
    <div className="content-area">
      {/* <AreaTop title="Detailed Stats" /> */}
      <div className="container consentForm p-5">
        <form className="row g-3">
          <ConsentFormBarChart 
            data={data} 
            adminEmail="Admin1" 
          />
        </form>
        <form className="row chart-container mt-5 g-3">
          <Patients 
            data={data} 
            adminEmail="Admin1" 
          />
        </form>

<form className="row mt-5 g-3">
        <CaseTypeStats 
          data={data2} 
          adminEmail="Admin1" 
          caseTypes={allCaseType}
        />
      </form>
<form className="row mt-5 g-3">
        <AgeGroup 
          ageData={ageData}
        />
      </form>

      </div>
    </div>
  );
}
