import React, { useEffect, useState, useContext } from 'react';
import axios from '../utlis/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { authData } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stato per l'editing di una recensione
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedRating, setEditedRating] = useState(5);
  const [editedReviewText, setEditedReviewText] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Richiesta per /users/me');
        const response = await axios.get('/users/me');
        console.log('Risposta da /users/me:', response.data);
        setUser(response.data.user);
        setReviews(response.data.reviews);
      } catch (err) {
        console.error('Errore nel recuperare i dati dell\'utente:', err);
        setError('Errore nel recuperare i dati dell\'utente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa recensione?')) return;

    try {
      console.log(`Eliminazione recensione: ${reviewId}`);
      await axios.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      console.error('Errore nell\'eliminare la recensione:', err);
      setError('Errore nell\'eliminare la recensione.');
    }
  };

  const handleEditReview = (review) => {
    console.log('Modifica recensione:', review);
    setEditingReviewId(review._id);
    setEditedRating(review.rating);
    setEditedReviewText(review.reviewText);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedRating(5);
    setEditedReviewText('');
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      console.log(`Salvataggio recensione: ${reviewId}, rating: ${editedRating}, text: ${editedReviewText}`);
      const response = await axios.put(`/reviews/${reviewId}`, {
        rating: editedRating,
        reviewText: editedReviewText,
      });
      console.log('Recensione aggiornata:', response.data);
      setReviews(reviews.map(review => 
        review._id === reviewId ? response.data : review
      ));
      setEditingReviewId(null);
      setEditedRating(5);
      setEditedReviewText('');
    } catch (err) {
      console.error('Errore nell\'aggiornare la recensione:', err);
      setError('Errore nell\'aggiornare la recensione.');
    }
  };

  if (loading) {
    return <div className="user-profile-container">Caricamento...</div>;
  }

  if (error) {
    return <div className="user-profile-container error">{error}</div>;
  }

  return (
    <div className="user-profile-container">
      <h1>Il Tuo Profilo</h1>
      {user && (
        <div className="user-info">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h2>Le Tue Recensioni</h2>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review._id} className="user-review">
            <h3>{review.movieTitle}</h3>
            <p><strong>Valutazione:</strong> {review.rating}/10</p>
            <p><strong>Recensione:</strong> {review.reviewText}</p>
            <p><strong>Data:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
            <div className="review-actions">
              <button onClick={() => handleEditReview(review)} className="btn btn-secondary">Modifica</button>
              <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger">Elimina</button>
            </div>

            {/* Se questa recensione è in modalità editing */}
            {editingReviewId === review._id && (
              <div className="edit-review-form">
                <h4>Modifica Recensione</h4>
                <div className="form-group">
                  <label>Valutazione:</label>
                  <select
                    value={editedRating}
                    onChange={(e) => setEditedRating(e.target.value)}
                    className="form-control"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Recensione:</label>
                  <textarea
                    value={editedReviewText}
                    onChange={(e) => setEditedReviewText(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={() => handleSaveEdit(review._id)} className="btn btn-primary">Salva</button>
                  <button onClick={handleCancelEdit} className="btn btn-secondary">Annulla</button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Non hai ancora lasciato nessuna recensione.</p>
      )}
    </div>
  );
};

export default UserProfile;
