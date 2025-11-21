import React, { use } from 'react';
import { useState, useEffect, createContext } from 'react';
import NavBar from './NavBar';
import SemiCircleChart from './SemiCircleChart';
import { Toast, ToastStyle } from './Toast';

type UserContextType = {
	toastVisible: boolean;
	setToastVisible: (b: boolean) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const App: React.FC = () => {
	const [toastVisible, setToastVisible] = useState(false);
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		// Send POST request to your backend
		fetch('http://localhost:5000/predict_probability', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(personId),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.migraine_probability !== undefined) {
					setPercentage(data.migraine_probability);
				} else {
					console.error('Backend response missing probability:', data);
				}
			})
			.catch((err) => console.error('Error fetching probability:', err));
	}, []);

	return (
		<>
			<UserContext.Provider value={{
				toastVisible:    toastVisible,
				setToastVisible: setToastVisible,
			}}>
				<NavBar />
				<section>
					<SemiCircleChart percentage={69} />
					<Toast style={ToastStyle.Success} />
				</section>
			</UserContext.Provider>
		</>
	);
};

export default App;
