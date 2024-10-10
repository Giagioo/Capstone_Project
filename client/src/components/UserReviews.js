import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserReviews = () => {
  const { auth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: '',
    comment: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await axios.get('/api/reviews/user', { // Usa il proxy o l'URL completo
          headers: {
            'x-auth-token': auth.token,
          },
        });
        setReviews(res.data);
      } catch (err) {
        console.error('Errore nel recuperare le recensioni:', err.response?.data);
        setError(err.response?.data?.msg || 'Errore nel recuperare le recensioni.');
      }
    };

    fetchUserReviews();
  }, [auth.token]);

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditFormData({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditFormData({
      rating: '',
      comment: '',
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await axios.put(`/api/reviews/${editingReviewId}`, editFormData, { // Usa il proxy o l'URL completo
        headers: {
          'x-auth-token': auth.token,
        },
      });

      // Aggiorna la recensione nella lista
      setReviews(reviews.map(review => review._id === editingReviewId ? res.data : review));

      setMessage('Recensione aggiornata con successo!');
      cancelEditing();
    } catch (err) {
      console.error('Errore nell\'aggiornare la recensione:', err.response?.data);
      setError(err.response?.data?.msg || 'Errore nell\'aggiornare la recensione.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
      try {
        await axios.delete(`/api/reviews/${id}`, { // Usa il proxy o l'URL completo
          headers: {
            'x-auth-token': auth.token,
          },
        });

        setReviews(reviews.filter(review => review._id !== id));
        setMessage('Recensione eliminata con successo!');
      } catch (err) {
        console.error('Errore nell\'eliminare la recensione:', err.response?.data);
        setError(err.response?.data?.msg || 'Errore nell\'eliminare la recensione.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3>Le Tue Recensioni</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {reviews.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Film</th>
              <th>Voto</th>
              <th>Commento</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id}>
                <td>{review.movie}</td>
                <td>
                  {editingReviewId === review._id ? (
                    <input
                      type="number"
                      name="rating"
                      value={editFormData.rating}
                      onChange={handleEditChange}
                      min="1"
                      max="10"
                      className="form-control"
                      required
                    />
                  ) : (
                    review.rating
                  )}
                </td>
                <td>
                  {editingReviewId === review._id ? (
                    <textarea
                      name="comment"
                      value={editFormData.comment}
                      onChange={handleEditChange}
                      className="form-control"
                      required
                    ></textarea>
                  ) : (
                    review.comment
                  )}
                </td>
                <td>
                  {editingReviewId === review._id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleEditSubmit}>Salva</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Annulla</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => startEditing(review)}>Modifica</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(review._id)}>Elimina</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Non hai ancora lasciato alcuna recensione.</p>
      )}
    </div>
  );
};

export default UserReviews;
