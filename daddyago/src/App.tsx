import React from 'react';
import HelloWorld from './HelloWorld';
import SemiCircleChart from './SemiCircleChart';

const App: React.FC = () => {
	return (
		<div>
			<h1>Daddyago’s Migrate Predictor</h1>
			<HelloWorld />
			<SemiCircleChart percentage={0.75} />
		</div>
	);
};

export default App;
