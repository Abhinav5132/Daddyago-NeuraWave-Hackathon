import React from 'react';
import NavBar from './NavBar';
import SemiCircleChart from './SemiCircleChart';

const App: React.FC = () => {
	return (
		<>
			<NavBar />
			<section>
				<SemiCircleChart percentage={0.69} />
			</section>
		</>
	);
};

export default App;
