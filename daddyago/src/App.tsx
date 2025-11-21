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
				toastText:       toastText,
				setToastText:    setToastText,
				toastStyle:      ToastStyle.Success,
				setToastStyle:   setToastStyle,
				username, setUsername, isLoggedIn, setIsLoggedIn, personId, setPersonId
			}}>
				<NavBar />
				<section>
					<SemiCircleChart percentage={percentage} />
					<Toast />
				</section>
			</UserContext.Provider>
		</>
	);
};

export default App;
