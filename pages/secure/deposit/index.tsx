import getConfig from 'next/config';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable,DataTableFilterMeta,DataTableFilterEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import {MultiSelect} from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import {validateForm,validate} from '@lib/validation'
import {ListType,SortType} from '@services/CommonTypes'
import { useRouter } from 'next/router'
import Link from 'next/link';
import config from "@config/index"; 
import {Deposit,DepositQuery,DepositKey, DepositService } from '@services/Deposit';
import {WalletType, WalletTypeService } from '@services/WalletType';
import {Ewallets, EwalletsService } from '@services/Ewallets';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const DepositPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'wallettype',type:validate.text,required:true},
{id:'wallet',type:validate.text,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'method',type:validate.text,required:true},
{id:'comments',type:validate.text,max:300,min:0,required:true},
{id:'status',type:validate.text,required:true}
    ]
let emptyDeposit:Deposit = {
    amount: 0,
method: ''
};
const [deposits, setDeposits] = useState<Deposit[]>([]);
const [backupDeposits, setBackupDeposits] =  useState<Deposit[]>([]);
const [loading,setLoading] = useState(false);
const [depositDialog, setDepositDialog] = useState(false);
const [deleteDepositDialog, setDeleteDepositDialog] = useState(false);
const [deleteDepositsDialog, setDeleteDepositsDialog] = useState(false);
const [deposit, setDeposit] = useState<Deposit>(emptyDeposit);
const [selectedDeposits, setSelectedDeposits] = useState<Deposit[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Deposit[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const depositService = new DepositService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const wallettypeService = new WalletTypeService();
    const [datawalletTypes, setDataWalletTypes] = useState<WalletType[]>([]);
    const ewalletsService = new EwalletsService();
    const [dataewalletss, setDataEwalletss] = useState<Ewallets[]>([]);
    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await depositService.getDeposit({limit:row});
    if(d.error==undefined ){
        setDeposits(d.docs);
        setBackupDeposits(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataWalletTypes_=  await wallettypeService.getWalletTypeAll({});
    setDataWalletTypes(dataWalletTypes_.data);
              
         
    let dataEwalletss_=  await ewalletsService.getEwalletsAll({});
    setDataEwalletss(dataEwalletss_.data);
              
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data Loaded', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
   })()
    initFilters1();
    
}, [refreshFlag]);
const initFilters1 = () => {
    setFilters1({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        wallettype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
wallet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
method: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        
    });

};
    
    const documentBodyTemplate = (rowData:Deposit) => {  
    let imageURL= config.serverURI+"/"+rowData.document
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
    if(rowData.document!=undefined && rowData.document!='' && rowData.document.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="document"  preview downloadable width="250" /> ;
    }else if(rowData.document!=undefined && rowData.document!='' && !rowData.document.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')} onClick={()=>downloadFile(rowData,'document')}  src={fileURL}  alt="document"  width="250" /> ;
    }else if(rowData.document==undefined || rowData.document=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={fileNoURL}  alt="document" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'document',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              

    const datamethods =[
	{value:"Online",name:"Online"},
	{value:"Bank-Transfer",name:"Bank-Transfer"},
	{value:"USDT",name:"USDT"},
	{value:"ETH",name:"ETH"},
	{value:"BTC",name:"BTC"}
]
                

    const datastatuss =[
	{value:"Pending-Verification",name:"Pending-Verification"},
	{value:"Confirmed",name:"Confirmed"},
	{value:"Declined",name:"Declined"}
]
                

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
        let _deposits = [...deposits];
        const index = _deposits.findIndex(c => c.id === deposit.id)
        if (index !== -1) {
            _deposits[index] = _deposit;
        }
        setDeposit(_deposit);
        setDeposits(_deposits);
                
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
                
const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const wallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="code" optionValue="code" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
    const walletFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallet Picker</div>
                <Dropdown value={options.value} options={dataewalletss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="id" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const amountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
    const methodFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Method Picker</div>
                <Dropdown value={options.value} options={datamethods}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="value" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
    const statusFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Status Picker</div>
                <Dropdown value={options.value} options={datastatuss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="value" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setDeposit(emptyDeposit);
    setSubmitted(false);
    setDepositDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setDepositDialog(false);
};

const hideDeleteDepositDialog = () => {
    setDeleteDepositDialog(false);
};

const hideDeleteDepositsDialog = () => {
    setDeleteDepositsDialog(false);
};

const saveDeposit = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(deposit,validation)
        if (validationErrors.length==0) {
        let _deposits:Deposit[] = [...deposits];
        let _deposit:Deposit = { ...deposit };
        if (deposit.id) {
        
            let d=  await depositService.updateDeposit(_deposit);
                if(d.error==undefined){
                    
                    const index = _deposits.findIndex(c => c.id === deposit.id)
                    if (index !== -1) {
                        _deposits[index] = {..._deposit};
                       // _deposits[index] = _deposit;
                        //_deposits.splice(index, 1, {..._deposit,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Deposit Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await depositService.addDeposit(_deposit);
            if(d.error==undefined){
                var newID= d.id
               // _deposits.unshift({..._deposit,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Deposit Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setDeposits(_deposits);
        setBackupDeposits(_deposits);
        setDepositDialog(false);
        setDeposit(emptyDeposit);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editDeposit = (deposit:Deposit) => {
    setDeposit({ ...deposit });
    setDepositDialog(true);
};

const confirmDeleteDeposit = (deposit:Deposit) => {
    setDeposit(deposit);
    setDeleteDepositDialog(true);
};

const deleteDeposit = async() => {

    let d=  await depositService.deleteDeposit(deposit.id??'');
    if(d.error==undefined){
        let _deposits = deposits.filter((val) => val.id !== deposit.id);
        setDeposits(_deposits);
        setBackupDeposits(_deposits);
        setDeleteDepositDialog(false);
        setDeposit(emptyDeposit);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Deposit Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Deposit Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteDepositsDialog(true);
};

const deleteSelectedDeposits = () => {
    let _deposits = deposits.filter((val) => !selectedDeposits.includes(val));
    setDeposits(_deposits);
    setDeleteDepositsDialog(false);
    setSelectedDeposits([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Deposits Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:DepositKey) => {
    let val = (e.target && e.target.value) || '';
    let _deposit:Deposit = { ...deposit };
    _deposit[name] = val;
    setDeposit(_deposit);
};
const onInputBooleanChange=(e:any, name:DepositKey)=>{
    let val =  e.target.value;
    let _deposit:Deposit = { ...deposit };
    _deposit[name] = val;

    setDeposit(_deposit);
}

const onInputChange = (e:any, name:DepositKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=deposit[name];	
           	
            if(ctrlType=="radio"){	
                aVal = val.value;	
            }else if(ctrlType=="checkbox"){	
            	
                if (e.checked){	
                    aVal.push(val.value);	
                }else{	
                    aVal = aVal.filter((d:any) => d !== e.target.value.value);	
                }	
            }	
            val = aVal;	
        }else{	
            val= val[name]?val[name]:val	
        }	
        	
    }	
    
    
    let _deposit:Deposit = { ...deposit };
    _deposit[name] = val;

    setDeposit(_deposit);
};

const onInputNumberChange = (e: any, name:DepositKey) => {
    let val = e.value || 0;
    let _deposit = { ...deposit };
    _deposit[name] = val;

    setDeposit(_deposit);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:DepositQuery={}
    for (const key in e.filters) {  
    
        if(e.filters[key].constraints){
            if(e.filters[key].constraints[0].value){
                searchObj={...searchObj,[key]:e.filters[key].constraints[0].value,[key+'_mode']:e.filters[key].constraints[0].matchMode}
            }
        }
        }
        if(type==0){ // FILTER Data and start with page 0
        searchObj={...searchObj,page:0,limit:row}
        }else if(type==1){ // Change page number
        searchObj={...searchObj,page:e.page,limit:row}
        }else if(type==2){ // Change page number
        let sort:SortType={}
        if(sortOrders){
            let currentSortOrder = sortOrders[e.sortField]==1?-1:1
            sort={...sortOrders,[e.sortField]:currentSortOrder}
        
        }else{
            sort={[e.sortField]:1}
        }
        
        setSortOrders(sort);

        searchObj={...searchObj,page:e.page,limit:row,sortBy:e.sortField,sortDirection:sortOrders[e.sortField]}
        }
        if(e.rows!==row){
        setRow(e.rows)
        searchObj={...searchObj,page:0,limit:e.rows}
        }
        
        let d=  await depositService.getDeposit(searchObj);
        if(d.error==undefined ){
            
            setDeposits(d.docs);
            setBackupDeposits(d.docs);
            setLoading(false)
            setTotalRecords(d.count)
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data retrived', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
}
const filterAction=async(e:DataTableFilterEvent)=>{
    await getNewData(e,0)
}
const changePage =async(e:DataTableFilterEvent)=>{
    await getNewData(e,1)
}
const sortData=async(e:DataTableFilterEvent)=>{

    await getNewData(e,2)
}

const localFilter=(val:string)=>{
    
    if(val.length>1){
        let _deposits =[...deposits];
        let filtered = _deposits.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setDeposits(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setDeposits(backupDeposits);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDeposits || !selectedDeposits.length} />
            </div>
        </React.Fragment>
    );
};

const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );
};



const actionBodyTemplate = (rowData:Deposit) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDeposit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDeposit(rowData)} />
        
            <Link 
                href={{
                pathname: asPath+"/"+rowData.id
                }}

            >
            <Button icon="pi pi-book" className="p-button-rounded p-button-success" />
            </Link>

        </>
    );
};

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Manage Deposits</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const depositDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDeposit} />
    </>
);
const deleteDepositDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDepositDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDeposit} />
    </>
);
const deleteDepositsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDepositsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDeposits} />
    </>
);

