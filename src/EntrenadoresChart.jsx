import React from 'react';
import ReactApexChart from 'react-apexcharts';

const EntrenadoresChart = ({ colors, series, labels } = {}) => {
	var options = {
		labels: labels,
		chart: {
			type: 'donut',
			height: 224,
		},

		plotOptions: {
			pie: {
				size: 100,
				offsetX: 0,
				offsetY: 0,
				donut: {
					size: '70%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '18px',
							offsetY: -5,
						},
						value: {
							show: true,
							fontSize: '20px',
							color: '#fff',
							fontWeight: 500,
							offsetY: 5,
							formatter: function (val) {
								return `$${parseFloat(val).toFixed(2)}`;
							},
						},
						total: {
							show: true,
							fontSize: '13px',
							label: 'Total',
							color: '#fff',
							fontWeight: 500,
							formatter: function (w) {
								return (
									'$' +
									w.globals.seriesTotals
										.reduce(function (a, b) {
											return a + b;
										}, 0)
										.toFixed(2)
								);
							},
						},
					},
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return `$${value.toFixed(2)}`;
				},
			},
		},
		stroke: {
			lineCap: 'round',
			width: 2,
		},
		colors: colors,
	};
	return (
		<React.Fragment>
			<ReactApexChart
				dir='ltr'
				options={options}
				series={series}
				type='donut'
				height='224'
				className='apex-charts'
			/>
		</React.Fragment>
	);
};

export default EntrenadoresChart;
