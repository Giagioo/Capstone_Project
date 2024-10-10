import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminBooks.css';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    publishedDate: '',
    coverImageUrl: '',
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('token');

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

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  // Funzione per aggiungere un nuovo libro
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/books', newBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks([response.data, ...books]);
      setNewBook({
        title: '',
        author: '',
        description: '',
        publishedDate: '',
        coverImageUrl: '',
      });
    } catch (error) {
      console.error('Errore nell\'aggiungere il libro:', error);
    }
  };

  // Funzione per iniziare la modifica di un libro
  const handleEditClick = (book) => {
    setIsEditing(true);
    setEditingBookId(book._id);
    setNewBook({
      title: book.title,
      author: book.author,
      description: book.description,
      publishedDate: book.publishedDate ? book.publishedDate.substring(0, 10) : '',
      coverImageUrl: book.coverImageUrl,
    });
  };

  // Funzione per annullare la modifica
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingBookId(null);
    setNewBook({
      title: '',
      author: '',
      description: '',
      publishedDate: '',
      coverImageUrl: '',
    });
  };

  // Funzione per aggiornare un libro esistente
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/books/${editingBookId}`,
        newBook,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Aggiorna la lista dei libri
      setBooks(
        books.map((book) =>
          book._id === editingBookId ? response.data : book
        )
      );

      // Resetta lo stato
      setIsEditing(false);
      setEditingBookId(null);
      setNewBook({
        title: '',
        author: '',
        description: '',
        publishedDate: '',
        coverImageUrl: '',
      });
    } catch (error) {
      console.error('Errore nell\'aggiornare il libro:', error);
    }
  };

  // Funzione per eliminare un libro
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo libro?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Aggiorna la lista dei libri
        setBooks(books.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error('Errore nell\'eliminare il libro:', error);
      }
    }
  };

  return (
    <div className="admin-books-container">
      <h1>Gestione Libri</h1>

      {/* Form per aggiungere o modificare un libro */}
      <form
        className="book-form"
        onSubmit={isEditing ? handleUpdateBook : handleAddBook}
      >
        <h2>{isEditing ? 'Modifica Libro' : 'Aggiungi un nuovo libro'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Titolo"
          value={newBook.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Autore"
          value={newBook.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          value={newBook.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="publishedDate"
          value={newBook.publishedDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="coverImageUrl"
          placeholder="URL immagine di copertina"
          value={newBook.coverImageUrl}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit">{isEditing ? 'Aggiorna Libro' : 'Aggiungi Libro'}</button>
          {isEditing && (
            <button type="button" onClick={handleCancelEdit}>
              Annulla
            </button>
          )}
        </div>
      </form>

      {/* Lista dei libri */}
      <h2>Elenco dei Libri</h2>
      <table className="books-table">
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Data di Pubblicazione</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {book.publishedDate
                    ? new Date(book.publishedDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>
                  <button onClick={() => handleEditClick(book)}>Modifica</button>
                  <button onClick={() => handleDeleteBook(book._id)}>Elimina</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nessun libro disponibile.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;
