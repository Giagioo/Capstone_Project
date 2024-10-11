import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MoviesList from './components/MoviesList'; 
import MovieDetails from './components/MovieDetails';
import SearchResults from './components/SearchResults';
import UserProfile from './components/UserProfile';
import BooksList from './components/BooksList';
import BookDetails from './components/BookDetails';
import AdminBooks from './components/AdminBooks';
import Register from './components/Register';
import Login from './components/Login';
import {AuthProvider} from './context/AuthContext'

function App() {
  return (
<AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
