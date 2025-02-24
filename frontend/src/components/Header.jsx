
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a separate CSS file for styling

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>My App</h1> {/* You can replace this with a logo image if needed */}
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/signin" className="nav-link">Sign In</Link></li>
          <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
