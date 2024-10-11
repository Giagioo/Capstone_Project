import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utlis/axiosInstance';
import './AdminBooks.css';
import { AuthContext } from '../context/AuthContext';

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

  const { authData } = useContext(AuthContext); // Ottieni authData dall'AuthContext

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get('/books'); // Usa path relativo
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
      const response = await axiosInstance.post('/books', newBook); // Usa path relativo
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

  // Funzione per aggiornare un libro esistente
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/books/${editingBookId}`, newBook); // Usa path relativo
      setBooks(books.map(book => book._id === editingBookId ? response.data : book));
      setNewBook({
        title: '',
        author: '',
        description: '',
        publishedDate: '',
        coverImageUrl: '',
      });
      setIsEditing(false);
      setEditingBookId(null);
    } catch (error) {
      console.error('Errore nell\'aggiornare il libro:', error);
    }
  };

  // Funzione per eliminare un libro
  const handleDeleteBook = async (id) => {
    try {
      await axiosInstance.delete(`/books/${id}`); // Usa path relativo
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Errore nell\'eliminare il libro:', error);
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
      publishedDate: book.publishedDate,
      coverImageUrl: book.coverImageUrl,
    });
  };

  return (
    <div className="admin-books-container">
      <h2>Backoffice Libri</h2>

      {/* Form per aggiungere o modificare un libro */}
      <form onSubmit={isEditing ? handleUpdateBook : handleAddBook}>
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
          required
        />
        <input
          type="date"
          name="publishedDate"
          placeholder="Data di pubblicazione"
          value={newBook.publishedDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="coverImageUrl"
          placeholder="URL dell'immagine di copertina"
          value={newBook.coverImageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? 'Aggiorna Libro' : 'Aggiungi Libro'}</button>
      </form>

      {/* Lista dei libri */}
      <ul className="books-list">
        {books.map(book => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p><strong>Autore:</strong> {book.author}</p>
            <p>{book.description}</p>
            <p><strong>Data di pubblicazione:</strong> {book.publishedDate}</p>
            <img src={book.coverImageUrl} alt={`${book.title} Cover`} />
            <button onClick={() => handleEditClick(book)}>Modifica</button>
            <button onClick={() => handleDeleteBook(book._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBooks;
