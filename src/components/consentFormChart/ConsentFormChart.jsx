import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(...registerables);

const ConsentFormBarChart = ({ data, adminEmail }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filtered = data.filter(entry =>
      entry.admin === adminEmail &&
      moment(entry.date).isBetween(moment(startDate).startOf('day'), moment(endDate).endOf('day'), undefined, '[]')
    );
    setFilteredData(filtered);
  }, [startDate, endDate, data, adminEmail]);

  const generateChartData = (filteredData) => {
    const labels = filteredData.map(entry => moment(entry.date).format('MMM DD, YYYY'));
    const dataPoints = filteredData.map(entry => entry.createdForms);

    return {
      labels,
      datasets: [{
        label: `Cheated Forms by ${adminEmail}`,
        data: dataPoints,
        backgroundColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16), // Random color for the admin
      }]
    };
  };

  const chartData = generateChartData(filteredData);

  return (
    <div>
      <div className='d-flex justify-content-between' >
        <div className="">

        <label className='me-3' >Start Date: </label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
        <div className="">

        <label className='me-3' >End Date: </label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>
      <Bar data={chartData} />
    </div>
  );
};

export default ConsentFormBarChart;
