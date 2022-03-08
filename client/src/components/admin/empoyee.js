import { Box } from "@chakra-ui/react";
import { Table, Thead, Tbody,Tr, Th, Td} from '@chakra-ui/react';
import {Button, Text, Select} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react'
import {AiOutlinePlus,AiTwotoneDelete} from "react-icons/ai";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,  ModalCloseButton,} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import { FormControl,FormLabel,Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

function Employees() {
    const toast = useToast();
    const {onClose} = useDisclosure();
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rows, setRows] = useState([]);
    const [addModal,setaddModal] = useState(false);
    const [updateModal,setupdateModal] = useState(false);
    const [deleteModal,setdeleteModal] = useState(false);
    const selectModal = (service_id,e) =>{
        if(e === "add-service-btn"){
            setaddModal(true);
        }else if(e === "update-service-btn"){
            setupdateModal(true);
            localStorage.setItem('service_id',service_id);
        }else if(e === "delete-service-btn"){
            setdeleteModal(true);
            localStorage.setItem('service_id',service_id);
        }
    }
    function AddedToast(){
        return(
            toast({
                title: 'Employee Ajoutée',
                description: "L'employee a été ajouter avec success",
                duration: 5000,
                status: 'success',
                isClosable: true,
            })
        )
    }
    function UpdatedToast(){
        return(
            toast({
                title: 'Service Mis â jour',
                description: "La Service a été modifier avec success",
                duration: 5000,
                status: 'success',
                isClosable: true,
            })
        )
    }
    function DeleteToast(){
        return(
            toast({
                title: 'Service Supprimé',
                description: "La Service a été supprimer avec success",
                duration: 5000,
                status: 'success',
                isClosable: true,
            })
        )
    }
    const AddEmployee = (e) =>{
        let rank1 = "isEmployee";
        rank1.replace('"','');
        const body = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            Rank : rank1,
            Credit: 30,
        }
        const headers = {
            'Content-Type':'application/json',
            'X-Auth-Token': `${localStorage.getItem('token')}`,
        };
        e.preventDefault();
        axios.post('http://localhost:3500/api/user/add_user',body,{headers}).then((res)=>{
            AddedToast();
        },(error) =>{
            console.log(error.response);
        })
    }
    const DeleteEmployee = (e) => {
        const body = {
            _id : localStorage.getItem('service_id')
        };
        const headers = {
            'Content-Type':'application/json',
            'X-Auth-Token': `${localStorage.getItem('token')}`,
        }
        e.preventDefault();
        axios.post('http://localhost:3500/api/user/delete_user',body,{headers}).then((res)=>{
            DeleteToast();
        },(error)=>{
            console.log(error.response);
        })
    }
     function newFunction() {
                 axios.get('http://localhost:3500/api/user/all', { headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `${localStorage.getItem('token')}` } })
                    .then((res) => {
                        setRows(res.data);
                    });
            }
    useEffect(() => {
        const interval = setInterval(()=>{
         newFunction();
        },3500);
        return () =>clearInterval(interval);
    },[]);
    return ( 
        <Box marginTop="-70px" display="flex" flexDirection="column" width="100%" bg="white" mx="20%" height="100%" borderRadius="20px">
            <Button id="add-service-btn" w={100} marginLeft="15px" marginTop="15px"  display="flex" onClick={e=>selectModal(null,e.currentTarget.id)} color="grey"><AiOutlinePlus />Ajouter</Button>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Nom</Th>
                        <Th>Prénom</Th>
                        <Th>Email</Th>
                        <Th>Rang</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                   {rows.map(row =>
                        row != '' && row.Rank.substring(2) !== "Admin" ?
                        <Tr key={row._id} id={row._id}  _hover={{backgroundColor:"#758dd6",transition:"0.8s ease-out"}}>
                            <Td mx={2} my={3}>{row.firstName}</Td>
                            <Td mx={2} my={3}>{row.lastName}</Td>
                            <Td mx={2} my={3}>{row.email}</Td>
                            <Td mx={2} my={3}>{row.Rank.substring(2)}</Td>
                            <Td mx={2} my={3}>
                            <Button  id="delete-service-btn" variant="outline" colorScheme="red" color="red" onClick={e=>selectModal(row._id,e.currentTarget.id,)}><AiTwotoneDelete /></Button>
                            </Td>
                        </Tr>
                        : null
                    )} 
                </Tbody>
            </Table>
            <Modal isOpen={addModal} onClose={function(event){onClose();setaddModal(false);}}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Ajouter un Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="service_name">
                            <FormLabel>Nom</FormLabel>
                            <Input type="text" onChange={e=>setfirstName(e.target.value)}/>
                        </FormControl>
                        <FormControl id="service_name">
                            <FormLabel>Prénom</FormLabel>
                            <Input type="text" onChange={e=>setlastName(e.target.value)}/>
                        </FormControl>
                        <FormControl id="service_name">
                            <FormLabel>Email</FormLabel>
                            <Input type="email" onChange={e=>setEmail(e.target.value)}/>
                        </FormControl>
                        <FormControl id="service_name">
                            <FormLabel>Mot de passe</FormLabel>
                            <Input type="password" onChange={e=>setPassword(e.target.value)}/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="red" mr={3} onClick={function(event){onClose();setaddModal(false);}}>Fermer</Button>
                        <Button color="green" mr={3} onClick={AddEmployee}> Ajouter</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={deleteModal} onClose={function(event){onClose();setdeleteModal(false);}}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Supprimer Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Vous Etes sûr que vous voulez supprimer ce employee ?</Text>
                        <Text color="tomato">Cela va supprimer l'employee avec les données reliées !</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="blue" mr={3} onClick={function(event){onClose();setdeleteModal(false);}}>Fermer</Button>
                        <Button color="red" mr={3} onClick={DeleteEmployee}> Supprimer</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
     );
}

export default Employees;