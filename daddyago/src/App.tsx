import React, { use } from 'react';
import { useState, useEffect, createContext } from 'react';
import NavBar from './NavBar';
import SemiCircleChart from './SemiCircleChart';
import { Toast, ToastStyle } from './Toast';

type UserContextType = {
	toastVisible: boolean;
	setToastVisible: (b: boolean) => void;
	toastStyle: ToastStyle;
	setToastStyle: (b: ToastStyle) => void;
	toastText: string;
	setToastText: (b: string) => void;
	username: string;
  	setUsername: (name: string) => void;
  	isLoggedIn: boolean;
  	setIsLoggedIn: (status: boolean) => void;
  	personId: number | null;
  	setPersonId: (id: number | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const App: React.FC = () => {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastStyle, setToastStyle] = useState(ToastStyle.Success);
	const [toastText, setToastText] = useState('');
	const [percentage, setPercentage] = useState(0);
	const [username, setUsername] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [personId, setPersonId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false); // Add loading state

	// Function to handle prediction
	const handlePredict = () => {
		if (!personId) {
			setToastText("Please select a person first");
			setToastStyle(ToastStyle.Error);
			setToastVisible(true);
			return;
		}

		setIsLoading(true);
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
					setToastText("Prediction completed successfully");
					setToastStyle(ToastStyle.Success);
					setToastVisible(true);
				} else {
					throw new Error('Invalid response format');
				}
			})
			.catch((err) => {
				console.error('Error fetching probability:', err);
				setToastText("Prediction failed. Please try again.");
				setToastStyle(ToastStyle.Error);
				setToastVisible(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<>
			<UserContext.Provider value={{
				toastVisible, setToastVisible,
				toastText, setToastText,
				toastStyle, setToastStyle,
				username, setUsername,
				isLoggedIn, setIsLoggedIn,
				personId, setPersonId
			}}>
				<NavBar />
				<section style={{ padding: '2rem', textAlign: 'center' }}>
					<button 
						onClick={handlePredict} 
						disabled={isLoading}
						style={{
							padding: '0.75rem 2rem',
							fontSize: '1rem',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
							marginBottom: '2rem'
						}}
					>
						{isLoading ? 'Predicting...' : 'Predict Migraine Probability'}
					</button>
					
					<SemiCircleChart percentage={percentage} />
					<Toast />
				</section>
			</UserContext.Provider>
		</>
	);
};

export default App;