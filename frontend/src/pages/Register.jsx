import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
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
  mutedText: "#a0a0a0", // New muted text color for better visibility
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(45deg, #1a1a1a, #0a0a0a);
`;

const FormContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px ${props => props.theme.glow}, 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px ${props => props.theme.glow}, 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.secondary};
  border-radius: 8px;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.text};
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 10px ${props => props.theme.glow};
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.text};
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${props => props.theme.accent};
    box-shadow: 0 0 10px ${props => props.theme.glow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinkText = styled(Link)`
  text-align: center;
  font-size: 14px;
  color: ${props => props.theme.mutedText}; /* Muted text color */
  text-decoration: none;
  transition: color 0.3s, text-shadow 0.3s;

  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.accent};
    text-shadow: 0 0 5px ${props => props.theme.glow}; /* Glowing effect on hover */
  }
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { registerUser, btnLoading } = UserData();
  const navigate = useNavigate();
  const { fetchSongs, fetchAlbums } = SongData();

  const submitHandler = (e) => {
    e.preventDefault();
    registerUser(name, email, password, navigate, fetchSongs, fetchAlbums);
  };

  return (
    <ThemeProvider theme={blackGreyTheme}>
      <GlobalStyle />
      <Container>
        <AnimatePresence>
          <FormContainer
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-3xl font-semibold text-center mb-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Register to Spotify
            </motion.h2>

            <Form onSubmit={submitHandler}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium mb-1">
                  Email or username
                </label>
                <Input
                  type="email"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  disabled={btnLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {btnLoading ? "Please Wait..." : "Register"}
                </Button>
              </motion.div>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center mt-6"
            >
              <LinkText to="/login">
                Already have an account? Login here.
              </LinkText>
            </motion.div>
          </FormContainer>
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
};

export default Register;