import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons/faMusic';

const Navbar = () => {
  const navigate = useNavigate();
  const { logoutUser } = UserData();

  return (
    <StyledNavbar>
      <StyledDiv className="flex items-center gap-2">
        <img
          src={assets.arrow_left}
          className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
          alt=""
          onClick={() => navigate(-1)}
        />
        <img
          src={assets.arrow_right}
          className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
          alt=""
          onClick={() => navigate(+1)}
        />
      </StyledDiv>
      <LogoContainer>
        <Logo>
          <FontAwesomeIcon icon={faMusic} />
          <LogoText>TUNE-IN</LogoText>
        </Logo>
      </LogoContainer>
      <StyledDiv className="flex items-center gap-4">
       
        <StyledButton onClick={logoutUser} className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl cursor-pointer">
          Logout
        </StyledButton>
      </StyledDiv>
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  background-color: #000;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #28a745;
`;

const LogoText = styled.span`
  margin-left: 8px;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StyledButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  &:hover {
    background-color: #e0e0e0;
  }
`;

export default Navbar;