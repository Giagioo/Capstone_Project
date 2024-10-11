// src/components/Register.js
import React, { useState } from 'react';
import axios from '../utlis/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'user',
  });

  const [errors, setErrors] = useState([]);

  const { username, email, password, password2, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (password !== password2) {
      setErrors([{ msg: 'Le password non corrispondono' }]);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(
        '/auth/register', // Percorso relativo grazie all'istanza di axios
        {
          username,
          email,
          password,
          role, 
        },
        config
      );

      navigate('/login'); // Redirect alla pagina di login dopo la registrazione
    } catch (err) {
      console.error('Errore nella registrazione:', err);
    
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          // Errore di validazione
          setErrors(err.response.data.errors.map(error => ({ msg: error.msg })));
        } else if (err.response.data.msg) {
          // Altri errori
          setErrors([{ msg: err.response.data.msg }]);
        } else {
          setErrors([{ msg: 'Errore nella registrazione' }]);
        }
      } else {
        // Errore di rete o altro
        setErrors([{ msg: 'Errore di rete. Riprova più tardi.' }]);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registrazione</h2>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Conferma Password:</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label>Ruolo:</label>
          <select
            name="role"
            className="form-control"
            value={role}
            onChange={onChange}
            required
          >
            <option value="user">Utente</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Register;
