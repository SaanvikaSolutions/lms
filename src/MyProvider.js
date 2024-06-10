import React, { useEffect, useState } from "react";
import MyContext from "./MyContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";
import { createtickets, leaddoc,createexpense, leadsgraphdoc ,ticketsgraphdoc , documentsdoc, sparequotation, amcquotes} from "./Data/Docs";
import { createquotes } from "./Data/Docs";
// ____________________________
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase"; // Assuming you have initialized your Firestore connection

// // Reference to the collection
// const leadsCollection = collection(db, "leadsgraph");

// // Listen to changes in the entire collection
// const unsubscribe = onSnapshot(leadsCollection, (snapshot) => {
//   snapshot.forEach((doc) => {
//     // Access doc.id for the document ID
//     // Access doc.data() for the document data
//     console.log(doc.id, " => ", doc.data());
//   });
// });

// To stop listening to changes, you can call unsubscribe()
// unsubscribe();

//_____________________________

function MyProvider({children}){

    const [user,setuser] = useState({
        isAuthed:false,
        uid:'',
        userdtl:'',
        role:''
    })
    const [sideNavOnOff,setSideNavOnOff] = useState(false);
    const [workersdata,setworkersdata]=useState({});//workerdsata storage
    const [workerskeys,setworkerskeys]=useState([]);//workers keys storage
    const [leadsdata,setleadsdata]=useState({});//leads data storage
    const [leadskeys,setleadskeys]=useState([]);//leads keys storage
    const [ticketsdata,setticketsdata]=useState({});//tickets data
    const [ticketskeys , setticketskeys] = useState([]);//all ticket keys
    const [expensesdata,setexpensesdata] = useState({});//expenses data
    const [expenseskeys,setexpenseskeys] = useState([]);//expenses keys
    const [quoteskeys,setquoteskeys] = useState([]);//quote keys
    const [quotesdata,setquotesdata] = useState({});//quotes data
    const [leadsgraphkeys,setleadsgraphkeys]=useState([]);//leads graph keys
    const [leadsgraphdata,setleadsgraphdata] = useState({});//leads graph data
    const [leadsgraphlasttwelve,setleadsgraphlasttwelve] =  useState([]);//array of last twelve months
    const [ticketsgraphkeys,setticketsgraphkeys]= useState([]);//tickets graph keys
    const [ticketsgraphdata,setticketsgraphdata] = useState({});// tickets graph data
    const [ticketsgraphlasttwelve,setticketsgraphlasttwelve]=useState([]);//array of last twelve months
    const [documentsdata,setdocumentsdata] = useState({});//ADD DOCUMENTS DATA
    const [documentskeys,setdocumentskeys] = useState([]);// document keys
    const [sparesdata,setsparesdata] = useState({});//spares data
    const [spareskeys,setspareskeys] = useState([]);//spares keys
    const [amcdata,setamcdata] = useState({});//amc data
    const [amckeys,setamckeys] = useState([]);//amc keys
   

    const updateSideNav = ()=>{
      setSideNavOnOff(prev=>!prev);
    }

    const DeleteQuoteElement = (quoteid)=>{
      const temp_quote_data = quotesdata;
      const temp_quote_key = quoteskeys.filter((item)=>item!==quoteid);
      setquoteskeys(temp_quote_key);
      if(quoteid in temp_quote_data){
        delete temp_quote_data[quoteid];
        setquotesdata(temp_quote_data);
      }
    }
    
    const delete_spare_quote = (spareid) =>{
      const temp_spare_data = sparesdata;
      const temp_spare_key = spareskeys.filter((item)=>item!==spareid);
      setspareskeys(temp_spare_key);
      if(spareid in temp_spare_data){
        delete temp_spare_data[spareid];
        setquotesdata(temp_spare_data);
      }
    }

    const Delete_amc_quote = (amcid) =>{
      const temp_amc_data = amcdata;
      const temp_amc_key = amckeys.filter((item)=>amcid!==item);
      setamckeys(temp_amc_key);
      if(amcid in temp_amc_data){
        delete temp_amc_data[amcid];
        setamcdata(temp_amc_data);
      }
    }



    const sharedvalue ={
        isAuthed:user.isAuthed,
        uid:user.uid,
        userdtl:user.userdtl,
        workersdata:workersdata,
        workerskeys:workerskeys,
        leadsdata:leadsdata,
        leadskeys:leadskeys,
        ticketskeys:ticketskeys,
        ticketsdata:ticketsdata,
        expensesdata:expensesdata,
        expenseskeys:expenseskeys,
        quotesdata:quotesdata,
        quoteskeys:quoteskeys,
        leadsgraphkeys:leadsgraphkeys,
        leadsgraphdata:leadsgraphdata,
        leadsgraphlasttwelve:leadsgraphlasttwelve,
        ticketsgraphkeys:ticketsgraphkeys,
        ticketsgraphdata:ticketsgraphdata,
        ticketsgraphlasttwelve:ticketsgraphlasttwelve,
        documentsdata:documentsdata,
        documentskeys:documentskeys,
        sparesdata:sparesdata,
        spareskeys:spareskeys,
        amcdata:amcdata,
        amckeys:amckeys,
        role:user.role,
        sideNavOnOff:sideNavOnOff,

        updateSideNav,
        DeleteQuoteElement,
        delete_spare_quote,
        Delete_amc_quote
    }

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (userd) => {
            if (userd) {
              const uid = userd.uid;

              //setting that user is authed
              setuser(prev=>({
                ...prev,
                isAuthed:true,
                uid:uid,
                userdtl:userd
              }))

              //fetch amc data
              const fetch_amc_data = async()=>{
                try{
                  await onSnapshot(amcquotes,(snapshot)=>{
                    snapshot.forEach((doc)=>{
                      const tempamcdata = doc.data();
                      setamcdata(prev=>({
                        ...prev,
                        ...tempamcdata
                      }));
                      const tempamckeys = Object.keys(tempamcdata);
                      const sorttempamckeys = [...tempamckeys].sort((a,b)=>b-a);
                      setamckeys(prev=>Array.from(new Set([...prev,...sorttempamckeys])));
                    })
                  })
                }catch(err){
                  console.error('you got an error while fetching amc data: ',err);
                }
              }
              fetch_amc_data();
              //fetching amc ends here

              //spare quotation fetching
              const fetchSpareData = async() =>{
                try{
                  // await onSnapshot(sparequotation,(snapshot)=>{
                  //   snapshot.forEach((doc)=>{
                  //     console.log(doc.id," => ",doc.data());
                  //   })
                  // })
                  await onSnapshot(sparequotation,(snapshot)=>{
                    snapshot.forEach((doc)=>{
                      const tempsparedata = doc.data();
                      // console.log("data", tempquotesdata);
                      setsparesdata(prev=>({
                        ...prev,
                        ...tempsparedata
                      }));
                      const tempsparekeys = Object.keys(tempsparedata);
                      const sorttempsparekeys = [...tempsparekeys].sort((a,b)=>b-a);
                      setspareskeys(prev => Array.from(new Set([...prev, ...sorttempsparekeys])))
                      // console.log(doc.id," => ",doc.data());
                    })
                  })
                }catch(err){
                  console.error('you got an error while fetching spare data: ',err);
                }
              }
              fetchSpareData();
              //spare quotation ending here


              //fetching the documents data
              const fetchdocumentsdata = async() =>{
                try{
                  await onSnapshot(documentsdoc,(doc)=>{
                    const tempdocdata = doc.data();
                    setdocumentsdata(tempdocdata);
                    const tempdockeys = Object.keys(tempdocdata);
                    setdocumentskeys(tempdockeys);
                  })
                }catch(e){
                  console.log('you got an error while fetching the documents data',e);
                }
              }
              fetchdocumentsdata();//fetching the documents data
              //fetching the tickets graph data
              const fetchticketsgraphdata = async() =>{
                try{
                  await onSnapshot(ticketsgraphdoc,(doc)=>{
                    const tempticketsgraphdata = doc.data();
                    setticketsgraphdata(tempticketsgraphdata);
                    const tempticketsgraphkeys = Object.keys(tempticketsgraphdata);
                    const sorttempticketgraphkeys = [...tempticketsgraphkeys].sort((a,b)=>a-b);
                    setticketsgraphkeys(sorttempticketgraphkeys);
                    
                    const templasttwelvetkt = sorttempticketgraphkeys.slice(-12);
                    const finaltkttwelve=[];
                    for(let i=0;i<templasttwelvetkt.length;i++){
                      finaltkttwelve.push({
                        ...tempticketsgraphdata[templasttwelvetkt[i]]
                      })
                    }
                    setticketsgraphlasttwelve(finaltkttwelve);
                  })
                }catch(e){
                  console.log('you got an error while fetching the tickets graph data',e);
                }
              }
              fetchticketsgraphdata();//fetching the tickets graph
              //fetching the leads graph data 
              const fetchleadsgraphdata = async()  =>{
                try{
                  await onSnapshot(leadsgraphdoc,(doc)=>{
                    const templeadsgraphdata = doc.data();
                    setleadsgraphdata(templeadsgraphdata);
                    const templeadsgraphkeys = Object.keys(templeadsgraphdata);
                    const sortleadsgraphkeys = [...templeadsgraphkeys].sort((a,b)=>a-b);
                    setleadsgraphkeys(sortleadsgraphkeys);
               
                    // if(sortleadsgraphkeys.length>0){
                      const templasttwelve = sortleadsgraphkeys.slice(-12);
                      const finallasttwelvedata=[];
                    
                      for(let i=0;i<templasttwelve.length;i++){
                        finallasttwelvedata.push({
                          ...templeadsgraphdata[templasttwelve[i]]
                        })
                      }
                      
                      setleadsgraphlasttwelve(finallasttwelvedata);
                    // }
                    
                  })
                }catch(e){
                  console.log('you got an error while fetching the leads gvraph data',e);
                }
              }
              fetchleadsgraphdata();//calling the leads graph data
              
              // __________________________________________Quotation_____________________________
              //fetching the quotes
              const fetchquotationsdata = async() =>{
                try{
                  await onSnapshot(createquotes,(snapshot)=>{
                    snapshot.forEach((doc)=>{
                      const tempquotesdata = doc.data();
                      // console.log("data", tempquotesdata);
                      setquotesdata(prev=>({
                        ...prev,
                        ...tempquotesdata
                      }));
                      const tempquoteskeys = Object.keys(tempquotesdata);
                      const sorttempquoteskeys = [...tempquoteskeys].sort((a,b)=>b-a);
                      setquoteskeys(prev => Array.from(new Set([...prev, ...sorttempquoteskeys])))
                      // console.log(doc.id," => ",doc.data());
                    })
                  })
                  // await onSnapshot(createquotes,(doc)=>{
                  //   const tempquotesdata = doc.data();
                  //   setquotesdata(tempquotesdata);
                  //   const tempquoteskeys = Object.keys(tempquotesdata);
                  //   const sorttempquoteskeys = [...tempquoteskeys].sort((a,b)=>b-a);
                  //   setquoteskeys(sorttempquoteskeys);
                  // })
                }catch(e){
                  console.log('you got an error while fetching the quotations data',e);
                }
              }
              fetchquotationsdata();//calling the function  to fetch quotation data
              // ________________________________________________________________________________


              //fetching the expenses
              const fetchexpensesdata = async() =>{
                try{
                  await onSnapshot(createexpense,(doc)=>{
                    const tempexpensesdata = doc.data();
                    setexpensesdata(tempexpensesdata);
                    const tempexpenseskeys = Object.keys(tempexpensesdata);
                    const sorttempexpenseskeys = [...tempexpenseskeys].sort((a,b)=>b-a);
                    setexpenseskeys(sorttempexpenseskeys);
                  })
                }catch(e){
                  console.log('you got an error while fetching the expenses data',e);
                }
              }
              fetchexpensesdata();//fetching the expenses data
              //fetching tickets data
              const fetchticketsdata = async() =>{
                try{
                  await onSnapshot(createtickets,(doc)=>{
                    const tempticketsdata = doc.data();
                    setticketsdata(tempticketsdata);
                    const tempticketskeys = Object.keys(tempticketsdata);
                    const sorttempticketskeys = [...tempticketskeys].sort((a,b)=>b-a);
                    setticketskeys(sorttempticketskeys);

                  })
                }catch(e){
                  console.error('you geting an error while fetching the tickets data ',e);
                }
              }
             
              fetchticketsdata();//calling the function to fetch the tickets data

              
              //fetching leads data
              const fetchleadsdata = async() =>{
                try{
                  await onSnapshot(leaddoc,(doc)=>{
                    const leadsdata = doc.data();

                    // just checking the data size
                    const jsonString = JSON.stringify(leadsdata);
                    // Calculate the size of the JSON string in bytes
                    const sizeInBytes = new Blob([jsonString]).size;
                    console.log('Document size in bytes:', sizeInBytes);


                    setleadsdata(leadsdata);
                    const leadskeyarray = Object.keys(leadsdata);
                    const sortleadskeyarray = [...leadskeyarray].sort((a,b)=>b-a);
                    setleadskeys(sortleadskeyarray);

                  })
                }catch(e){
                  console.log('you got an error while fetching the leads data');
                }
              }
              fetchleadsdata()//fetching the leads data -->function calling
              //fetching the workers data
              const unsubsec = doc(db,'workers','yWXH2DQO8DlAbkmQEQU4');
              const fetchworkerdata = async() =>{
                try{
                  await onSnapshot(unsubsec,(doc)=>{
                    const workerdata = doc.data();
                    
                    setworkersdata(workerdata);
                    setuser(prev=>({
                      ...prev,
                      role:workerdata[uid].role
                     
                    }))
                    
                    const keysarray = Object.keys(workerdata);
                    const sortkeysarray = [...keysarray].sort((a,b)=>b-a);
                    setworkerskeys(sortkeysarray);
                  })
                }catch(e){
                  console.log('you got an error while fetching the users data');
                }
              }
              fetchworkerdata()//fetching the workers data-->function calling
            } else {

                //removing the user
              setuser(prev=>({
                ...prev,
                isAuthed:false,
                uid:'',
                user:'',
                role:''
              }))
              setworkersdata({});//removing the data when user exists
            }
          });

        
        return ()=>{
            unSubscribe();
        }
    },[]);

    return(
        <MyContext.Provider value={sharedvalue}>
            {children}
        </MyContext.Provider>
    );
}

export default MyProvider;