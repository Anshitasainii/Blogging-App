const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-gray-300 pt-10 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Blogging-App</h2>
          <p className="text-sm text-gray-400">
            Write. Share. Inspire. A platform for all voices.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li><a href="/home" className="hover:text-white transition">Home</a></li>
            <li><a href="/home" className="hover:text-white transition">Blog</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect with us</h3>
          <div className="flex space-x-5 text-xl">
            <a href="https://anshitasaini.netlify.app/" className="hover:text-pink-400 transition"><i className="fas fa-globe"></i> {/* Globe for Portfolio */}</a>
            <a href="https://x.com/anshita_saini30" className="hover:text-blue-400 transition"><i className="fab fa-twitter"></i></a>
            <a href="https://github.com/Anshitasainii" className="hover:text-white transition"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/anshita-saini-/" className="hover:text-blue-600 transition"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Blogging-App | Anshita Saini
      </div>
    </footer>
  );
};

export default Footer;
