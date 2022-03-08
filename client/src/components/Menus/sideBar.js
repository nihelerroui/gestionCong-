
import { Box, Link } from '@chakra-ui/react';
import {Heading} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Flex } from '@chakra-ui/react';
import {FcBarChart} from "react-icons/fc";
import {AiFillFlag} from "react-icons/ai";
import './sidebar.css'
function SideBar() {
    const authContext = useContext(AuthContext);
    return ( 
        <Box width='30%' height="100vh" bgcolor="white" >
            <Heading as="h4" size='lg' mx={75} marginTop="25px" w="200px">Code Temple</Heading>
            <Box height="500px" display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" marginLeft="5px">   
                    {authContext.user.Rank === "isAdmin" ? 
                        <Box >
                        <Link href="/home/employees" className="side-bar-link" my="5px"><Flex alignItems="center"><FcBarChart />Gestion des employees</Flex></Link>
                        <Link href="/home/services" className="side-bar-link" my="5px"><Flex alignItems="center"><FcBarChart />Gestion des services</Flex></Link>
                        <Link href="/home/rolesandpermissions" className="side-bar-link" my="5px" w={300}><Flex alignItems="center"><FcBarChart />Gestion Roles et Permissions</Flex></Link>
                        <Link href="/home/organigramme" className="side-bar-link" my="5px" w={300}><Flex alignItems="center"><FcBarChart />organigramme</Flex></Link>
                        </Box>
                        :
                        <p></p>
                    }
                    {authContext.user.Rank === "isChef" ?
                        <Box >
                        <Link href="/home/service_employees" className="side-bar-link" my="5px"><Flex alignItems="center" ><FcBarChart />Gestion des employees</Flex></Link>    
                        <Link href="/home/noticedemande" className="side-bar-link" my="5px"><Flex alignItems="center" ><FcBarChart />Demande Congée</Flex></Link>
                        <Link href="/home/notices" className='side-bar-link' my={'5px'}><Flex alignItems="center" ><FcBarChart />Gestion Congée</Flex></Link>
                        </Box>
                        :
                        null

                    }
                    {authContext.user.Rank === "isEmployee" ?
                        <Box >
                        <Link href="/home/noticedemande" className="side-bar-link" my="5px"><Flex alignItems="center" ><FcBarChart />Demande Congée</Flex></Link>
                        <Link href="/home/notices" className='side-bar-link' my={'5px'}><Flex alignItems="center" ><FcBarChart />Gestion Congée</Flex></Link>
                        </Box>
                        :
                        <p></p>
                    }
            </Box>
        </Box>
        );
}

export default SideBar;