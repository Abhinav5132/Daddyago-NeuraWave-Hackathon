import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './NavBar.css';
import { BACKEND_URL } from './constants';

type LoginForm = {
  username: string;
  password: string;
};

type User = {
	id: string;
	username: string;
};

const NavBar: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');

  // Check login status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(BACKEND_URL + '/me', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData: User = await response.json();
        setUsername(userData.username);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(BACKEND_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUsername(userData.username);
        setIsLoggedIn(true);
        reset(); // Clear form fields
        console.log('Login success');
      } else {
        // Handle login error
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(BACKEND_URL + '/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of API response
      setIsLoggedIn(false);
      setUsername('');
      reset();
    }
  };

  return (
    <header className="navbar">
      {isLoggedIn ? (
        <div className="user-menu">
          <span className="username">Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <input 
            {...register('username')} 
            placeholder="Username" 
            required 
            className="login-input"
          />
          <input 
            {...register('password')} 
            placeholder="Password" 
            type="password" 
            required 
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      )}
    </header>
  );
};

export default NavBar;