import React, { useState, useContext } from 'react';
import axios from '../utlis/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post(
        '/auth/login',
        {
          email,
          password,
        },
        config
      );

      console.log('Risposta del login:', res.data); // Log aggiuntivo

      // Salva il token e aggiorna lo stato di autenticazione
      login(res.data.token);

      // Reindirizza alla homepage o ad un'altra pagina
      navigate('/');
    } catch (err) {
      console.error('Errore nel login:', err);

      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          // Errore di validazione
          setErrors(err.response.data.errors.map(error => ({ msg: error.msg })));
        } else if (err.response.data.msg) {
          // Altri errori
          setErrors([{ msg: err.response.data.msg }]);
        } else {
          setErrors([{ msg: 'Errore nel login' }]);
        }
      } else {
        // Errore di rete o altro
        setErrors([{ msg: 'Errore di rete. Riprova più tardi.' }]);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
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
        <button type="submit" className="btn btn-primary mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
