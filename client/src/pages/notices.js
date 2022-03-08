import { Box, Button, Heading, Table, Tbody, Th, Thead, Tr, Td } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
function Notices() {
    const authContext = useContext(AuthContext);
    const [notices,setNotices] = useState([{_id:'',Employee:'',StartDate:'',Duration:0,FinishDate:''}]);
    function newFunction(){
        axios.get("http://localhost:3500/api/notice/userId="+authContext.user._id,{ headers: { 'Content-Type': 'application/json', 'X-Auth-Token': `${localStorage.getItem('token')}` } }).then((res)=>{
            setNotices(res.data);
        })
    }
    const NoticeData = (e) =>{
        let tmp = e ;
        tmp = tmp.split(' ');
        let data ={NoticeId:tmp[0],EmployeeId:tmp[1],Duration:tmp[2]};
        return data ;
    }
    const DeleteNotice = (e) =>{
        const body =NoticeData(e);
        axios.post("http://localhost:3500/api/notice/remove_notice",body).then((res)=>{
            console.log(res.data);
        })
    }
    useEffect(()=>{
        const interval = setInterval(()=>{
            newFunction();
        },3500)
        return () => clearInterval(interval);
    },[]);
    return ( 
        <Box marginTop="-30px" display="flex" alignItems={'center'} flexDirection="column" width="100%" bg="white" mx="25%" h={'fit-content'} borderRadius="5px">
        <Heading size={'md'} my={5}>Liste des congées</Heading>
        <Table>
            <Thead>
                <Tr>
                    <Th>Date Début</Th>
                    <Th>Durée</Th>
                    <Th>Date Fin</Th>
                    <Th>Action</Th>
                </Tr>
            </Thead>
            <Tbody>
                {notices.map(notice=>
                    notice !== '' && notice.Status === 'onHold'?
                    <Tr>
                        <Td mx={2} my={3}>{notice.StartDate.slice(0,10)}</Td>
                        <Td mx={2} my={3}>{notice.Duration} Jours</Td>
                        <Td mx={2} my={3}>{notice.FinishDate.slice(0,10)}</Td>
                        <Td mx={2} my={3}>
                            <Button id={notice._id+" "+notice.Employee+" "+notice.Duration} mx={1} onClick={e=>DeleteNotice(e.currentTarget.id)}>Annuler</Button>
                        </Td>
                    </Tr>
                    : null
                )

                }
            </Tbody>
        </Table>
        </Box>
     );
}

export default Notices;