function SearchBar({ value, onChange }) {
  return (
    <div className="search-box">
      <span>🔍</span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search container ID..."
      />

      <button>Search</button>
    </div>
  );
}

export default SearchBar;