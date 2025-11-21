import React, { useState, useEffect, useContext } from 'react';
import { ToastStyle } from './Toast';
import { useForm } from 'react-hook-form';
import { BACKEND_URL } from './constants';
import { UserContext } from './App';

type LoginForm = {
  username: string;
  password: string;
};

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    migraine_days_per_month: number;
    normal_sleep: number;
    trigger_stress: boolean;
    trigger_hormones: boolean;
    trigger_sleep: boolean;
    trigger_weather: boolean;
    trigger_meals: boolean;
    trigger_medicine: boolean;
};


type User = {
  id: string;
  username: string;
};

const NavBar: React.FC = () => {
  const { register: registerLogin, handleSubmit: handleLoginSubmit, reset: resetLogin } = useForm<LoginForm>();
  const { register: registerSignup, handleSubmit: handleSignupSubmit, reset: resetSignup } = useForm<RegisterForm>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Hover states
  const [logoutHover, setLogoutHover] = useState(false);
  const [loginTriggerHover, setLoginTriggerHover] = useState(false);
  const [authButtonHover, setAuthButtonHover] = useState(false);
  const [loginToggleHover, setLoginToggleHover] = useState(false);
  const [registerToggleHover, setRegisterToggleHover] = useState(false);

  // Input focus states
  const [loginUsernameFocus, setLoginUsernameFocus] = useState(false);
  const [loginPasswordFocus, setLoginPasswordFocus] = useState(false);
  const [regUsernameFocus, setRegUsernameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [regPasswordFocus, setRegPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

	const ctx = useContext(UserContext);
	if (ctx === null)
		throw Error("oops");
	const {
		setToastVisible,
		setToastStyle,
		setToastText,
	} = ctx;

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

  const onLogin = async (data: LoginForm) => {
    try {
      const response = await fetch(BACKEND_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData: User = await response.json();
		  setToastText('Successfully logged in!');
		  setToastStyle(ToastStyle.Success);
		  setToastVisible(true);
        setUsername(userData.username);
        setIsLoggedIn(true);
        resetLogin();
        setShowAuthModal(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
		  setToastText(errorData.error);
		  setToastStyle(ToastStyle.Error);
		  setToastVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch(BACKEND_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          gender: data.gender,
          migraine_days_per_month: data.migraine_days_per_month,
          normal_sleep: data.normal_sleep,
          trigger_stress: data.trigger_stress,
          trigger_hormones: data.trigger_hormones,
          trigger_sleep: data.trigger_sleep,
          trigger_weather: data.trigger_weather,
          trigger_meals: data.trigger_meals,
          trigger_medicine: data.trigger_medicine
        }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUsername(userData.username);
        setIsLoggedIn(true);
        resetSignup();
        setShowAuthModal(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Registration failed:', errorData);
        alert(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      setIsLoggedIn(false);
      setUsername('');
      resetLogin();
      setShowAuthModal(false);
    }
  };

  // Base styles
  const baseButtonStyle = {
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const loginTriggerStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    color: 'white',
    transform: loginTriggerHover ? 'translateY(-2px)' : 'none',
    boxShadow: loginTriggerHover ? '0 4px 15px rgba(52, 152, 219, 0.3)' : 'none'
  };

  const logoutButtonStyle = {
    ...baseButtonStyle,
    background: logoutHover ? 'rgba(231, 76, 60, 0.25)' : 'rgba(231, 76, 60, 0.15)',
    color: '#e74c3c',
    border: '1px solid rgba(231, 76, 60, 0.3)',
    transform: logoutHover ? 'translateY(-2px)' : 'none',
    boxShadow: logoutHover ? '0 4px 12px rgba(231, 76, 60, 0.2)' : 'none'
  };

  const authButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    color: 'white',
    transform: authButtonHover ? 'translateY(-2px)' : 'none',
    boxShadow: authButtonHover ? '0 4px 15px rgba(52, 152, 219, 0.3)' : 'none'
  };

  const authFormStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginTop: '1rem'
  };

  return (
    <>
      <header style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {isLoggedIn ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.95rem'
            }}>
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            style={loginTriggerStyle}
            onMouseEnter={() => setLoginTriggerHover(true)}
            onMouseLeave={() => setLoginTriggerHover(false)}
          >
            Login / Register
          </button>
        )}
      </header>

      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: '#1a1a2e',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '400px',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>

            {isLoginMode ? (
              <>
                <h2 style={{ marginTop: 0 }}>Login</h2>
                <form onSubmit={handleLoginSubmit(onLogin)} style={authFormStyle}>
                  <input
                    {...registerLogin('username')}
                    placeholder="Username"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${loginUsernameFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: loginUsernameFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setLoginUsernameFocus(true)}
                    onBlur={() => setLoginUsernameFocus(false)}
                  />
                  <input
                    {...registerLogin('password')}
                    placeholder="Password"
                    type="password"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${loginPasswordFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: loginPasswordFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setLoginPasswordFocus(true)}
                    onBlur={() => setLoginPasswordFocus(false)}
                  />
                  <button
                    type="submit"
                    style={authButtonStyle}
                    onMouseEnter={() => setAuthButtonHover(true)}
                    onMouseLeave={() => setAuthButtonHover(false)}
                  >
                    Login
                  </button>
                </form>
                <p style={{
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }}>
                  Don't have an account?
                  <span
                    style={{
                      color: '#3498db',
                      cursor: 'pointer',
                      fontWeight: 500,
                      textDecoration: loginToggleHover ? 'underline' : 'none'
                    }}
                    onClick={() => {
                      setIsLoginMode(false);
                      setLoginToggleHover(false);
                    }}
                    onMouseEnter={() => setLoginToggleHover(true)}
                    onMouseLeave={() => setLoginToggleHover(false)}
                  > Register here</span>
                </p>
              </>
            ) : (
              <>
                <h2 style={{ marginTop: 0 }}>Register</h2>
                <form onSubmit={handleSignupSubmit(onRegister)} style={authFormStyle}>
                  <input
                    {...registerSignup('username')}
                    placeholder="Username"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${regUsernameFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: regUsernameFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setRegUsernameFocus(true)}
                    onBlur={() => setRegUsernameFocus(false)}
                  />
                  <input
                    {...registerSignup('email')}
                    placeholder="Email"
                    type="email"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${emailFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: emailFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                  />
                  <input
                    {...registerSignup('password')}
                    placeholder="Password"
                    type="password"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${regPasswordFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: regPasswordFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setRegPasswordFocus(true)}
                    onBlur={() => setRegPasswordFocus(false)}
                  />
                  <input
                    {...registerSignup('confirmPassword')}
                    placeholder="Confirm Password"
                    type="password"
                    required
                    style={{
                      padding: '0.75rem 1rem',
                      border: `1px solid ${confirmPasswordFocus ? '#3498db' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '6px',
                      background: confirmPasswordFocus ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={() => setConfirmPasswordFocus(true)}
                    onBlur={() => setConfirmPasswordFocus(false)}
                  />
                  <button
                    type="submit"
                    style={authButtonStyle}
                    onMouseEnter={() => setAuthButtonHover(true)}
                    onMouseLeave={() => setAuthButtonHover(false)}
                  >
                    Register
                  </button>
                </form>
                <p style={{
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }}>
                  Already have an account?
                  <span
                    style={{
                      color: '#3498db',
                      cursor: 'pointer',
                      fontWeight: 500,
                      textDecoration: registerToggleHover ? 'underline' : 'none'
                    }}
                    onClick={() => {
                      setIsLoginMode(true);
                      setRegisterToggleHover(false);
                    }}
                    onMouseEnter={() => setRegisterToggleHover(true)}
                    onMouseLeave={() => setRegisterToggleHover(false)}
                  > Login here</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
