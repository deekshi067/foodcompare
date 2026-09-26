// src/components/Loader.jsx
// ------------------------------------------------------------------
// A simple reusable loading spinner shown while API calls are in
// flight (e.g. fetching search results). Pure CSS animation via
// Tailwind's "animate-spin" utility — no extra libraries needed.
// ------------------------------------------------------------------

function Loader({ small = false }) {
  return (
    <div
      className={`flex items-center justify-center ${small ? "py-4" : "py-20"}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`${
          small ? "h-6 w-6 border-2" : "h-12 w-12 border-4"
        } rounded-full border-brand border-t-transparent animate-spin`}
      />
    </div>
  );
}

export default Loader;
