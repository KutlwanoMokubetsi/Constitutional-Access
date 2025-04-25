import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ iconSrc, alt, title, description, linkTo, linkText, onClick }) => (
  <motion.article 
    className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 rounded-2xl shadow-xl p-6 flex flex-col space-y-3 hover:scale-105 transition-transform duration-300"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    role="region"
    aria-labelledby={title.replace(/\s/g, '-').toLowerCase()}
  >
    <header className="flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full shadow-lg transform rotate-3">
        <img src={iconSrc} alt={alt} className="h-10 w-10 object-contain" />
      </div>
      <h2 id={title.replace(/\s/g, '-').toLowerCase()} className="text-xl font-semibold">{title}</h2>
    </header>

    <p className="text-sm text-gray-700">{description}</p>

    {linkText && (
      onClick ? (
        <button
          onClick={onClick}
          className="mt-2 self-start text-white text-sm bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md"
        >
          {linkText}
        </button>
      ) : (
        <Link
          to={linkTo}
          className="mt-2 self-start text-white text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          {linkText}
        </Link>
      )
    )}
  </motion.article>
);

const HomePage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom_right,_#2563eb,_#000)] p-6 text-white flex flex-col lg:flex-row items-center justify-between">
      {/* Title and Mascot Section */}
      <section className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6" aria-labelledby="site-title">
        <motion.hgroup
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 id="site-title" className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg">
            CONSTI
            <wbr /> FIND
          </h1>
        </motion.hgroup>

        <motion.figure 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <img 
            src="/massort- contifind.png" 
            alt="Mascot character for ConstiFind platform" 
            className="w-36 sm:w-48 md:w-64 lg:w-72 mt-4"
          />
          <figcaption className="sr-only">Mascot for the ConstiFind legal document platform</figcaption>
        </motion.figure>
      </section>

      {/* Feature Cards Section */}
      <section className="w-full lg:w-1/2 mt-10 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Platform Features">
        <FeatureCard
          iconSrc="https://cdn-icons-png.flaticon.com/512/10473/10473447.png"
          alt="3D light bulb icon"
          title="Easy Search"
          description="Natural language search capabilities to find relevant constitutional documents quickly."
          linkText="Go to Search"
          linkTo="/search"
        />
        <FeatureCard
          iconSrc="https://img.icons8.com/3d-fluency/94/megaphone.png"
          alt="Megaphone icon"
          title="API Access"
          description="RESTful API integration for developers to build upon our platform."
          linkText="View API Docs"
          linkTo="/api-docs"
        />
        <FeatureCard
          iconSrc="https://img.icons8.com/3d-fluency/94/book.png"
          alt="Book icon"
          title="Easy Upload"
          description="Administrators can easily upload and organize constitutional documents."
          linkTo={isAuthenticated ? "/admin" : ""}
          linkText={isAuthenticated ? "Go to Admin Panel" : "Login to Access Admin Portal"}
          onClick={!isAuthenticated ? loginWithRedirect : null}
        />
      </section>
    </main>
  );
};

export default HomePage;
