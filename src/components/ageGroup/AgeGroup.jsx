import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(...registerables);

const AgeGroup = ({ ageData }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredAgeData, setFilteredAgeData] = useState([]);

  useEffect(() => {
    filterAgeData();
  }, [startDate, endDate, ageData]);

  const filterAgeData = () => {
    const filtered = ageData?.filter(entry =>
      moment(entry.date).isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), undefined, '[]')
    );
    setFilteredAgeData(filtered);
  };

  const generateAgeChartData = (filteredAgeData) => {
    let aggregatedData = {};

    // Aggregate cases by ageType
    filteredAgeData.forEach(entry => {
      if (aggregatedData[entry.ageType]) {
        aggregatedData[entry.ageType] += entry.cases;
      } else {
        aggregatedData[entry.ageType] = entry.cases;
      }
    });

    // Prepare chart data format
    const labels = Object.keys(aggregatedData);
    const dataPoints = Object.values(aggregatedData);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases by Age Group',
        data: dataPoints,
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      }]
    };
  };

  const ageChartData = generateAgeChartData(filteredAgeData);

  return (
    <div>
      <h2 className='mb-2 pb-2'>Cases by Age Group</h2>
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

      <div style={{ width: '600px', height: '400px', margin: '20px auto' }}>
        <Bar data={ageChartData} options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age Groups'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of Cases'
              }
            }
          }
        }} />
      </div>
    </div>
  );
};

export default AgeGroup;
