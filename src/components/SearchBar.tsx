import React, { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center h-10">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="חפש מיקומים..."
        className="px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-full"
      />
      <button
        type="submit"
        className="bg-gray-800 text-white px-4 py-2 rounded-l-md hover:bg-gray-700 h-full flex items-center justify-center"
      >
        <Search size={20} />
      </button>
    </form>
  )
}

export default SearchBar