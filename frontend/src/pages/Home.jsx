import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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
  border-radius: 16px;
  background: ${props => props.theme.secondary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const ItemGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 0 16px;
  border-radius: 16px;
  background: ${props => props.theme.secondary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Loading Animation Styles
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  flex-direction: column;
  color: ${props => props.theme.mutedText};
  font-size: 18px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${props => props.theme.accent};
  border-top: 4px solid transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Default images for fallback
const DEFAULT_ALBUM_IMAGE = "https://via.placeholder.com/150";
const DEFAULT_SONG_IMAGE = "https://via.placeholder.com/150";

const Home = () => {
  const { songs, albums, loading } = SongData();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading state
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsLoading(false), 1000); // Simulate data fetching delay
    }
  }, [loading]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <ThemeProvider theme={blackGreyTheme}>
      <GlobalStyle />
      <Layout>
        <Container>
          {/* Featured Charts Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <SectionTitle
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Featured Charts
            </SectionTitle>

            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <p>Loading Albums...</p>
              </LoadingContainer>
            ) : (
              <ItemGrid
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.2 }}
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
              </ItemGrid>
            )}
          </motion.div>

          {/* Today's Biggest Hits Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <SectionTitle
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Today's Biggest Hits
            </SectionTitle>

            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <p>Loading Songs...</p>
              </LoadingContainer>
            ) : (
              <ItemGrid
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.2 }}
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
              </ItemGrid>
            )}
          </motion.div>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default Home;