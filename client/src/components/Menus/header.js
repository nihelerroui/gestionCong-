import React from 'react';
import { Box,Link } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BsSearch } from "react-icons/bs";
import { IconButton } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import {InputGroup, InputLeftElement, Input, Wrap, WrapItem, Avatar, AvatarBadge} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import './header.css'
function Header() {
    const authContext = useContext(AuthContext);
    const Account = () =>{
        window.location.href = '/home/myaccount';
    }
    const Logout = () =>{
        localStorage.removeItem('token');
        window.location.href = "/signin" ;
    }
    return ( 
        <Box w="100%" h="25%" display="flex" bg="linear-gradient(90deg, #048B9A 0%, #048B9A 100%);" p={2} alignItems='flex-start' justifyContent="space-between">
            <InputGroup flexBasis='60%' marginTop={2}>
                <InputLeftElement
                pointerEvents="none"
                children={<BsSearch color="gray.300" />} />
            <Input type="text" bg="rgba(255,255,255,0.7259278711484594)" placeholder="Enter your search"/>    
            </InputGroup>
            <Menu flexBasis="40%">
                <MenuButton mx="15px" marginTop={2}>
                    <Avatar name={authContext.user.firstName +' '+ authContext.user.lastName} src={'http://localhost:3500'+authContext.user.picture}><AvatarBadge boxSize='1.25em' bg='green.500'/></Avatar>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={Account}>Account</MenuItem>
                    <MenuItem onClick={Logout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </Box>
     );
}

export default Header;