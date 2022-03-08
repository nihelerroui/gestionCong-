import React from 'react';
import axios from 'axios';
//import {Button, TextField} from '@material-ui/core';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
//import PersonAddIcon from '@material-ui/icons/PersonAdd';
const SignUp=() => {
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function handleSubmit(e){
        const body ={
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
        }
        const headers = {'Content-Type':'application/json'};
        e.preventDefault()
        axios.post('http://localhost:3500/api/user',body,{ headers })
        .then((res)=>{
        navigate('/');
        },
        (error) => {
            console.log(error.response);
        })
    };
    return(
        <div>
            hi

        </div>
        
    )
}

export default SignUp;