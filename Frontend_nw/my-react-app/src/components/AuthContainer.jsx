import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthContainer = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="auth-container">
      {!activeForm ? (
        <div className="auth-options">
          <h2>Welcome</h2>
          <p>Access your account or create a new one to start trading</p>
          <div className="buttons">
            <button onClick={() => setActiveForm('signup')}>Sign Up</button>
            <button onClick={() => setActiveForm('login')}>Login</button>
          </div>
        </div>
      ) : activeForm === 'signup' ? (
        <SignupForm onBack={() => setActiveForm(null)} />
      ) : (
        <LoginForm onBack={() => setActiveForm(null)} />
      )}
    </div>
  );
};

export default AuthContainer;