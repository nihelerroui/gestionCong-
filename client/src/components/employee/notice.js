import { Box, Button, FormControl, FormLabel, Heading, Input, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import axios from "axios";
import { useState,useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {VscRequestChanges} from "react-icons/vsc"
function NoticeEmployee() {
    const authContext = useContext(AuthContext);
    const [startDate,setStartDate] = useState('');
    const [duration,setDuration] = useState(0);
    const [finishDate,setFinishDate] = useState('');
    const [raison,setRaison] = useState('');
    const [Error,setError] = useState('');
    let tmp_date ;
    const ClearFields = () =>{
        setStartDate('');
        setDuration(0);
        setFinishDate('');
        setRaison('')
    }
    function addDays (date, days){
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        const last_date = copy.getFullYear()+'-'+copy.getMonth()+1+'-'+copy.getDate();
        return last_date ;
    }
    const NoticeDemande = (e) =>{
    e.preventDefault();
    tmp_date = new Date(startDate);
    const current_date = new Date();
    if(tmp_date < current_date){
        console.log("it's less")
    }
    setFinishDate(addDays(tmp_date,duration));
    if(finishDate !== ''){
             const data = {
        Employee: authContext.user._id,
        StartDate: startDate,
        Duration: duration,
        Raison: raison,
        FinishDate: finishDate,
        Status: 'onHold',
    }
    axios.post("http://localhost:3500/api/notice/notice_demande",data).then((res)=>{
        console.log(res.data);
        ClearFields();
    })
    }
    }
    return ( 
        <Box marginTop="-30px" display="flex" flexDirection="column" width="100%" bg="white" mx="25%" height="80%" borderRadius="5px" alignItems={'center'}>
        <Heading my={5} size={'md'}>Demande de Congé</Heading>
        <FormControl my={5} >
            <FormLabel>Date de début</FormLabel>
            <Input type={"date"} onChange={e=>setStartDate(e.currentTarget.valueAsDate)}/>
        </FormControl>
        <FormControl my={5}>
            <FormLabel>Durée</FormLabel>
            <Input type={"number"} onChange={e=>setDuration(e.currentTarget.valueAsNumber)}/>
        </FormControl >
        <FormControl my={5}>
            <FormLabel>Raison</FormLabel>
            <Input type={"string"} onChange={e=>setRaison(e.currentTarget.value)}/>
        </FormControl >
        <Button my={5} onClick={e=>NoticeDemande(e)} variant={'outline'} color={'green'} leftIcon={<VscRequestChanges />}>Demander un Congé</Button>
        
        </Box>
     );
}

export default NoticeEmployee;