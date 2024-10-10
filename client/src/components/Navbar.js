import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext'; 

const Navbar = () => {
  const { authData, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('AuthData nella Navbar:', authData); 

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">Home</Link>
        </div>

        {/* Menu di navigazione */}
        <ul className="navbar-menu">
          <li><Link to="/movies">Film</Link></li>
          <li><Link to="/books">Libri</Link></li>
          
          {/* Mostra "Backoffice Libri" solo se l'utente è admin */}
          {authData.user && authData.user.role === 'admin' && (
            <li><Link to="/admin/books">Backoffice Libri</Link></li>
          )}
        </ul>

        {/* Azioni utente */}
        <div className="navbar-actions">
          {authData.user ? (
            <>
              <Link to="/profile">Profilo</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Accedi</Link>
              <Link to="/register">Registrati</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
