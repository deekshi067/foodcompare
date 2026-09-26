// src/components/Footer.jsx
function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} FoodCompare — Educational demo project.</p>
        <p>Prices &amp; offers shown are sample data, not live prices.</p>
      </div>
    </footer>
  );
}

export default Footer;
