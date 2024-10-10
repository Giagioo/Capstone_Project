import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Errore nel recuperare i dettagli del libro:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (!book) {
    return <div className="book-details-container">Caricamento...</div>;
  }

  return (
    <div className="book-details-container">
      <h1>{book.title}</h1>
      <h3>{book.author}</h3>
      {book.coverImageUrl ? (
        <img src={book.coverImageUrl} alt={book.title} className="book-cover" />
      ) : (
        <div className="book-placeholder">
          <p>Immagine non disponibile</p>
        </div>
      )}
      <p>{book.description}</p>
      {book.publishedDate && (
        <p><strong>Data di pubblicazione:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default BookDetails;
