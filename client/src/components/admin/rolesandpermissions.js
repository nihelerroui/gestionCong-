import { Box, Button, Text, Heading, InputGroup, InputRightElement, Select, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {AiOutlineUsergroupAdd, AiOutlineSearch} from "react-icons/ai";
import {GiTeamUpgrade} from "react-icons/gi" ;
import { Table, Thead, Tbody,Tr, Th, Td} from '@chakra-ui/react';
import {TiTick} from "react-icons/ti";
import { FormControl,FormLabel,Input } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,  ModalCloseButton,} from '@chakra-ui/react';
import axios from "axios";
function RolesAndPermissions() {
    const {onClose} = useDisclosure();
    const [Employee,setEmployee] = useState('');
    const [affectModal,setAffectModal] = useState(false);
    const [upgradeModal,setUpgradeModal] = useState(false);
    const [searchInputdisabled,setSearchInputDisabled] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');
    const [services,setServices]= useState([]);
    const [notices,setNotices]= useState([]);
    const [safeAffect,setSafeAffect] = useState(true);
    const [selectedEmployee,setSelectedEmployee] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedNotice, setSelectedNotice] = useState('');
    const selectModal = (e) =>{
        if(e === "affect-employee"){
            setAffectModal(true);
        }else if (e === "upgrade-employee"){
            setUpgradeModal(true);
        }
    }
    const getServices = () =>{
        axios.get('http://localhost:3500/api/service/all', { headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `${localStorage.getItem('token')}` } })
        .then((res) =>{
            setServices(res.data);
        })
    }
    const SearchEmployee = (e) =>{
        e.preventDefault();
        let credentials ;
        if(Employee.length ===0){
            setErrorMessage('Ce Champ ne doit etre vide !');
            return 1 ;
        }else{
            credentials = Employee.split(' ') ;
        }
        const body = {
            firstName :  credentials[0].charAt(0).toUpperCase() + credentials[0].slice(1),
            lastName : credentials[1].charAt(0).toUpperCase() + credentials[1].slice(1),
        };
        axios.post('http://localhost:3500/api/user/userByName',body,{ headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `${localStorage.getItem('token')}` } }).then((res)=>{
            if(res.status === 200){
                setSearchInputDisabled(true);
                setErrorMessage('');
                getServices();
                setSafeAffect(false);
                setSelectedEmployee(res.data);
            }
        },(error)=>{
            setErrorMessage("Utilisateur non trouvée");
        })
    }

    const AffectEmployee = (e) =>{
        axios.get('http://localhost:3500/api/service/serviceId=' + selectedService,{headers:{'Content-Type':'application/json'}}).then((res)=>{
            let Employeestab = [] ;
            let credentials = Employee.split(' ') ;
            Employeestab = res.data.Employees;
            let exist = false;
            let firstName = credentials[0].charAt(0).toUpperCase() + credentials[0].slice(1);
            let lastName = credentials[1].charAt(0).toUpperCase() + credentials[1].slice(1);
            Employeestab.map(row =>{
                if(firstName===row.firstName && lastName===row.lastName){
                        exist = true;
                        setErrorMessage("Employee déja affecter a cette service");
                    }
            });
            if(firstName === res.data.ServiceChef.firstName && lastName === res.data.ServiceChef.lastName){
                exist = true;
                setErrorMessage("Employee saisi deja assignée Chef du cette Service");
            }
            if(exist === false){
                const body = {Service_id:selectedService,Employee_id:selectedEmployee.userId};
                axios.post("http://localhost:3500/api/service/push_employee",body).then((res)=>{
                    console.log(res.data);
                })
            }
        })
    }

    const PromoteEmployee = (e) =>{
        let credentials = Employee.split(' ') ;
            let exist = false;
            let firstName = credentials[0].charAt(0).toUpperCase() + credentials[0].slice(1);
            let lastName = credentials[1].charAt(0).toUpperCase() + credentials[1].slice(1);
        getServices();
        services.forEach(service =>{
            if(service.ServiceChef !== null){
                if(service.ServiceChef.firstName === firstName && service.ServiceChef.lastName === lastName){
                 exist = true ;  
                 setErrorMessage("Employee déja Chef de cette service");
            }
        }
     });
     if(exist === false){
            const body = {Service_id:selectedService,Employee_id:selectedEmployee.userId};
            axios.post("http://localhost:3500/api/service/promote_employee",body,).then((res)=>{
                console.log(res.data);
            })
        }
    } 
    const NoticeData = (e) =>{
        let tmp = e ;
        tmp = tmp.split(' ');
        let data ={NoticeId:tmp[0],EmployeeId:tmp[1]};
        return data ;
    }
    const AcceptNotice = (e) =>{
       const data =  NoticeData(e);
       axios.post("http://localhost:3500/api/notice/accept_notice",data).then((res)=>{
           console.log(res.data);
       })
    }
    const DenyNotice = (e) =>{
        const data = NoticeData(e);
       axios.post("http://localhost:3500/api/notice/deny_notice",data).then((res)=>{
           console.log(res.data);
       })
    }
    function newFunction(){
         axios.get('http://localhost:3500/api/notice/all', { headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `${localStorage.getItem('token')}` } })
                    .then((res) => {
                        setNotices(res.data);
                    });
            }
     useEffect(() => {
         const interval = setInterval(()=>{
            newFunction();
         },3500)
         return () => clearInterval(interval);
     }, []);
    return ( 
        <Box display={"flex"} w={"100%"} justifyContent={"space-evenly"}>
            <Box w={"51%"} marginTop={-45}  bgColor={"white"} borderRadius={15} display={"flex"}  alignItems={"center"} flexDirection={"column"}>
                <Heading size={'md'} my={5} color="#676767"> Permissions de Congés</Heading>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Nom</Th>
                            <Th>Prénom</Th>
                            <Th>Durée</Th>
                            <Th>Raison</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {notices.map(notice=>
                            notice !== '' && notice.Status === 'onHold'?
                            <Tr key={notice._id} _hover={{backgroundColor:"#758dd6",transition:"0.8s ease-out"}} >
                                <Td mx={2} my={3}>{notice.Employee.firstName}</Td>
                                <Td mx={2} my={3}>{notice.Employee.lastName}</Td>
                                <Td mx={2} my={3}>{notice.Duration}</Td>
                                <Td mx={2} my={3}>{notice.Raison}</Td>
                                <Td mx={2} my={3} >
                                    <Button mx={2} id={notice._id+" "+notice.Employee._id} variant="outline" size='sm' colorScheme="green" color="green" onClick={e=>AcceptNotice(e.currentTarget.id)}>Accepter</Button>
                                    <Button mx={2} id={notice._id+" "+notice.Employee._id} variant="outline" size='sm' colorScheme="red" color="red" onClick={e=>DenyNotice(e.currentTarget.id)}>Réfuser</Button>
                                </Td>
                            </Tr>
                            :null
                        )}
                    </Tbody>
                </Table>
            </Box>
            <Box w={"45%"} marginTop={-45}  bgColor={"white"} borderRadius={15} display={"flex"} alignItems={"center"} flexDirection={"column"}>
                <Heading size={'md'} my={5} color="#676767"> Affectation des Roles</Heading>
                <Button id="affect-employee" leftIcon={<AiOutlineUsergroupAdd />} color='#048B9A' variant={'outline'} my={25} onClick={e=>selectModal(e.currentTarget.id)}>Affecter un employee dans un service</Button>
                <Button id="upgrade-employee" leftIcon={<GiTeamUpgrade />} color='#FF5600' variant={'outline'} my={25} onClick={e=>selectModal(e.currentTarget.id)}>Promouvoir un employee pour le role d'un chef </Button>
            </Box>
            <Modal isOpen={affectModal} onClose={function(event){onClose();setAffectModal(false);setSearchInputDisabled(false);setErrorMessage('');setSafeAffect(true);setEmployee('')}}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Affecter un employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="employee_name">
                            <FormLabel>Chercher L'employee</FormLabel>
                            <InputGroup >
                                <Input type={'text'} disabled={searchInputdisabled} placeholder="Formule : Nom  Prenom" onChange={e=>setEmployee(e.target.value)}/>
                                    {searchInputdisabled === false ?
                                        <InputRightElement width='6rem'>
                                           <Button leftIcon={<AiOutlineSearch />} disabled={searchInputdisabled} variant={'none'} _hover={{color:'#FF5600'}}  onClick={SearchEmployee}>Search</Button>
                                    </InputRightElement>
                                        :
                                        <InputRightElement children={<TiTick color='green.500'/>}/>
                                    }    
                            </InputGroup>
                           
                        </FormControl>
                        <FormControl id="service_name" my={5}>
                            {searchInputdisabled === true ?
                                <Select placeholder="Select option" onChange={e=>setSelectedService(e.target.value)}>
                                    {services.map(service =>
                                        service != '' ?
                                        <option key={service._id} value={service._id}>{service.ServiceName}</option>
                                        :
                                        null
                                    )}
                                </Select>
                                :
                                null
                            }
                                
                        </FormControl>
                         <Text color={'red'}>{errorMessage}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="red" mr={3} onClick={function(event){onClose();setAffectModal(false);setSearchInputDisabled(false);setErrorMessage('');setSafeAffect(true);setEmployee('')}}>Fermer</Button>
                        <Button color="green" mr={3} disabled={safeAffect} onClick={AffectEmployee}> Affecter</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={upgradeModal} onClose={function(event){onClose();setUpgradeModal(false);setSearchInputDisabled(false);setErrorMessage('');}}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Promouvoir un employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="employee_name">
                            <FormLabel>Chercher L'employee</FormLabel>
                            <InputGroup >
                                <Input type={'text'} disabled={searchInputdisabled} placeholder="Formule : Nom  Prenom" onChange={e=>setEmployee(e.target.value)}/>
                                    {searchInputdisabled === false ?
                                        <InputRightElement width='6rem'>
                                           <Button leftIcon={<AiOutlineSearch />} disabled={searchInputdisabled} variant={'none'} _hover={{color:'#FF5600'}}  onClick={SearchEmployee}>Search</Button>
                                    </InputRightElement>
                                        :
                                        <InputRightElement children={<TiTick color='green.500'/>}/>
                                    }    
                            </InputGroup>
                        </FormControl>
                        <FormControl id="service_name" my={5}>
                            {searchInputdisabled === true ?
                                <Select placeholder="Select option" onChange={e=>setSelectedService(e.target.value)}>
                                    {services.map(service =>
                                        service != '' ?
                                        <option key={service._id} value={service._id}>{service.ServiceName}</option>
                                        :
                                        null
                                    )}
                                </Select>
                                :
                                null
                            }
                                
                        </FormControl>
                         <Text color={'red'}>{errorMessage}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="red" mr={3} onClick={function(event){onClose();setUpgradeModal(false);setSearchInputDisabled(false);setErrorMessage('');}}>Fermer</Button>
                        <Button color="green" mr={3} onClick={PromoteEmployee}>Promouvoir</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
     );
}

export default RolesAndPermissions;