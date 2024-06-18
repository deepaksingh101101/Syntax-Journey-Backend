import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './patients.css';

Chart.register(...registerables);

const Patients = ({ data, adminEmail, ageData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = data?.filter(entry =>
      entry.admin === adminEmail &&
      moment(entry.date).isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), undefined, '[]')
    );
    setFilteredData(filtered);
  }, [startDate, endDate, data, adminEmail]);

  const generateChartData = (filteredData) => {
    const maleCount = filteredData.filter(entry => entry.gender === 'male').length;
    const femaleCount = filteredData.filter(entry => entry.gender === 'female').length;
    const otherCount = filteredData.filter(entry => entry.gender === 'other').length;

    return {
      labels: ['Male', 'Female', 'Other'],
      datasets: [{
        label: 'Patient Gender Distribution',
        data: [maleCount, femaleCount, otherCount],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      }]
    };
  };

  const chartData = generateChartData(filteredData);

  // Calculate counts for summary
  const maleCount = filteredData.filter(entry => entry.gender === 'male').length;
  const femaleCount = filteredData.filter(entry => entry.gender === 'female').length;
  const otherCount = filteredData.filter(entry => entry.gender === 'other').length;

  return (
    <div>
      <h2 className='mb-2 pb-2'>Patient Gender Distribution</h2>
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

      <div className="d-flex mt-3 justify-content-between align-items-center">
      <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
        <Pie data={chartData} />
      </div>
      {/* <div className="summary">
        <p><strong>Male:</strong> {maleCount}</p>
        <p><strong>Female:</strong> {femaleCount}</p>
        <p><strong>Other:</strong> {otherCount}</p>
      </div> */}


      <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
        <Pie data={chartData} />
      </div>
      {/* <div className="summary">
        <p><strong>Male:</strong> {maleCount}</p>
        <p><strong>Female:</strong> {femaleCount}</p>
        <p><strong>Other:</strong> {otherCount}</p>
      </div> */}
      </div>

    </div>
  );
};

export default Patients;
