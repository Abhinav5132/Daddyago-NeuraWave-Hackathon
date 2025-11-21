import React from 'react';
import { useEffect, useContext } from 'react';
import { UserContext } from './App';
import './Toast.css';

export enum ToastStyle {
	Success = 'toast-success',
	Error   = 'toast-error',
};

export const Toast: React.FC = () => {
	const ctx = useContext(UserContext);
	if (ctx === null)
		throw new Error("oops");
	const { toastText, toastStyle, toastVisible, setToastVisible } = ctx;

	useEffect(() => {
		if (!toastVisible)
			return;
		setToastVisible(true);
		const timer = setTimeout(() => setToastVisible(false), 3000);
		return () => clearTimeout(timer);
	}, [toastVisible]);

	return (
		<div className={`toast ${toastStyle} ${toastVisible ? 'show' : ''}`}>
			{ toastText }
		</div>
	);
};
