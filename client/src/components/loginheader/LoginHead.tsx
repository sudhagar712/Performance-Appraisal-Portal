import { Link } from 'react-router-dom'
import navbarlogo from "../../assets/images/navbarlogo.png"
const LoginHead = () => {
 

  const navLinks = [{ name: "Login", path: "/login" }];

  return (
    <nav className="bg-white shadow-2xl  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 hover:opacity-80 transition duration-300"
          >
            <img
              src={navbarlogo}
              alt="Logo"
              className="h-32 lg:h-32 w-auto object-contain"
            />
          </Link>

  
          <ul className="flex gap-6 lg:gap-8 items-center list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm lg:text-base font-medium hover:text-blue-400 transition duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

        </div>

     
        
      </div>
    </nav>
  );
};

export default LoginHead;


