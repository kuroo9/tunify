import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import { assets } from "../assets/assets";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { UserData } from "../context/User";

const PlayList = ({ user }) => {
  const { songs, setSelectedSong, setIsPlaying } = SongData();
  const [myPlaylist, setMyPlaylist] = useState([]);

  // Fetch the user's playlist and filter songs
  useEffect(() => {
    if (songs && user && Array.isArray(user.playlist)) {
      const filteredSongs = songs.filter((song) =>
        user.playlist.includes(song._id.toString())
      );
      setMyPlaylist(filteredSongs);
    }
  }, [songs, user]);

  // Handle playing a song
  const handlePlaySong = (id) => {
    setSelectedSong(id);
    setIsPlaying(true);
  };

  // Add a song to the playlist
  const { addToPlaylist } = UserData();
  const handleAddToPlaylist = (id) => {
    addToPlaylist(id);
    alert("Song added to your playlist!");
  };

  return (
    <Layout>
      {/* Playlist Header */}
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
        {/* Playlist Thumbnail */}
        {myPlaylist.length > 0 ? (
          <img
            src={myPlaylist[0].thumbnail.url}
            className="w-48 rounded"
            alt="Playlist Cover"
          />
        ) : (
          <img
            src="https://via.placeholder.com/250"
            className="w-48 rounded"
            alt="Placeholder"
          />
        )}

        {/* Playlist Details */}
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">Playlist</p>
          <h2 className="text-3xl font-bold mb-4 md:text-5xl">
            {user.name}'s Playlist
          </h2>
          <h4 className="text-gray-400">Your favorite songs</h4>
       
        </div>
      </div>

      {/* Playlist Table Headers */}
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>
        </p>
        <p>Artist</p>
        <p className="hidden sm:block">Description</p>
        <p className="text-center">Actions</p>
      </div>
      <hr />

      {/* Playlist Songs */}
      {myPlaylist.length > 0 ? (
        myPlaylist.map((song, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 mt-4 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded-md"
          >
            {/* Song Number and Title */}
            <p className="text-white flex items-center">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img
                src={song.thumbnail.url}
                className="inline w-10 mr-5 rounded"
                alt={song.title}
              />
              {song.title}
            </p>

            {/* Artist Name */}
            <p className="text-[15px]">{song.singer}</p>

            {/* Description */}
            <p className="text-[15px] hidden sm:block">
              {song.description.slice(0, 20)}...
            </p>

            {/* Actions */}
            <div className="flex justify-center items-center gap-5">
              {/* Add to Playlist Button */}
              <button
                onClick={() => handleAddToPlaylist(song._id)}
                aria-label="Add to Playlist"
                className="text-[15px] text-center hover:text-green-500 transition-colors"
              >
                <FaBookmark />
              </button>

              {/* Play Button */}
              <button
                onClick={() => handlePlaySong(song._id)}
                aria-label="Play Song"
                className="text-[15px] text-center hover:text-blue-500 transition-colors"
              >
                <FaPlay />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Your playlist is empty. Start adding songs!
        </p>
      )}
    </Layout>
  );
};

export default PlayList;