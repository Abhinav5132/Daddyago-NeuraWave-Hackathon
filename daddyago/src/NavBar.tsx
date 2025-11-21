import React from 'react';
import './NavBar.css';

const onClick = () => {
	console.log('Hello, World!');
};

const NavBar: React.FC = () => {
	return (
		<header>
			<div>
				<button onClick={onClick}>Login</button>
			</div>
		</header>
	);
};

export default NavBar;
