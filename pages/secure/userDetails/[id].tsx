
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';
import React, { useState,useEffect,useRef } from 'react';
import { useRouter } from 'next/router'
import BlockViewer from '../../../components/BlockViewer';
import config from "@config/index"; 
import { Image } from 'primereact/image';
import moment from 'moment' 
import {UserDetails,UserDetailsService,UserDetailsKey } from '@services/UserDetails';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Dialog } from 'primereact/dialog';
    
const UserDetailsDetails = () => {
    const router = useRouter()
    const userdetailsService = new UserDetailsService();
    const [userDetails, setUserDetails] = useState<UserDetails>({address:"",icpassport:"",photo:"",icdocument:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');
    
    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }

    const downloadFile=(data:UserDetails,dbColName:UserDetailsKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:UserDetailsKey) => {
        let _userDetails = {...userDetails,[colName]:newUploadedFileName}
        setUserDetails(_userDetails);
                
    };
    const showUploadDialog = (userDetails:UserDetails,dbColName:string,accept:string="images/*") => {
        setUserDetails({ ...userDetails });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
    
    
    
const photoBodyTemplate =()=> {  
let imageURL= config.serverURI+"/"+userDetails.photo
let fileURL= "/file_icon.png"
let fileNoURL= "/file_icon_na.png"
let contetnt;

let acceptFile="images/*"
if(userDetails.photo!=undefined && userDetails.photo!=''){
    contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(userDetails.id??'')}  src={imageURL}  alt="photo"  preview downloadable width="250" /> ;
}else if(userDetails.photo==undefined || userDetails.photo=='' ){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(userDetails.id??'')}  src="/photo_na.png"  alt="photo" width="250" /> ;
}
return (
<>
    <div className="card flex justify-content-center">
    {contetnt}
    </div>

{currentImage == userDetails.id && (
<Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(userDetails,'photo',acceptFile)} aria-label="Bookmark" style={{
    position: "relative",
    top: "-105px",
    right: "-35px"
  }} /> 
)}
</>
)
};
    
const icdocumentBodyTemplate =()=> {  
let imageURL= config.serverURI+"/"+userDetails.icdocument
let fileURL= "/file_icon.png"
let fileNoURL= "/file_icon_na.png"
let contetnt;

let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
if(userDetails.icdocument!=undefined && userDetails.icdocument!='' && userDetails.icdocument.match(/.(jpg|jpeg|png|gif)$/i)){
    contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(userDetails.id??'')}  src={imageURL}  alt="icdocument"  preview downloadable width="250" /> ;
}else if(userDetails.icdocument!=undefined && userDetails.icdocument!='' && !userDetails.icdocument.match(/.(jpg|jpeg|png|gif)$/i)){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(userDetails.id??'')} onClick={()=>downloadFile(userDetails,'icdocument')}  src={fileURL}  alt="icdocument"  width="250" /> ;
}else if(userDetails.icdocument==undefined || userDetails.icdocument=='' ){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(userDetails.id??'')}  src={fileNoURL}  alt="icdocument" width="250" /> ;
}
return (
<>
    <div className="card flex justify-content-center">
    {contetnt}
    </div>

{currentImage == userDetails.id && (
<Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(userDetails,'icdocument',acceptFile)} aria-label="Bookmark" style={{
    position: "relative",
    top: "-105px",
    right: "-35px"
  }} /> 
)}
</>
)
};
    useEffect(() => {
        setLoading(true);
        (async() => {
        let idVal:string = id?.toString()||"";
        let d=  await userdetailsService.getUserDetailsDetails(idVal);
        if(d.error==undefined ){
        setUserDetails(d.data);
        setLoading(false);
        toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data Loaded', life: 3000 });
        }else{
        setLoading(false)
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
    })()
}, []);
    

    return (
         <>

<BlockViewer header="UserDetails details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    {photoBodyTemplate()}{icdocumentBodyTemplate()}
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{userDetails.address}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">IC/Passport</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{userDetails.icpassport}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof UserDetails)} url={uploadInfo?.url} table="userDetails" tableId={userDetails.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
    
</>

);

    
};

UserDetailsDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default UserDetailsDetails;

