import React from 'react';
import { useState, createContext } from 'react';
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
