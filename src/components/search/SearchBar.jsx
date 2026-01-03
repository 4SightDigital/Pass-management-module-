// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({
  data = [],
  searchKeys = ["name"], // Array of keys to search in
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceTime = 300,
  showResultsCount = true,
  highlightResults = true,
  customFilter,
  className = "",
  inputClassName = "",
  iconColor = "text-gray-400",
  variant = "default", // 'default', 'minimal', 'outlined'
  size = "md", // 'sm', 'md', 'lg'
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customFilter) {
        // Use custom filter function if provided
        const results = customFilter(data, searchTerm);
        setFilteredData(results);
        if (onSearch) onSearch(results, searchTerm);
      } else {
        // Default search logic
        if (!searchTerm.trim()) {
          setFilteredData(data);
          if (onSearch) onSearch(data, "");
          return;
        }

        const term = searchTerm.toLowerCase();
        const results = data.filter((item) => {
          return searchKeys.some((key) => {
            const value = item[key];
            if (typeof value === "string") {
              return value.toLowerCase().includes(term);
            }
            if (typeof value === "number") {
              return value.toString().includes(term);
            }
            return false;
          });
        });

        setFilteredData(results);
        if (onSearch) onSearch(results, searchTerm);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, data, searchKeys, customFilter, debounceTime, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    setFilteredData(data);
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text, highlight) => {
    if (!highlight || !text || typeof text !== "string") return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  // Variant classes
  const variantClasses = {
    default: "border border-gray-300 focus:border-blue-500",
    minimal:
      "border-0 border-b border-gray-300 focus:border-blue-500 rounded-none",
    outlined: "border-2 border-gray-300 focus:border-blue-500",
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${iconColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            rounded-lg
            focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
            outline-none transition-all duration-200
            ${inputClassName}
          `}
          aria-label="Search"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Info */}
      {showResultsCount && searchTerm && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-blue-600">
              {filteredData.length}
            </span>{" "}
            of <span className="font-semibold">{data.length}</span>
          </span>
          {searchTerm && (
            <button
              onClick={handleClear}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Optional: Search Results Component
export const SearchResults = ({
  results,
  searchTerm,
  renderItem,
  emptyMessage = "No results found",
  loading = false,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-2">{emptyMessage}</p>
        {searchTerm && (
          <p className="text-sm mt-1">No matches for "{searchTerm}"</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {results.map((item, index) => (
        <div key={item.id || index}>{renderItem(item, searchTerm)}</div>
      ))}
    </div>
  );
};

// Optional: Advanced Search Component with Filters
export const AdvancedSearch = ({
  data,
  onSearch,
  filters = [],
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    setActiveFilters(newFilters);

    // Apply filters
    const filtered = data.filter((item) => {
      // Text search
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Active filters
      const matchesFilters = Object.entries(newFilters).every(
        ([key, filterValue]) => {
          if (!filterValue) return true;
          return item[key] === filterValue;
        }
      );

      return matchesSearch && matchesFilters;
    });

    onSearch(filtered, { searchTerm, filters: newFilters });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <SearchBar
        data={data}
        onSearch={(results) =>
          onSearch(results, { searchTerm, filters: activeFilters })
        }
        placeholder="Search venues..."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <select
            key={filter.key}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
