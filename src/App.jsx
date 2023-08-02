import { useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import EntrenadoresChart from './EntrenadoresChart';

import angel7real from './assets/angel7real_min.png';
import Copyright from './Copyright';

const colors = [
	'#3366cc',
	'#dc3912',
	'#ff9900',
	'#109618',
	'#990099',
	'#0099c6',
	'#dd4477',
	'#66aa00',
	'#b82e2e',
	'#316395',
	'#3366cc',
	'#994499',
	'#22aa99',
	'#aaaa11',
	'#6633cc',
	'#e67300',
	'#8b0707',
	'#651067',
	'#329262',
	'#5574a6',
	'#3b3eac',
	'#b77322',
	'#16d620',
	'#b91383',
	'#f4359e',
	'#9c5935',
	'#a9c413',
	'#2a778d',
	'#668d1c',
	'#bea413',
	'#0c5922',
	'#743411',
];

function App() {
	const [subscriptionPaymentsCSV, setSubscriptionPaymentsCSV] = useState('');
	const [ordersCSV, setOrdersCSV] = useState('');
	const [result, setResult] = useState();
	const [entrenadorColors, setEntrenadorColors] = useState({});

	const handleCalculate = () => {
		const result = processCSVs(subscriptionPaymentsCSV, ordersCSV);

		// Assign each entrenador a color
		const entrenadorColors = {};
		Object.keys(result).forEach((entrenador, index) => {
			entrenadorColors[entrenador] = colors[index];
		});

		setEntrenadorColors(entrenadorColors);
		setResult(result);
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginTop: '20px',
				}}>
				<img
					src={angel7real}
					style={{
						width: '150px',
						// height: '100px',
						marginBottom: '20px',
					}}
				/>

				<h2>Calculadora de cantidad por Entrenador en SendOwl</h2>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginBottom: '20px',
					}}>
					<label>Subscription Payments (.csv)</label>
					<input
						onChange={(e) => {
							const file = e.target.files[0];
							const reader = new FileReader();
							reader.onload = (e) => {
								const text = e.target.result;
								setSubscriptionPaymentsCSV(text);
							};
							reader.readAsText(file);
						}}
						type='file'
						accept='.csv'
					/>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginBottom: '20px',
					}}>
					<label>Orders (.csv)</label>
					<input
						onChange={(e) => {
							const file = e.target.files[0];
							const reader = new FileReader();
							reader.onload = (e) => {
								const text = e.target.result;
								setOrdersCSV(text);
							};
							reader.readAsText(file);
						}}
						type='file'
						accept='.csv'
					/>
				</div>

				{/* // Render input label */}

				{/* // Render a button that when clicked will merge the two files into one */}
				{/* Render a big button very noticeable. */}
				<button
					style={{
						marginBottom: '20px',
						padding: '10px',
						backgroundColor: '#3366cc',
						color: 'white',
						fontWeight: 'bold',
						fontSize: '24px',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
					}}
					onClick={handleCalculate}>
					Calcular
				</button>

				{/* Render result in the form of a table where the first column is "Entrenador" which is the key in the result object, and the other 
        is "Total Amount" which is the value in the result object
        */}

				{/* // Display table next to chart */}
				<div
					style={{
						marginTop: '20px',
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					{result && (
						<table>
							<thead
								style={{
									fontWeight: 'bold',
								}}>
								<tr
									style={{
										fontWeight: 'bold',
									}}>
									<th>Entrenador</th>
									<th>Resultado</th>
								</tr>
							</thead>
							<tbody>
								{Object.keys(result).map((key) => {
									return (
										<tr key={key}>
											<td
												style={{
													display: 'flex',
													alignItems: 'center',
												}}>
												{/* // REnder entrenador color */}
												<div
													style={{
														width: '15px',
														height: '15px',
														backgroundColor: entrenadorColors[key],
														marginRight: '10px',
													}}></div>

												{key}
											</td>
											{/* // Only 2 decimals */}
											<td>{result[key].toFixed(2)}</td>
										</tr>
									);
								})}

								<tr>
									<td>Total</td>
									<td>
										{Object.values(result)
											.reduce((a, b) => a + b, 0)
											.toFixed(2)}
									</td>
								</tr>
							</tbody>
						</table>
					)}

					{result && (
						<EntrenadoresChart
							colors={Object.values(entrenadorColors)}
							labels={Object.keys(result)}
							series={Object.values(result)}
						/>
					)}
				</div>

				<Copyright />
			</div>
		</>
	);
}

function processCSVs(subscriptionPaymentsCSV, ordersCSV) {
	const result = {};

	// Parse the subscription payments CSV
	const subscriptionPaymentsData = Papa.parse(subscriptionPaymentsCSV, {
		header: true,
	}).data;
	const subscriptionPaymentsMap = {};

	// Create a map of Subscription Order IDs to Amounts
	for (const payment of subscriptionPaymentsData) {
		subscriptionPaymentsMap[payment['Subscription Order ID']] = parseFloat(
			payment['Amount']
		);
	}

	// Parse the orders CSV
	const ordersData = Papa.parse(ordersCSV, { header: true }).data;

	// Calculate the total amount for each Entrenador
	for (const order of ordersData) {
		const entrenador = order['Entrenador'];
		// Remove 0 at the start of the string
		const sendOwlTransactionID = order['SendOwl Transaction ID']?.substring(1);
		const amount = subscriptionPaymentsMap[sendOwlTransactionID];

		if (amount) {
			if (result[entrenador]) {
				result[entrenador] += amount;
			} else {
				result[entrenador] = amount;
			}
		}
	}

	return result;
}

// Example usage:
const subscriptionPaymentsCSV = `
Amount,Completed At,Subscription Order ID
50.00,2023-07-01,123456
30.00,2023-07-02,789012
`;

const ordersCSV = `
Amount,Entrenador,SendOwl Transaction ID
50.00,John Doe,123456
30.00,Jane Smith,789012
`;

const result = processCSVs(subscriptionPaymentsCSV, ordersCSV);
console.log(result);

export default App;
