import React from 'react';
import { useForm } from 'react-hook-form';
import './NavBar.css';
import { BACKEND_URL } from './constants';

type LoginForm = {
  username: string;
  password: string;
};

const NavBar: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    fetch(BACKEND_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    .then(() => {
      // Success - add redirect here if needed
      console.log('Login success');
    })
    .catch(() => {
      // Silent failure
    });
  };

  return (
    <header>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <input {...register('username')} placeholder="Username" required />
        <input {...register('password')} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
      </form>
    </header>
  );
};

export default NavBar;