import { Avatar, Box,Button,FormControl,FormLabel,Input,Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Heading } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,  ModalCloseButton,} from '@chakra-ui/react';
import axios from "axios";

function MyAccount() {
    const authContext = useContext(AuthContext);
    const  {isOpen,onOpen,onClose} = useDisclosure();
    const toast = useToast();
    const [firstName,setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState();
    function UpdatedToast(){
        return (
            toast({
                title: 'Profile mis a jour',
                description: 'Votre profile est mis a jour',
                duration: 5000,
                status: 'success',
                isClosable: true,
            })
        )
    }
    const ModifierProfile = (e) =>{
        e.preventDefault();

        const params = new FormData();
        if(picture){
            params.append("picture", picture);
        }
        params.append("userId", authContext.user._id);
        params.append("firstName", firstName);
        params.append("lastName", lastName);
        params.append("email", email);
        axios.patch("http://localhost:3500/api/user/update",params,{headers: {'Content-Type':'multipart/form-data','X-Auth-Token': `${localStorage.getItem('token')}`}}).then((res)=>{
            UpdatedToast();
        }).catch((error) => console.log(error))
    }
    return ( 
        <Box marginTop="-30px" display="flex" flexDirection="column" width="100%" bg="white" mx="25%" h="fit-content" borderRadius="5px">
                <Avatar src={"http://localhost:3500"+authContext.user.picture} size={'2xl'} pos={'relative'} left={'70%'} top={5}/>
                <Box display={'flex'} flexDirection={'column'} mx={5}>
                <Heading size={'md'}>Nom</Heading>
                <Text>{authContext.user.firstName}</Text>
                <Heading size={'md'}>Prénom</Heading>
                <Text>{authContext.user.lastName}</Text>
                <Heading size={'md'}>Email</Heading>
                <Text>{authContext.user.email}</Text>  
                <Heading size={'md'}>Credit</Heading>
                <Text>{authContext.user.Credit}</Text> 
                <Button my={3} colorScheme={'orange'} variant={'outline'} onClick={onOpen}>Modifier</Button> 
                </Box>
                
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modifier mon profil</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nom</FormLabel>
                            <Input type={'text'} onChange={e=>setFirstName(e.target.value)}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Prénom</FormLabel>
                            <Input type={'text'} onChange={e=>setLastName(e.target.value)}/>
                        </FormControl>
                         <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input type={'email'} onChange={e=>setEmail(e.target.value)}/>
                        </FormControl>
                         <FormControl>
                            <FormLabel>Avatar</FormLabel>
                            <Input type={'file'} onChange={e=>setPicture(e.target.files[0])}/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={'blue'} mr={3} variant={'outline'} onClick={onClose}>Fermer</Button>
                        <Button colorScheme={'green'} variant={'outline'} onClick={ModifierProfile}>Effectuer</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
     );
}

export default MyAccount;