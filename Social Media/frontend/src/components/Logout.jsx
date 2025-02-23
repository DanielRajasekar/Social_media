import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for making HTTP requests
import { URL } from '../url';
import { UserContext } from '../components/context/UserContext';
import Button from 'react-bootstrap/esm/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const Logout = () => {
     const navigate = useNavigate(); // Initialize useNavigate hook
      const {setUser}=useContext(UserContext);
      const {user}= useContext(UserContext)

    const handleLogout=async()=>{
        try{
          await axios.get(URL+"/api/auth/logout",{withCredentials:true})
          // console.log(res)
          setUser(null)
          navigate("/")
      
        }
        catch(err){
          console.log(err)
        }
      }
  return (
    <>
      {/* <ButtonGroup aria-label="Basic example"> */}
        {/* {user &&<Button style={{float:'right'}} variant="danger" onClick={handleLogout}>Logout</Button>}  */}
      {/* </ButtonGroup> */}

      {user&&<Button className='m-2' style={{float:"right"}} variant='danger' onClick={handleLogout}>Logout</Button>}
    </>
    
  )
}
