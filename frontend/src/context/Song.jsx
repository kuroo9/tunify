import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch all songs
  async function fetchSongs() {
    try {
      const { data } = await axios.get("/api/song/all");
      setSongs(data);
      setSelectedSong(data[0]?._id); // Set the first song as selected
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  }

  const [song, setSong] = useState([]);
  async function fetchSingleSong() {
    try {
      const { data } = await axios.get("/api/song/single/" + selectedSong);
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Add a new album
  async function addAlbum(formData, setTitle, setDescription, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/album/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchAlbums(); // Refresh albums list
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add album.");
      setLoading(false);
    }
  }

  // Add a new song
  async function addSong(
    formData,
    setTitle,
    setDescription,
    setFile,
    setSinger,
    setAlbum
  ) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs(); // Refresh songs list
      setTitle("");
      setDescription("");
      setFile(null);
      setSinger("");
      setAlbum("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add song.");
      setLoading(false);
    }
  }

  // Add a thumbnail for a song
  async function addThumbnail(id, formData, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/" + id, formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs(); // Refresh songs list
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add thumbnail.");
      setLoading(false);
    }
  }

  // Fetch all albums
  const [albums, setAlbums] = useState([]);
  async function fetchAlbums() {
    try {
      const { data } = await axios.get("/api/song/album/all");
      setAlbums(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Delete a song
  async function deleteSong(id) {
    try {
      const { data } = await axios.delete("/api/song/" + id);
      toast.success(data.message);
      fetchSongs(); // Refresh songs list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete song.");
    }
  }

  // Delete an album
  async function deleteAlbum(id) {
    try {
      const { data } = await axios.delete("/api/album/" + id); // Call the backend API
      toast.success(data.message);
      fetchAlbums(); // Refresh albums list
      fetchSongs(); // Refresh songs list in case songs were associated with the album
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete album.");
    }
  }

  // Handle next and previous songs
  const [index, setIndex] = useState(0);
  function nextMusic() {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]._id);
    } else {
      setIndex(index + 1);
      setSelectedSong(songs[index + 1]._id);
    }
  }

  function prevMusic() {
    if (index === 0) {
      return null;
    } else {
      setIndex(index - 1);
      setSelectedSong(songs[index - 1]._id);
    }
  }

  // Fetch songs for a specific album
  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  async function fetchAlbumSong(id) {
    try {
      const { data } = await axios.get("/api/song/album/" + id);
      setAlbumSong(data.songs);
      setAlbumData(data.album);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch initial data on component mount
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        addAlbum,
        loading,
        songLoading,
        albums,
        addSong,
        addThumbnail,
        deleteSong,
        deleteAlbum, // Add deleteAlbum to the context
        fetchSingleSong,
        song,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        selectedSong,
        nextMusic,
        prevMusic,
        fetchAlbumSong,
        albumSong,
        albumData,
        fetchSongs,
        fetchAlbums,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);