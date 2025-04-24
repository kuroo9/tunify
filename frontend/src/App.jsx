import React from "react";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/User";
import Loading from "./components/Loading";
import Admin from "./pages/Admin";
import PlayList from "./pages/PlayList";
import Album from "./pages/Album";
import SearchResults from "./components/SearchResults"; // Added SearchResults import
import { ChatProvider } from "./context/ChatContext";

const App = () => {
  const { loading, user, isAuth } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ChatProvider currentUser={user}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={isAuth ? <Home /> : <Login />} />
              <Route
                path="/playlist"
                element={isAuth ? <PlayList user={user} /> : <Login />}
              />
              <Route
                path="/album/:id"
                element={isAuth ? <Album user={user} /> : <Login />}
              />
              {/* Added SearchResults route */}
              <Route
                path="/search-results"
                element={isAuth ? <SearchResults /> : <Login />}
              />
              <Route
                path="/admin"
                element={isAuth ? <Admin /> : <Login />}
              />
              <Route
                path="/login"
                element={isAuth ? <Home /> : <Login />}
              />
              <Route
                path="/register"
                element={isAuth ? <Home /> : <Register />}
              />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      )}
    </>
  );
};

export default App;