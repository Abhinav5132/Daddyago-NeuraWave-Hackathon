import React from 'react';
import { useEffect, useContext } from 'react';
import { UserContext } from './App';
import './Toast.css';

export enum ToastStyle {
	Success = 'toast-success',
	Error   = 'toast-error',
};

type ToastProps = {
	style: ToastStyle;
};

export const Toast: React.FC<ToastProps> = ({ style }) => {
	const ctx = useContext(UserContext);
	if (ctx === null)
		throw new Error("oops");
	const { toastVisible, setToastVisible } = ctx;

	useEffect(() => {
		if (!toastVisible)
			return;
		setToastVisible(true);
		const timer = setTimeout(() => setToastVisible(false), 3000);
		return () => clearTimeout(timer);
	}, [toastVisible]);

	return (
		<div className={`toast ${style} ${toastVisible ? 'show' : ''}`}>
			Qui voluptatibus odit reiciendis vel. Error quo in qui tenetur voluptatem atque. Et ea molestiae nisi dicta amet hic ea a. Maxime eaque rerum blanditiis sit deserunt. Omnis consequuntur cumque dicta sint.
		</div>
	);
};
