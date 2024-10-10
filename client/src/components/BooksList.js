import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BooksList.css';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Errore nel recuperare i libri:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="books-list-container">
      <h1>Libri</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              className="book-card"
              key={book._id}
              onClick={() => navigate(`/books/${book._id}`)}
            >
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="book-cover"
                />
              ) : (
                <div className="book-placeholder">
                  <p>Immagine non disponibile</p>
                </div>
              )}
              <div className="book-info">
                <h5>{book.title}</h5>
                <p>{book.author}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Nessun libro disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default BooksList;
