import React from 'react';
import './SemiCircleChart.css';

type ChartProps = {
	percentage: number;
};

const SemiCircleChart: React.FC<ChartProps> = ({ percentage }) => {
	const angle = percentage * 1.8;
	const style = {'--angle': angle + 'deg'} as React.CSSProperties;

	return (
		<div className="sc-gauge">
			<div className="sc-background">
				<div className="sc-percentage" style={style}></div>
				<div className="sc-mask"></div>
				<span className="sc-value">{ percentage }%</span>
			</div>
		</div>
	);
};

export default SemiCircleChart;
