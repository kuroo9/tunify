import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { UserData } from "../context/User";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";

const Album = () => {
  const {
    fetchAlbumSong,
    albumSong,
    albumData,
    setIsPlaying,
    setSelectedSong,
  } = SongData();
  const { id } = useParams(); // Use destructuring for cleaner code
  const { addToPlaylist } = UserData();

  // Fetch album data when the component mounts or when the ID changes
  useEffect(() => {
    if (id) {
      fetchAlbumSong(id);
    }
  }, [id]);

  // Handle play button click
  const handlePlayClick = (songId) => {
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  // Handle adding a song to the playlist
  const handleAddToPlaylist = (songId) => {
    addToPlaylist(songId);
  };

  return (
    <Layout>
      {/* Display album details */}
      {albumData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex gap-8 flex-col md:flex-row md:items-center"
        >
          {/* Album Thumbnail */}
          {albumData.thumbnail && (
            <motion.img
              src={albumData.thumbnail.url}
              alt={albumData.title}
              className="w-48 rounded"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Album Title and Description */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-400">Playlist</p>
            <h2 className="text-3xl font-bold mb-2 md:text-5xl">
              {albumData.title} PlayList
            </h2>
            <h4 className="text-gray-400">{albumData.description}</h4>
          </div>
        </motion.div>
      )}

      {/* Table Header */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>
          <b className="mr-4">#</b>
        </p>
        <p>Artist</p>
        <p className="hidden sm:block">Description</p>
        <p className="text-center">Actions</p>
      </motion.div>
      <hr />

      {/* List of Songs in the Album */}
      {albumSong &&
        albumSong.map((song, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 mt-4 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded-md"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Song Number and Thumbnail */}
            <p className="text-white flex items-center">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img
                src={song.thumbnail?.url || assets.placeholder_image} // Fallback image
                className="inline w-10 mr-5 rounded"
                alt={song.title}
              />
              {song.title}
            </p>

            {/* Artist Name */}
            <p className="text-[15px]">{song.singer}</p>

            {/* Song Description */}
            <p className="text-[15px] hidden sm:block">
              {song.description.slice(0, 20)}...
            </p>

            {/* Actions (Add to Playlist and Play) */}
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => handleAddToPlaylist(song._id)}
                aria-label="Add to Playlist"
                className="text-[15px] text-center hover:text-green-500 transition-colors"
              >
                <FaBookmark />
              </button>
              <button
                onClick={() => handlePlayClick(song._id)}
                aria-label="Play Song"
                className="text-[15px] text-center hover:text-blue-500 transition-colors"
              >
                <FaPlay />
              </button>
            </div>
          </motion.div>
        ))}
    </Layout>
  );
};

export default React.memo(Album);