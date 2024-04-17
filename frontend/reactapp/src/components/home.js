import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getPlotData = () => {
    const timestamps = data.map(item => new Date(item.ts)); 
    const statuses = data.map(item => item.machine_status); 

    const yellowPoints = {
      x: timestamps.filter((_, index) => statuses[index] === 0),
      y: statuses.filter(status => status === 0),
      type: 'scatter',
      mode: 'markers',
      marker: { color: 'yellow' },
      name: 'Yellow Status'
    };
    
    const greenPoints = {
      x: timestamps.filter((_, index) => statuses[index] === 1),
      y: statuses.filter(status => status === 1),
      type: 'scatter',
      mode: 'markers',
      marker: { color: 'green' },
      name: 'Green Status'
    };
    
    const redPoints = {
      x: timestamps.filter((_, index) => statuses[index] === -1),
      y: statuses.filter(status => status === -1),
      type: 'scatter',
      mode: 'markers',
      marker: { color: 'red' },
      name: 'Red Status'
    };

    return [yellowPoints, greenPoints, redPoints];
  };

  return (
    <div>
      <Plot
        data={getPlotData()}
        layout={{
          title: 'Machine Cycle Status',
          xaxis: { title: 'Time' },
          yaxis: { title: 'Status', range: [-1, 1] },
          legend: { orientation: 'h' }
        }}
      />
    </div>
  );
}

export default App;