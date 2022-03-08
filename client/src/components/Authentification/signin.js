import React, { useContext, useState } from 'react';
import {AuthContext} from "../../context/authContext";
import {Box, Button, FormHelperText, Text} from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react';
import logo from '../../img/palm-recognition.png';
import {BsFillPersonCheckFill} from 'react-icons/bs';
import { useNavigate } from 'react-router';
import axios from 'axios';
import "./auth.css";

const SignIn=() => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const[ error, setError]= useState('');
    const authContext = useContext(AuthContext);
    function Login(){
        const data = {email, password}
        const headers = {'Content-Type':'application/json'}
        axios.post('http://localhost:3500/api/auth',data,{headers}).then((res)=>{
            setToken(res.data.token)
            console.log(token)
            localStorage.setItem('token',res.data.token);
            window.location.reload(false);
        }).catch(err=>setError('Wrong details!'))
        authContext.setAuth({token,email});

    }
    return(
        <Box  display="flex" flexDirection="row" alignItems="center" p={5} borderRadius={15} border="1px solid #2952D1" w={800} justifyContent={"center"} >
           
            <Image src={logo} w="50%"></Image>

            <Box display={"flex"} flexDirection={"column"} p={5}>
                    <Box display="flex" alignItems="center" my={15}>
                        <BsFillPersonCheckFill size={36} />
                    <Text mx="10px">Sign In</Text>
                    </Box>
                    <FormControl id='email'>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' onChange={e=>setEmail(e.target.value)} />
                    <FormHelperText>We'll never share your email.</FormHelperText>
                    </FormControl>
                    <FormControl id='password'>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' onChange={e=>setPassword(e.target.value)} />
                    <FormHelperText>Avoid making simple password to prevent them being hacked !</FormHelperText>
                    </FormControl>
               
            <Button  color="green" my={5} onClick={e=>Login(e)} >Connect</Button>
            </Box>

        </Box>
        
    )
}

export default SignIn;