return (
    <div className="grid crud-demo">
        <div className="col-12">
            <div className="card">
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    ref={dt}
                    value={deposits}
                    selection={selectedDeposits}
                    onSelectionChange={(e) => setSelectedDeposits(e.value as Deposit[])}
                    dataKey="id"
                    loading={loading}
                    filters={filters1}
                    showGridlines
                    filterDisplay="menu"
                    onFilter={filterAction}
                    paginator
                    totalRecords={totalRecords}
                    rows={row}
                    lazy={true}
                    onSort={sortData}
                    onPage={changePage}
                    rowsPerPageOptions={[1,5, 10, 25,50]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Deposits"
                    emptyMessage="No Deposits found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="wallettype" header="Wallet type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallettype"   filter filterElement={wallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="wallet" header="Wallet" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallet"   filter filterElement={walletFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="amount" header="Amount" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={amountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="method" header="Method" sortable  headerStyle={{ minWidth: '10rem' }} filterField="method"   filter filterElement={methodFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="document" header="Document" sortable  headerStyle={{ minWidth: '10rem' }}  body={documentBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="comments" header="Comments" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by comments" ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={depositDialog} style={{ width: '450px' }} header="Deposit Details" modal className="p-fluid" footer={depositDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="wallettype">Wallet type</label>
         <Dropdown   id="wallettype"  optionLabel="code" optionValue="code"  value={deposit.wallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'wallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="wallet">Wallet</label>
         <Dropdown   id="wallet"  optionLabel="name" optionValue="id"  value={deposit.wallet} options={dataewalletss} onChange={(e) => onInputChange(e, 'wallet')}  />
    </div>
            

    <div className="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" value={deposit.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')}  />
    </div>
            


    <div className="field">
        <label htmlFor="method">Method</label>
         <Dropdown   id="method" optionLabel="name"  value={deposit.method} options={datamethods} onChange={(e) => onInputChange(e, 'method')}  />
    </div>
            

    <div className="field">
        <label htmlFor="comments">Comments</label>
         <InputTextarea id="comments" value={deposit.comments} onChange={(e) => onInputChange(e, 'comments')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !deposit.comments })} />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={deposit.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteDepositDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDepositDialogFooter} onHide={hideDeleteDepositDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {deposit && (
                            <span>
                                Are you sure you want to delete <b>Deposit record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteDepositsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDepositsDialogFooter} onHide={hideDeleteDepositsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {deposit && <span>Are you sure you want to delete the selected Deposit?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Deposit)} url={uploadInfo?.url} table="deposit" tableId={deposit.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default DepositPage;
        
       
        