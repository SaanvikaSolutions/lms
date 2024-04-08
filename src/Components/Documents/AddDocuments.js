import React, { useContext ,useState} from "react";
import './AddDocuments.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import {useNavigate} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { db } from "../../Firebase";
import { writeBatch } from "firebase/firestore";
import { documentsdoc } from "../../Data/Docs";
import { storage } from "../../Firebase";
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//toastify importing
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AddDocuments(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const[showloading,setshowloading] = useState(false);
    const [adddocdata,setadddocdata] = useState({
        adoccate:'',
        adocsubcate:'',
        adocname:'',
        adocdes:'',
        adocreports:[],
        adocfileurl:''
    });

    const [fileupload,setfileupload] = useState('');
    const batch = writeBatch(db);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    function handledocfile(e){
        const selectedFile = e.target.files[0];
        setfileupload(selectedFile)
    }

    // adding notifications 
    const loginsuccess = () =>toast.success('Successfully uploaded the document');

    //downloading the file url from datastorage
    const downloadfileurl = async() =>{
        try{
            return new Promise((resolve,reject)=>{
                const storageref = ref(storage,adddocdata.adocname);
                const downloadurl = getDownloadURL(storageref);
                // console.log('downloadurl',downloadurl);
                resolve(downloadurl);
            })
                
        }catch(e){
            console.log('you getting an error while downloading url ',e);
        }
    }

    async function handlesubmitdata(e){
        e.preventDefault();
        setshowloading(true);
        try{
            if(adddocdata.adoccate!=='' && adddocdata.adocname!=='' && adddocdata.adocdes!==''
                && fileupload!==''
            ){
                const aduid = uuidv4();
                var fileurl ='';
                if(fileupload!==''){
                    try{
                        const storageref = ref(storage,adddocdata.adocname);
                        const response = await uploadBytes(storageref,fileupload);
                        if(response){
                            fileurl = await downloadfileurl();
                        }else{
                            console.log('response error');
                        }
                    }catch(error){
                        console.error('you got an error while uploading gthe file, ', error);
                        alert('you got an  error');
                    }
                }
                if(aduid!==null && fileurl!==null){
                    await batch.update(documentsdoc,{
                        [aduid]:{
                            adoccate:adddocdata.adoccate,
                            adocsubcate:adddocdata.adocsubcate,
                            adocname:adddocdata.adocname,
                            adocdes:adddocdata.adocdes,
                            adocreports:[],
                            adocfileurl:fileurl
                        }
                    });

                    await batch.commit();
                    loginsuccess();//successfully added the data
                    setadddocdata(prev=>({
                        ...prev,
                        adoccate:'',
                        adocsubcate:'',
                        adocname:'',
                        adocdes:'',
                        adocreports:[],
                        adocfileurl:''
                    }));
                    setfileupload('');
                }
            }else{
                alert('please file the mandatory fields')
            }
        }catch(error){
            console.log('you got an error while uploading the files...',error);
            alert('you got an error while upoloading data');
        }
        setshowloading(false);
    }

    return(
        <>
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon onClick={()=>navigate('/search')} />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your add document  starts from here */}
                    <div className="createmanager-innner-form-con">
                    <form className="createmanager-innner-form add-doc-form">
                            <div className="create-manager-form-header">
                                <h1>Upload Documents</h1>
                                <p>Add your training and discussion materials using this form</p>
                            </div>
                            <div>
                                <label>Select Category<span>*</span></label>
                                <select value={adddocdata.adoccate} onChange={(e)=>setadddocdata(prev=>({
                                    ...prev,
                                    adoccate:e.target.value
                                }))} required>
                                    <option value='' disabled>Choose Category</option>
                                    <option value='Training Material'>Training Material</option>
                                    <option value='Installation Drawing'>Installation Drawing</option>
                                    <option value='Model Data'>Model Data</option>
                                    <option value='Utility Details'>Utility Details</option>
                                    <option value='Software'>Software</option>
                                    <option value='Others'>Others</option>
                                </select>
                            </div>

                            {
                                (adddocdata.adoccate==='Utility Details'||adddocdata.adoccate==='Installation Drawing')===true &&
                                <div>
                                    <label>Select Sub Category<span>*</span></label>
                                    <select value={adddocdata.adocsubcate} onChange={(e)=>setadddocdata(prev=>({
                                        ...prev,
                                        adocsubcate:e.target.value
                                    }))} required>
                                        <option value='' disabled>Select Sub Category</option>
                                        {adddocdata.adoccate==='Utility Details' &&
                                            <>
                                            <option value='compressor details'>compressor details</option>
                                            <option value='UPS specifications'>UPS specifications</option>
                                            <option value='Blower details'>Blower details</option>
                                            <option value='Air piping details'>Air piping details</option>
                                            <option value='elevator details'>elevator details</option>
                                            </>
                                        }
                                        {
                                            adddocdata.adoccate==='Installation Drawing' &&
                                            <>
                                                <option value='grains'>grains</option>
                                                <option value='services'>services</option>
                                                <option value='others'>others</option>
                                            </>
                                        }
                                    </select>
                                </div>
                            }

                            <div>
                                <label>Document Name<span>*</span></label>
                                <input type='text' value={adddocdata.adocname} onChange={(e)=>setadddocdata(prev=>({
                                    ...prev,
                                    adocname:e.target.value
                                }))} placeholder="Enter Your Document Name" required/>
                            </div>
                            <div>
                                <label>Document Description<span>*</span></label>
                                <textarea placeholder="Enter document description" value={adddocdata.adocdes} onChange={(e)=>setadddocdata(prev=>({
                                    ...prev,
                                    adocdes:e.target.value
                                }))}/>
                            </div>
                            <div>
                                <label>Upload Document(s)<span>*</span></label>
                                <input type='file' onChange={(e)=>handledocfile(e)} required/>
                            </div>
                            <button onClick={(e)=>handlesubmitdata(e)}>Add Document</button>

                        </form>
                        {/* you form ends here */}
                    </div>
                </div>
            </div>
            <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    limit={1}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="light"
            />

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default AddDocuments;