import React from 'react'
import { Doughnut } from 'react-chartjs-2' // Import Doughnut from react-chartjs-2

const PieChart = () => {
	// Dummy data for the chart
	const data = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
		datasets: [
			{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2],
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#2ECC71',
					'#9B59B6',
				],
				hoverOffset: 4,
			},
		],
	}

	return (
		<div className='doughnut-chart'>
			<h2>Assets by Asset Type (Doughnut Chart)</h2>
			<Doughnut data={data} />
		</div>
	)
}

export default PieChart
