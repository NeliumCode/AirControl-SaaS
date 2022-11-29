import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const LineChart = () => {
    return <div>
        <Line
            data={{
                labels: [
                    '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
                    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
                ],
                datasets: [
                    {
                        label: 'Temperaturas',
                        data: [
                            20, 21, 21, 27, 25, 17, 18, 16, 20, 20, 19, 21, 23, 29, 29, 30, 31, 31, 25, 23, 21, 22, 22, 19
                        ],
                        borderColor: 'black',
                        backgroundColor: 'rgba(54, 162 ,235, 0.5)',
                        borderWidth: '1',
                        fill: true,
                        tension: 0.25,
                    }
                ]
            }}
            height={400}
            width={600}
            options={{
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }}
        />
    </div>
}

export default LineChart;