
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
import {Withdraw,WithdrawService,WithdrawKey } from '@services/Withdraw';

const WithdrawDetails = () => {
    const router = useRouter()
    const withdrawService = new WithdrawService();
    const [withdraw, setWithdraw] = useState<Withdraw>({wallettype:"",wallet:"",amount:0,status:"",comment:""});
    const [loading,setLoading] = useState(false);
    const  {id} = router.query;
    const toast = useRef<Toast>(null);

    const defaultImage=(e:any)=>{
        e.target.src ="/photo_na.png"
    }


    useEffect(() => {
        setLoading(true);
        (async() => {
        let idVal:string = id?.toString()||"";
        let d=  await withdrawService.getWithdrawDetails(idVal);
        if(d.error==undefined ){
        setWithdraw(d.data);
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

<BlockViewer header="Withdraw details"  containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
<Toast ref={toast} />
<div className="surface-section">   
    {loading?<div className="flex justify-content-center flex-wrap"><i className="pi pi-spin pi-cog" style={{ fontSize: '5rem' }}></i></div>:(
    <>
    
    <ul className="list-none p-0 m-0">
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Walet type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{withdraw.wallettype}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Wallet</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{withdraw.wallet}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Amount</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{withdraw.amount}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Status</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{withdraw.status}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Comment</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{withdraw.comment}</div>
        
    </li>       
  
                
    </ul>
    </>
    )}
</div>

</BlockViewer>

</>

);

    
};

WithdrawDetails.getInitialProps = (ctx:any) => {  
    const { id } = ctx.query;
  
    return {
        id
    };
  };
  
export default WithdrawDetails;

