import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { FaPause, FaPlay, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { UserData } from "../context/User";
import ErrorBoundary from "./ErrorBoundary";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Circular', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #121212;
    color: #fff;
  }
  ::selection {
    background: #1db954;
    color: #fff;
  }
`;

// Spotify-inspired Theme
const spotifyTheme = {
  bg: "#121212",
  text: "#fff",
  primary: "#1db954", // Spotify green
  secondary: "#535353",
  active: "#1db954",
  inactive: "#b3b3b3",
  progressBg: "#535353",
  progressFg: "#b3b3b3",
};

// Styled Components
const PlayerContainer = styled.div`
  height: 90px;
  background: #181818;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  padding: 0 16px;
  border-top: 1px solid #282828;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;

  .track-image {
    width: 56px;
    height: 56px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .track-details {
    display: flex;
    flex-direction: column;
    justify-content: center;

    h4 {
      font-size: 14px;
      margin: 0 0 4px 0;
      color: ${(props) => props.theme.text};
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    p {
      font-size: 11px;
      margin: 0;
      color: ${(props) => props.theme.secondary};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
  }

  .like-btn {
    color: ${(props) => props.theme.secondary};
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-left: 8px;

    &:hover {
      color: ${(props) => props.theme.text};
    }
  }
`;

const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .controls {
    display: flex;
    align-items: center;
    gap: 16px;

    button {
      background: none;
      border: none;
      color: ${(props) => props.theme.inactive};
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: ${(props) => props.theme.text};
        transform: scale(1.05);
      }

      &.play-pause {
        background: ${(props) => props.theme.text};
        color: #000;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 12px;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 500px;

    .time {
      font-size: 11px;
      color: ${(props) => props.theme.secondary};
      min-width: 40px;
      text-align: center;
    }

    .progress-bar {
      flex-grow: 1;
      height: 4px;
      background: ${(props) => props.theme.progressBg};
      border-radius: 2px;
      cursor: pointer;
      position: relative;

      &:hover {
        height: 6px;
      }

      .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: ${(props) => props.theme.progressFg};
        border-radius: 2px;
        width: ${(props) => props.progress}%;
        &:hover {
          background: ${(props) => props.theme.primary};
        }
      }

      .progress-handle {
        position: absolute;
        top: 50%;
        left: ${(props) => props.progress}%;
        width: 12px;
        height: 12px;
        background: ${(props) => props.theme.text};
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s;
      }

      &:hover .progress-handle {
        opacity: 1;
      }
    }
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  .volume-icon {
    color: ${(props) => props.theme.inactive};
    font-size: 16px;
  }

  .volume-bar {
    width: 100px;
    height: 4px;
    background: ${(props) => props.theme.progressBg};
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    &:hover {
      height: 6px;
    }

    .volume-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: ${(props) => props.theme.progressFg};
      border-radius: 2px;
      width: ${(props) => props.volume * 100}%;
      &:hover {
        background: ${(props) => props.theme.primary};
      }
    }

    .volume-handle {
      position: absolute;
      top: 50%;
      left: ${(props) => props.volume * 100}%;
      width: 12px;
      height: 12px;
      background: ${(props) => props.theme.text};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .volume-handle {
      opacity: 1;
    }
  }
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const Player = () => {
  const {
    song = {},
    fetchSingleSong,
    selectedSong,
    isPlaying = false,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData() || {};
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Fetch song only when selectedSong changes
  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong?.();
    }
  }, [selectedSong]);

  // Handle audio metadata and progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setProgress(audio.currentTime || 0);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song, isSeeking]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }
    setIsPlaying?.(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.min(1, Math.max(0, offsetX / rect.width));
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = Math.min(1, Math.max(0, offsetX / rect.width));

    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = newProgress * duration;
      setProgress(newProgress * duration);
    }
  };

  const handleMouseDown = () => {
    setIsSeeking(true);
  };

  const handleMouseUp = () => {
    setIsSeeking(false);

    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = (progress / duration) * duration;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }

    setIsMuted(!isMuted);
  };

  return (
    <ThemeProvider theme={spotifyTheme}>
      <GlobalStyle />
      <ErrorBoundary>
        <div>
          {song?.audio?.url && (
            <PlayerContainer>
              {/* Track Info */}
              <TrackInfo>
                <img
                  className="track-image"
                  src={song.thumbnail?.url || "/fallback-image.jpg"}
                  alt={song.title || "Current track"}
                />
                <div className="track-details">
                  <h4>{song.title || "Untitled Song"}</h4>
                  <p>{song.singer || "Unknown Artist"}</p>
                </div>
              </TrackInfo>

              {/* Player Controls */}
              <PlayerControls>
                <div className="controls">
                  <button onClick={prevMusic}>
                    <FiSkipBack />
                  </button>
                  <button className="play-pause" onClick={handlePlayPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={nextMusic}>
                    <FiSkipForward />
                  </button>
                </div>

                <div className="progress-container">
                  <span className="time">{formatTime(progress)}</span>
                  <div
                    className="progress-bar"
                    onClick={handleProgressClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    progress={(progress / duration) * 100 || 0}
                  >
                    <div
                      className="progress"
                      style={{ width: `${(progress / duration) * 100 || 0}%` }}
                    />
                    <div
                      className="progress-handle"
                      style={{ left: `${(progress / duration) * 100 || 0}%` }}
                    />
                  </div>
                  <span className="time">{formatTime(duration)}</span>
                </div>
              </PlayerControls>

              {/* Volume Control */}
              <VolumeControl>
                <button className="volume-icon" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <div
                  className="volume-bar"
                  onClick={handleVolumeChange}
                  volume={isMuted ? 0 : volume}
                >
                  <div
                    className="volume-progress"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                  <div
                    className="volume-handle"
                    style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </VolumeControl>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src={song.audio.url}
                {...(isPlaying ? { autoPlay: true } : {})}
                volume={isMuted ? 0 : volume}
              />
            </PlayerContainer>
          )}
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default Player;