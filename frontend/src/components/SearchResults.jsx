import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { songs, albums } = location.state || { songs: [], albums: [] };

  // Navigate to album details page
  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  // Navigate to song details page
  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>

      {/* Songs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Songs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleSongClick(song._id)} // Redirect to song details
              >
                <img
                  src={song.thumbnail?.url || "https://via.placeholder.com/50"}
                  alt={song.title}
                  className="w-10 h-10 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm truncate">{song.title}</p>
                  <p className="text-gray-400 text-xs truncate">{song.singer}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No songs found.</p>
          )}
        </div>
      </div>

      {/* Albums Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.length > 0 ? (
            albums.map((album, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleAlbumClick(album._id)} // Redirect to album details
              >
                <img
                  src={album.thumbnail?.url || "https://via.placeholder.com/50"}
                  alt={album.title}
                  className="w-10 h-10 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm truncate">{album.title}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {album.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No albums found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;