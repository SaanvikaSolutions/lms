import React, { useContext,  useState } from 'react';
import './Eachticket.css';
// import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
import MyContext from '../../MyContext';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Error from '../../Error/Error';
import Notify from '../Notifications/Notify';
function Eachticket(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
     //show details ends here
     const {tktid} = useParams();
     //code only for toggle the menu bar
     const [menutoggle,setmenutoggle] = useState(false);
     function handlemenutoggle(){
         setmenutoggle(prev=>!prev);
     }
     
     
    
    return(
        
        <>
            {
                (sharedvalue.ticketskeys.length>0 && sharedvalue.ticketskeys.includes(tktid) &&(sharedvalue.role==='admin'||(sharedvalue.role==='employee' && sharedvalue.ticketsdata[tktid].ctktemployee===sharedvalue.uid)||(sharedvalue.role==='manager' && sharedvalue.ticketsdata[tktid].ctktmanager===sharedvalue.uid)||
                (sharedvalue.ticketsdata[tktid].ctktcustname!=='other' && sharedvalue.uid===sharedvalue.workersdata[sharedvalue.ticketsdata[tktid].ctktcustname].uid)||
                (sharedvalue.ticketsdata[tktid].ctktcustname==='other' &&sharedvalue.uid===sharedvalue.ticketsdata[tktid].createdbyid)))===true?
                <div className='manlead-con'>
                    <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                    <div className='manage-con-inner'>
                        {/* inner navbar container */}
                        <div className='top-bar'>
                            <div className='top-nav-tog'>
                                <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                            </div>
                            <div className='search-icon-top-nav'>
                                {/* <SearchIcon onClick={()=>navigate('/search')} /> */}
                                <Notify/>
                            </div>
                            <PersonIcon/>
                            <p>{sharedvalue.userdtl.email}</p>
                        </div>
                        {/* your createcustomer starts from here */}
                        <div className='create-lead-con'>
                            <div className='each-lead-head-comes-here'>
                                <h1>{tktid}</h1>
                            </div>
                        <div className='create-lead-head-button-comes-here'>
                             <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                            <div className='top-eachlead-buttons'>
                                <div>
                                    <p><span className='each-lead-head-comes-here-span-1'>Status :</span>  {(sharedvalue.ticketsdata[tktid].status==='open')?'Active':sharedvalue.ticketsdata[tktid].status==='close'?'Closed':'Resolved'}</p>
                                </div>
                                <div className='top-eachlead-buttons-inner'>
                                    {sharedvalue.ticketsdata[tktid].status==='open' && <button onClick={()=>navigate(`/manageticket/updateticket/${tktid}`)}>edit</button>}
                                    {sharedvalue.ticketsdata[tktid].fileurl!=='' && <button>
                                        <a href={sharedvalue.ticketsdata[tktid].fileurl} rel="noreferrer" target="_blank">Open File</a>
                                    </button>}
                                </div>
                            </div>
                            {/* leader will completes here */}
                            {/* form starts from here  */}
                            <div className='view-each-ticket-form-starts-here'>
                                <div>
                                    <label>Country</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktcountry} readOnly/>
                                </div>
                                <div>
                                    <label>State</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktstate} readOnly/>
                                </div>
                                <div>
                                    <label>District</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktdist} readOnly/>
                                </div>
                                <div>
                                    <label>Company Name</label>
                                    {sharedvalue.ticketsdata[tktid].ctktcustname==='other'?
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktothercustname} readOnly/>
                                    :<input type='text' value={sharedvalue.workersdata[sharedvalue.ticketsdata[tktid].ctktcustname].cname} readOnly/>}
                                    
                                </div>
                                <div>
                                    <label>Device Details</label>
                                    <textarea value={sharedvalue.ticketsdata[tktid].devicedtls} readOnly/>
                                </div>
                                <div>
                                    <label>Call Type</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktcalltype==='Charge'?'Chargable':sharedvalue.ticketsdata[tktid].ctktcalltype} readOnly/>
                                </div>
                                <div>
                                    <label>Category</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktcate} readOnly/>
                                </div>
                                <div>
                                    <label>Description</label>
                                    <textarea value={sharedvalue.ticketsdata[tktid].ctktdes} readOnly/>
                                </div>
                                <div>
                                    <label>Priority</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktpriority} readOnly/>
                                </div>
                                {/* employee and manager starts here */}
                                <div>
                                    <label>manager</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktmanager!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[tktid].ctktmanager].name:'-'} readOnly/>
                                </div>
                                <div>
                                    <label>employee</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktemployee!==''?sharedvalue.workersdata[sharedvalue.ticketsdata[tktid].ctktemployee].name:'-'} readOnly/>
                                </div>
                                {/* employee and manager ends here */}
                                {/* <div>
                                    <label>Associated Lead Code</label>
                                    <input type='text' value={sharedvalue.ticketsdata[tktid].ctktasslc} readOnly/>
                                </div> */}
                            </div>
                            {/* form ends here */}
                        </div>
                    </div>
                </div>:<Error/>
            }
        </>
    );
}

export default Eachticket;