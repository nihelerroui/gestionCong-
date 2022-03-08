import { Box } from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router';
import Employees from '../components/admin/empoyee';
import RolesAndPermissions from '../components/admin/rolesandpermissions';
import Services from '../components/admin/services';
import Organigrammes from '../components/admin/organigramme';
import ServiceEmployee from '../components/chef/serviceemployees';
import NoticeEmployee from '../components/employee/notice';
import Dashboard from './dashboard';
import MyAccount from './myaccount';
import Notices from './notices';
function Home (){
    return(
        <Box display="flex" width="100%" h={'75%'} bg="#e6e7f2">
           <Routes>
               <Route  path="admin/gestion_services" element={ <Services />} />
               <Route  path="dashboard" element={ <Dashboard /> } />
               <Route  path="services" element={ <Services />} />
               <Route  path="employees" element={<Employees />} />
               <Route  path="rolesandpermissions" element={<RolesAndPermissions />} />
               <Route  path="organigramme" element={ <Organigrammes />} />
               <Route  path="noticedemande" element={<NoticeEmployee />} />
               <Route  path="myaccount" element={<MyAccount />} />
               <Route  path="service_employees" element={<ServiceEmployee />} />
               <Route  path="notices" element={<Notices />} />
           </Routes>
        </Box>
    )
}

export default Home;