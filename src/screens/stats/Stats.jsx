import { AreaTop } from "../../components";
import ConsentFormBarChart from "../../components/consentFormChart/ConsentFormChart";

export default function Stats() {
  const data = [
    { date: '2024-06-01', admin: 'Admin1', createdForms: 5 },
    { date: '2024-07-02', admin: 'Admin1', createdForms: 7 },
    { date: '2024-06-02', admin: 'Admin1', createdForms: 3 },
    { date: '2024-06-03', admin: 'Admin1', createdForms: 6 },
    { date: '2024-08-02', admin: 'Admin1', createdForms: 9 },
    { date: '2024-06-04', admin: 'Admin1', createdForms: 70 },
    { date: '2025-01-07', admin: 'Admin1', createdForms: 22 },
    { date: '2025-01-08', admin: 'Admin1', createdForms: 22 },
    { date: '2025-01-09', admin: 'Admin1', createdForms: 22 },
    { date: '2025-01-10', admin: 'Admin1', createdForms: 22 },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22 },
  ];

  return (
    <div className="content-area">
      <AreaTop title="Detailed Stats" />
      <div className="container consentForm p-5">
        <form className="row g-3">
          <ConsentFormBarChart 
            data={data} 
            adminEmail="Admin1" 
          />
        </form>
      </div>
    </div>
  );
}
