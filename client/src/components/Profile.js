import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import UserReviews from './UserReviews';

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    surname: '',
    yearOfBirth: '',
    email: '',
  });
  const [profileImage, setProfileImage] = useState(null); // Per la foto del profilo
  const [previewImage, setPreviewImage] = useState(null); // Anteprima dell'immagine
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { username, surname, yearOfBirth, email } = formData;

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.user) {
        setFormData({
          username: auth.user.username || '',
          surname: auth.user.surname || '',
          yearOfBirth: auth.user.yearOfBirth || '',
          email: auth.user.email || '',
        });
      }
    };

    fetchUserData();
  }, [auth.user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);

      // Genera l'anteprima
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const data = new FormData();
      data.append('username', username);
      data.append('surname', surname);
      data.append('yearOfBirth', yearOfBirth);
      data.append('email', email);
      if (profileImage) {
        data.append('profileImage', profileImage);
      }

      // Usa il proxy configurato o l'URL completo
      const res = await axios.put('/api/auth/update', data, { // Se hai configurato il proxy
        headers: {
          'x-auth-token': auth.token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Profilo aggiornato con successo!');
      
      // Aggiorna i dati utente nel contesto
      setAuth({
        ...auth,
        user: res.data.user,
      });

      // Aggiorna localStorage se necessario
      localStorage.setItem('role', res.data.user.role);
    } catch (err) {
      console.error('Errore nell\'aggiornamento del profilo:', err.response?.data);
      setError(err.response?.data?.msg || 'Errore nell\'aggiornamento del profilo.');
    }
  };

  return (
    <div className="container">
      <h2>Il tuo Profilo</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Foto Profilo</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
          {auth.user && auth.user.profileImageUrl && !previewImage && (
            <img
              src={auth.user.profileImageUrl}
              alt="Profile"
              className="mt-2 rounded-circle"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
          {previewImage && (
            <img
              src={previewImage}
              alt="Anteprima Profilo"
              className="mt-2 rounded-circle"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Cognome</label>
          <input
            type="text"
            name="surname"
            value={surname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Anno di Nascita</label>
          <input
            type="number"
            name="yearOfBirth"
            value={yearOfBirth}
            onChange={handleChange}
            className="form-control"
            required
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Aggiorna Profilo</button>
      </form>
      <div className="mt-5">
        <UserReviews />
      </div>
    </div>
  );
};

export default Profile;
