import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";

// Glow Animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(100, 100, 100, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(100, 100, 100, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(100, 100, 100, 0.5);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
`;

const SidebarItem = styled.div`
  padding: 12px;
  margin-bottom: 10px;
  background-color: #2d2d2d;
  color: #e0e0e0;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #333;
    border-left: 3px solid #666;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
`;

const FormContainer = styled.div`
  background: #1e1e1e;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 25px;
  border: 1px solid #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #2d2d2d;
  color: #e0e0e0;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #2d2d2d;
  color: #e0e0e0;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #333;
  color: #e0e0e0;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;

  &:hover {
    background: #444;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DeleteButton = styled(Button)`
  background: #5c0000;
  
  &:hover {
    background: #7a0000;
  }
`;

const ListContainer = styled.div`
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  border: 1px solid #333;
`;

const ListHeader = styled.h2`
  margin-bottom: 15px;
  color: #e0e0e0;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #333;
  justify-content: space-between;
  transition: background 0.2s ease;

  &:hover {
    background-color: #252525;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Thumbnail = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 15px;
  object-fit: cover;
  border: 1px solid #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #b0b0b0;
`;

const Admin = () => {
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    loading,
    addSong,
    addThumbnail,
    deleteSong,
    deleteAlbum,
  } = SongData();
  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== "admin") {
    navigate("/");
    return null;
  }

  const [activeForm, setActiveForm] = useState("addSong");

  // Separate states for album and song forms
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumFile, setAlbumFile] = useState(null);

  const [songTitle, setSongTitle] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [songSinger, setSongSinger] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [songFile, setSongFile] = useState(null);

  const fileChangeHandler = (e, setState) => {
    const file = e.target.files[0];
    setState(file);
  };

  const addAlbumHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", albumFile);

    try {
      await addAlbum(formData, setAlbumTitle, setAlbumDescription, setAlbumFile);
      toast.success("Album added successfully!");
    } catch (error) {
      toast.error("Failed to add album.");
    }
  };

  const addSongHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("singer", songSinger);
    formData.append("album", songAlbum);
    formData.append("file", songFile);

    try {
      await addSong(
        formData,
        setSongTitle,
        setSongDescription,
        setSongFile,
        setSongSinger,
        setSongAlbum
      );
      toast.success("Song added successfully!");
    } catch (error) {
      toast.error("Failed to add song.");
    }
  };

  const addThumbnailHandler = async (id, type) => {
    const formData = new FormData();
    const fileInput = document.querySelector(`#thumbnail-${type}-${id}`);
    const file = fileInput.files[0];

    if (!file) {
      toast.error("Please select a thumbnail file.");
      return;
    }

    formData.append("file", file);

    try {
      await addThumbnail(id, formData);
      toast.success(`${type === "album" ? "Album" : "Song"} thumbnail added successfully!`);
      fileInput.value = null; // Clear the input after upload
    } catch (error) {
      toast.error("Failed to add thumbnail.");
    }
  };

  const deleteSongHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
      toast.success("Song deleted successfully!");
    }
  };

  const deleteAlbumHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      deleteAlbum(id);
      toast.success("Album deleted successfully!");
    }
  };

  return (
    <Container>
      <Sidebar>
        <Link to="/" style={{ color: '#e0e0e0', textDecoration: 'none', textAlign: 'center', marginBottom: '25px', fontSize: '1.1rem' }}>
          Go to Home
        </Link>
    
        <SidebarItem onClick={() => setActiveForm("addSong")}>Add Song</SidebarItem>
        <SidebarItem onClick={() => setActiveForm("listSong")}>List Songs</SidebarItem>
        <SidebarItem onClick={() => setActiveForm("addAlbum")}>Add Album</SidebarItem>
        <SidebarItem onClick={() => setActiveForm("listAlbum")}>List Albums</SidebarItem>
      </Sidebar>
      <MainContent>
        <h1 style={{ color: '#e0e0e0', marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Admin Panel</h1>
        {activeForm === "addSong" && (
          <FormContainer>
            <ListHeader>Add Song</ListHeader>
            <form onSubmit={addSongHandler}>
              <Label>Song Name</Label>
              <Input type="text" placeholder="Enter song name" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} required />
              
              <Label>Description</Label>
              <Input type="text" placeholder="Enter description" value={songDescription} onChange={(e) => setSongDescription(e.target.value)} />
              
              <Label>Singer</Label>
              <Input type="text" placeholder="Enter singer name" value={songSinger} onChange={(e) => setSongSinger(e.target.value)} required />
              
              <Label>Album</Label>
              <Select value={songAlbum} onChange={(e) => setSongAlbum(e.target.value)}>
                <option value="">None</option>
                {albums &&
                  albums.map((e, i) => (
                    <option key={i} value={e._id}>
                      {e.title}
                    </option>
                  ))}
              </Select>
              
              <Label>Audio File</Label>
              <Input type="file" onChange={(e) => fileChangeHandler(e, setSongFile)} required />
              
              <Button type="submit">Add Song</Button>
            </form>
          </FormContainer>
        )}
        {activeForm === "addAlbum" && (
          <FormContainer>
            <ListHeader>Add Album</ListHeader>
            <form onSubmit={addAlbumHandler}>
              <Label>Album Name</Label>
              <Input type="text" placeholder="Enter album name" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
              
              <Label>Description</Label>
              <Input type="text" placeholder="Enter description" value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)} />
              
              <Label>Cover Image</Label>
              <Input type="file" onChange={(e) => fileChangeHandler(e, setAlbumFile)} required />
              
              <Button type="submit">Add Album</Button>
            </form>
          </FormContainer>
        )}
        {activeForm === "listSong" && (
          <ListContainer>
            <ListHeader>List of Songs</ListHeader>
            {songs && songs.map((song, index) => (
              <ListItem key={index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Thumbnail src={song.thumbnail ? song.thumbnail.url : "/default_thumbnail.png"} alt={song.title} />
                  <div>
                    <div style={{ fontWeight: '500' }}>{song.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>{song.singer}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!song.thumbnail && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                      <Input 
                        type="file" 
                        id={`thumbnail-song-${song._id}`} 
                        style={{ width: 'auto', marginRight: '10px' }} 
                      />
                      <Button onClick={() => addThumbnailHandler(song._id, "song")}>Add Thumbnail</Button>
                    </div>
                  )}
                  <DeleteButton onClick={() => deleteSongHandler(song._id)}>Delete</DeleteButton>
                </div>
              </ListItem>
            ))}
          </ListContainer>
        )}
        {activeForm === "listAlbum" && (
          <ListContainer>
            <ListHeader>List of Albums</ListHeader>
            {albums && albums.map((album, index) => (
              <ListItem key={index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Thumbnail src={album.thumbnail ? album.thumbnail.url : "/default_album_thumbnail.png"} alt={album.title} />
                  <div>
                    <div style={{ fontWeight: '500' }}>{album.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>{album.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!album.thumbnail && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                      <Input 
                        type="file" 
                        id={`thumbnail-album-${album._id}`} 
                        style={{ width: 'auto', marginRight: '10px' }} 
                      />
                      <Button onClick={() => addThumbnailHandler(album._id, "album")}>Add Thumbnail</Button>
                    </div>
                  )}
                  <DeleteButton onClick={() => deleteAlbumHandler(album._id)}>Delete</DeleteButton>
                </div>
              </ListItem>
            ))}
          </ListContainer>
        )}
      </MainContent>
    </Container>
  );
};

export default Admin;