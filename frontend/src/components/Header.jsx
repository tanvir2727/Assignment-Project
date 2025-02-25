
import { Link } from 'react-router-dom';

 // Assuming you have a separate CSS file for styling

function Header() {

  

  

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-2xl font-bold">
        <h1>My App</h1> {/* You can replace this with a logo image if needed */}
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/signin" className="nav-link hover:text-gray-300">Sign In</Link>
          </li>
          <li>
            <Link to="/signup" className="nav-link hover:text-gray-300">Sign Up</Link>
          </li>
          <li>
            <Link to="/logout"  className="nav-link hover:text-gray-300">Log out</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
