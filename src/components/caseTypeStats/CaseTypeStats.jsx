import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './caseTypeStats.css';

Chart.register(...registerables);

const CaseTypeStats = ({ data, adminEmail, caseTypes }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  console.log(caseTypes)


  useEffect(() => {
    const filtered = data?.filter(entry =>
      entry.admin === adminEmail &&
      (selectedCaseType === 'all' || entry.caseType === selectedCaseType) &&
      moment(entry.date).isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), undefined, '[]')
    );
    setFilteredData(filtered);
  }, [startDate, endDate, selectedCaseType, data, adminEmail]);

  const generateChartData = (filteredData) => {
    const groupedData = filteredData.reduce((acc, entry) => {
      const date = moment(entry.date).format('YYYY-MM-DD');
      acc[date] = (acc[date] || 0) + entry.cases;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const dataPoints = Object.values(groupedData);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases',
        data: dataPoints,
        backgroundColor: '#36A2EB',
      }]
    };
  };

  const chartData = generateChartData(filteredData);

  return (
    <div>
      <h2 className='mb-2 pb-2'>Case Type Distribution</h2>
      <div className='d-flex justify-content-between'>
        <div className="">
          <label className='me-3'>Start Date: </label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
        <div className="">
          <label className='me-3'>End Date: </label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>
      <div className="mt-3 w-100 d-flex justify-content-between">
        <label className='me-3' style={{minWidth:"81px"}}>Case Type: </label>
        <select className='w-100' value={selectedCaseType} onChange={(e) => setSelectedCaseType(e.target.value)}>
          <option value="all">All</option>
          {caseTypes?.map((caseType, index) => (
            <option key={index} value={caseType}>{caseType}</option>
          ))}
        </select>
      </div>
      <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default CaseTypeStats;
