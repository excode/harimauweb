
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
import {Deposit,DepositService,DepositKey } from '@services/Deposit';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Dialog } from 'primereact/dialog';
    
const DepositDetails = () => {
    const router = useRouter()
    const depositService = new DepositService();
    const [deposit, setDeposit] = useState<Deposit>({wallettype:"",wallet:"",amount:0,document:"",method:"",comments:"",status:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');
    
    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }

    const downloadFile=(data:Deposit,dbColName:DepositKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:DepositKey) => {
        let _deposit = {...deposit,[colName]:newUploadedFileName}
        setDeposit(_deposit);
                
    };
    const showUploadDialog = (deposit:Deposit,dbColName:string,accept:string="images/*") => {
        setDeposit({ ...deposit });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
    
    
    
const documentBodyTemplate =()=> {  
let imageURL= config.serverURI+"/"+deposit.document
let fileURL= "/file_icon.png"
let fileNoURL= "/file_icon_na.png"
let contetnt;

let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
if(deposit.document!=undefined && deposit.document!='' && deposit.document.match(/.(jpg|jpeg|png|gif)$/i)){
    contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(deposit.id??'')}  src={imageURL}  alt="document"  preview downloadable width="250" /> ;
}else if(deposit.document!=undefined && deposit.document!='' && !deposit.document.match(/.(jpg|jpeg|png|gif)$/i)){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(deposit.id??'')} onClick={()=>downloadFile(deposit,'document')}  src={fileURL}  alt="document"  width="250" /> ;
}else if(deposit.document==undefined || deposit.document=='' ){
    contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(deposit.id??'')}  src={fileNoURL}  alt="document" width="250" /> ;
}
return (
<>
    <div className="card flex justify-content-center">
    {contetnt}
    </div>

{currentImage == deposit.id && (
<Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(deposit,'document',acceptFile)} aria-label="Bookmark" style={{
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
        let d=  await depositService.getDepositDetails(idVal);
        if(d.error==undefined ){
        setDeposit(d.data);
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

<BlockViewer header="Deposit details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    {documentBodyTemplate()}
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Wallet type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.wallettype}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Wallet</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.wallet}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Amount</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.amount}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Method</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.method}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Comments</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.comments}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Status</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{deposit.status}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Deposit)} url={uploadInfo?.url} table="deposit" tableId={deposit.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
    
</>

);

    
};

DepositDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default DepositDetails;

