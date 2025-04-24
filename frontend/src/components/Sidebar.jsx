import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";
import { FaMusic, FaHome, FaSearch } from "react-icons/fa";
import SongItem from "./SongItem";

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.bg};
    color: ${props => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
  }

  * {
    box-sizing: border-box;
  }
`;

// Black and Grey Theme
const blackGreyTheme = {
  bg: "#0a0a0a", // Dark black
  secondaryBg: "#1a1a1a", // Slightly lighter black
  text: "#ffffff", // White text
  primary: "#333333", // Grey for accents
  secondary: "#444444", // Lighter grey for secondary elements
  accent: "#555555", // Even lighter grey for hover effects
};

// Sidebar Container
const SidebarContainer = styled(motion.div)`
  width: 320px; /* Increased width */
  height: 100vh;
  padding: 24px;
  background-color: ${props => props.theme.secondaryBg};
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`;

// Section Styling
const Section = styled(motion.div)`
  background-color: ${props => props.theme.bg};
  border-radius: 12px;
  padding: 16px;
  transition: background-color 0.3s;
`;

// Navigation Link Styling
const NavLink = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${props => props.theme.accent};
    transform: translateX(5px);
  }

  svg {
    font-size: 20px;
    color: ${props => props.theme.text};
  }
`;

// Search Input Styling
const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  font-size: 14px;
  outline: none;
  transition: background-color 0.3s;

  &:focus {
    background-color: ${props => props.theme.accent};
  }
`;

// Playlist Card Styling
const PlaylistCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.theme.secondary};
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${props => props.theme.accent};
    transform: translateY(-3px);
  }
`;

// Playlist Icon Styling
const PlaylistIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.bg};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${props => props.theme.text};
    font-size: 20px;
  }
`;

// Playlist Info Styling
const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlaylistTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const PlaylistSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.text}80;
`;

// Admin Button Styling
const AdminButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${props => props.theme.accent};
    transform: translateY(-2px);
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const { user = {} } = UserData() || {};
  const { songs = [], albums = [], setSelectedSong, setIsPlaying, song, isPlaying, audioRef } =
    SongData() || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const filteredSongs = songs.filter(
        (song) =>
          song?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song?.singer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredAlbums = albums.filter((album) =>
        album?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filteredSongs);
      setFilteredAlbums(filteredAlbums);
    } else {
      setFilteredSongs([]);
      setFilteredAlbums([]);
    }
  }, [searchQuery, songs, albums]);

  // Optimized handleSongClick function
  const handleSongClick = useCallback(
    (songId) => {
      if (!audioRef?.current) return;

      // Check if the clicked song is already playing
      if (song?._id === songId && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Set the selected song and play it
        setSelectedSong(songId);
        setIsPlaying(true);

        // Load and play the new song smoothly
        const selectedSongData = songs.find((s) => s._id === songId);
        if (selectedSongData) {
          audioRef.current.src = selectedSongData.audio.url;
          audioRef.current.play().catch((error) => {
            console.error("Audio play failed:", error);
          });
        }
      }
    },
    [audioRef, song, isPlaying, setSelectedSong, setIsPlaying, songs]
  );

  return (
    <ThemeProvider theme={blackGreyTheme}>
      <GlobalStyle />
      <SidebarContainer
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Home and Search Links */}
        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NavLink onClick={() => navigate("/")}>
            <FaHome />
            <p>Home</p>
          </NavLink>
          <NavLink>
            <FaSearch />
            <p>Search</p>
          </NavLink>
        </Section>

        {/* Search Container */}
        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SearchInput
            type="text"
            placeholder="Search for songs or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Section>

        {/* Playlist Section */}
        <Section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <PlaylistCard onClick={() => navigate("/playlist")}>
            <PlaylistIcon>
              <FaMusic />
            </PlaylistIcon>
            <PlaylistInfo>
              <PlaylistTitle>My Playlist</PlaylistTitle>
              <PlaylistSubtitle>{user.name}</PlaylistSubtitle>
            </PlaylistInfo>
          </PlaylistCard>
        </Section>

        {/* Search Results */}
        {searchQuery && (
          <Section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3>Songs</h3>
            {filteredSongs.map((song, index) => (
              <div key={index} onClick={() => handleSongClick(song._id)}>
                <SongItem
                  image={song.thumbnail?.url}
                  name={song.title}
                  desc={song.singer}
                  id={song._id}
                />
              </div>
            ))}

            <h3>Albums</h3>
            {filteredAlbums.map((album, index) => (
              <div key={index} onClick={() => navigate(`/album/${album._id}`)}>
                <SongItem
                  image={album.thumbnail?.url}
                  name={album.title}
                  desc={album.description}
                  id={album._id}
                />
              </div>
            ))}
          </Section>
        )}

        {/* Admin Dashboard Button */}
        {user?.role === "admin" && (
          <Section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <AdminButton onClick={() => navigate("/admin")}>
              ARTIST Dashboard
            </AdminButton>
          </Section>
        )}
      </SidebarContainer>
    </ThemeProvider>
  );
};

export default Sidebar;