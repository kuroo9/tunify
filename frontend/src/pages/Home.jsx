import React from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.bg};
    color: ${props => props.theme.text};
    transition: background-color 0.3s, color 0.3s;

    ::-webkit-scrollbar {
      width: 8px;
      background: ${props => props.theme.secondary};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.accent};
      border-radius: 4px;
    }
  }
`;

const blackGreyTheme = {
  bg: "#0a0a0a",
  secondary: "#1a1a1a",
  text: "#ffffff",
  accent: "#2d2d2d",
  primary: "#3a3a3a",
  glow: "rgba(255, 255, 255, 0.2)",
  mutedText: "#a0a0a0",
};

const Container = styled.div`
  padding: 24px;
`;

const SectionTitle = styled(motion.h1)`
  font-size: 24px;
  font-weight: bold;
  margin: 24px 0 16px;
  text-align: center;
  color: ${props => props.theme.text};
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    text-shadow: 0 0 10px ${props => props.theme.glow};
  }
`;

const ItemList = styled(motion.div)`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.accent};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.secondary};
  }
`;

// Default images for fallback
const DEFAULT_ALBUM_IMAGE = "https://via.placeholder.com/150";
const DEFAULT_SONG_IMAGE = "https://via.placeholder.com/150";

const Home = () => {
  const { songs, albums } = SongData();

  return (
    <ThemeProvider theme={blackGreyTheme}>
      <GlobalStyle />
      <Layout>
        <Container>
          {/* Featured Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SectionTitle
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured Charts
            </SectionTitle>
            <ItemList
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {albums.length > 0 ? (
                albums.map((album, i) => {
                  const imageUrl = album?.thumbnail?.url || DEFAULT_ALBUM_IMAGE;
                  return (
                    <AlbumItem
                      key={i}
                      image={imageUrl}
                      name={album.title || "Unknown Album"}
                      desc={album.description || "No description available"}
                      id={album._id || `album-${i}`}
                    />
                  );
                })
              ) : (
                <p style={{ color: blackGreyTheme.mutedText }}>No albums available</p>
              )}
            </ItemList>
          </motion.div>

          {/* Today's Biggest Hits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <SectionTitle
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Today's Biggest Hits
            </SectionTitle>
            <ItemList
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {songs.length > 0 ? (
                songs.map((song, i) => {
                  const imageUrl = song?.thumbnail?.url || DEFAULT_SONG_IMAGE;
                  return (
                    <SongItem
                      key={i}
                      image={imageUrl}
                      name={song.title || "Unknown Song"}
                      desc={song.description || "No description available"}
                      id={song._id || `song-${i}`}
                    />
                  );
                })
              ) : (
                <p style={{ color: blackGreyTheme.mutedText }}>No songs available</p>
              )}
            </ItemList>
          </motion.div>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default Home;