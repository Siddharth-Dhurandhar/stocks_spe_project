import React from 'react';
import AuthContainer from '../components/AuthContainer';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <h1>Stock Trading Platform</h1>
      <p>Invest in your future with our cutting-edge trading solutions</p>
      <AuthContainer />
      
      <footer>
        <div className="footer-left">© 2025 StockTrade</div>
        <div className="footer-right">
          <a href="#">Terms</a> • <a href="#">Privacy</a> • <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;