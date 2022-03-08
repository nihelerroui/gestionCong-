import { Box, Avatar, Table, Thead, Tbody, Td, Th, Tr, Button, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {AiTwotoneDelete} from "react-icons/ai";
import { AuthContext } from "../../context/authContext";
function ServiceEmployee() {
    const authContext = useContext(AuthContext);
    const [Service_Employees, setService_Employees] = useState({_id:'',ServiceName:'',ServiceChef:'',EmployeeNumber:0,Employees:[{_id:'',firstName:'',lastName:'',email:'',picture:'',Rank:'',__v:''}]});
    const body ={Employee_id:authContext.user._id}
    
    const DeleteEmployee = (e) =>{
        const body ={ChefId:authContext.user._id,Employee_id:e}
        axios.post("http://localhost:3500/api/service/delete_from_service",body).then((res)=>{
            console.log(res.data);
        })
    }
    
    function newFunction (){
        axios.post("http://localhost:3500/api/service/commun_employees",body).then((res)=>{

            setService_Employees(res.data);
        })
    }
    useEffect(()=>{
        newFunction();
        const interval = setInterval(()=>{
            newFunction();
        },3500);
        return () =>clearInterval(interval);
    },[]);

    return ( 
        <Box marginTop="-75px" display="flex" flexDirection="column" alignItems={'center'} width="100%" bg="white" mx="25%" h="fit-content" borderRadius="5px">
        <Heading size={'md'}>Liste des employees</Heading>
        <Table>
            <Thead>
                <Tr>
                    <Th></Th>
                    <Th>Nom</Th>
                    <Th>Prénom</Th>
                    <Th>Action</Th>
                </Tr>
            </Thead>
            <Tbody>
            {Service_Employees.Employees.map(employee =>
                employee !== '' ?
                <Tr key={employee.id} id={employee.id}>
                    <Td><Avatar  name={employee.firstName +' '+ employee.lastName} src={'http://localhost:3500'+employee.picture}></Avatar></Td>
                    <Td mx={2} my={3}>{employee.firstName}</Td>
                    <Td mx={2} my={3}>{employee.lastName}</Td>
                    <Td mx={2} my={3}><Button id={employee._id} variant="outline" colorScheme="red" color="red" onClick={e=>DeleteEmployee(e.currentTarget.id)}><AiTwotoneDelete /></Button></Td>
                </Tr>
                : null
                )}
            </Tbody>
        </Table>
        </Box>
     );
}

export default ServiceEmployee;