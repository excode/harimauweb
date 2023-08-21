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
import {Banks,BanksQuery,BanksKey, BanksService } from '@services/Banks';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const BanksPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'accountname',type:validate.text,max:100,min:2,required:true},
{id:'accountnumber',type:validate.text,max:30,min:3,required:true},
{id:'bankname',type:validate.text,max:3,min:2,required:true},
{id:'swiftcode',type:validate.text,max:20,min:4,required:true},
{id:'bankaddress',type:validate.text,max:300,min:10,required:true},
{id:'city',type:validate.text,max:50,min:1,required:true},
{id:'state',type:validate.text,max:20,min:2,required:true},
{id:'postcode',type:validate.text,max:20,min:2,required:true},
{id:'active',type:validate.boolean,required:true}
    ]
let emptyBanks:Banks = {
    bankname: '',
swiftcode: '',
bankaddress: '',
city: '',
state: '',
postcode: '',
accountname: '',
accountnumber: '',
active: false
};
const [bankss, setBankss] = useState<Banks[]>([]);
const [backupBankss, setBackupBankss] =  useState<Banks[]>([]);
const [loading,setLoading] = useState(false);
const [banksDialog, setBanksDialog] = useState(false);
const [deleteBanksDialog, setDeleteBanksDialog] = useState(false);
const [deleteBankssDialog, setDeleteBankssDialog] = useState(false);
const [banks, setBanks] = useState<Banks>(emptyBanks);
const [selectedBankss, setSelectedBankss] = useState<Banks[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Banks[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const banksService = new BanksService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


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
    let d=  await banksService.getBanks({limit:row});
    if(d.error==undefined ){
        setBankss(d.docs);
        setBackupBankss(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
        
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
        accountname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
accountnumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bankname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
postcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
active: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
swiftcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bankaddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};
    
    const documentBodyTemplate = (rowData:Banks) => {  
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
              

    const downloadFile=(data:Banks,dbColName:BanksKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:BanksKey) => {
        let _banks = {...banks,[colName]:newUploadedFileName}
        let _bankss = [...bankss];
        const index = _bankss.findIndex(c => c.id === banks.id)
        if (index !== -1) {
            _bankss[index] = _banks;
        }
        setBanks(_banks);
        setBankss(_bankss);
                
    };
    const showUploadDialog = (banks:Banks,dbColName:string,accept:string="images/*") => {
        setBanks({ ...banks });
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
            
const activeFilterTemplate = (options:any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setBanks(emptyBanks);
    setSubmitted(false);
    setBanksDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setBanksDialog(false);
};

const hideDeleteBanksDialog = () => {
    setDeleteBanksDialog(false);
};

const hideDeleteBankssDialog = () => {
    setDeleteBankssDialog(false);
};

const saveBanks = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(banks,validation)
        if (validationErrors.length==0) {
        let _bankss:Banks[] = [...bankss];
        let _banks:Banks = { ...banks };
        if (banks.id) {
        
            let d=  await banksService.updateBanks(_banks);
                if(d.error==undefined){
                    
                    const index = _bankss.findIndex(c => c.id === banks.id)
                    if (index !== -1) {
                        _bankss[index] = {..._banks};
                       // _bankss[index] = _banks;
                        //_bankss.splice(index, 1, {..._banks,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Banks Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await banksService.addBanks(_banks);
            if(d.error==undefined){
                var newID= d.id
               // _bankss.unshift({..._banks,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Banks Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setBankss(_bankss);
        setBackupBankss(_bankss);
        setBanksDialog(false);
        setBanks(emptyBanks);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editBanks = (banks:Banks) => {
    setBanks({ ...banks });
    setBanksDialog(true);
};

const confirmDeleteBanks = (banks:Banks) => {
    setBanks(banks);
    setDeleteBanksDialog(true);
};

const deleteBanks = async() => {

    let d=  await banksService.deleteBanks(banks.id??'');
    if(d.error==undefined){
        let _bankss = bankss.filter((val) => val.id !== banks.id);
        setBankss(_bankss);
        setBackupBankss(_bankss);
        setDeleteBanksDialog(false);
        setBanks(emptyBanks);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Banks Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Banks Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteBankssDialog(true);
};

const deleteSelectedBankss = () => {
    let _bankss = bankss.filter((val) => !selectedBankss.includes(val));
    setBankss(_bankss);
    setDeleteBankssDialog(false);
    setSelectedBankss([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Bankss Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:BanksKey) => {
    let val = (e.target && e.target.value) || '';
    let _banks:Banks = { ...banks };
    _banks[name] = val;
    setBanks(_banks);
};
const onInputBooleanChange=(e:any, name:BanksKey)=>{
    let val =  e.target.value;
    let _banks:Banks = { ...banks };
    _banks[name] = val;

    setBanks(_banks);
}

const onInputChange = (e:any, name:BanksKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=banks[name];	
           	
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
    
    
    let _banks:Banks = { ...banks };
    _banks[name] = val;

    setBanks(_banks);
};

const onInputNumberChange = (e: any, name:BanksKey) => {
    let val = e.value || 0;
    let _banks = { ...banks };
    _banks[name] = val;

    setBanks(_banks);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:BanksQuery={}
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
        
        let d=  await banksService.getBanks(searchObj);
        if(d.error==undefined ){
            
            setBankss(d.docs);
            setBackupBankss(d.docs);
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
        let _bankss =[...bankss];
        let filtered = _bankss.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setBankss(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setBankss(backupBankss);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedBankss || !selectedBankss.length} />
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



const actionBodyTemplate = (rowData:Banks) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBanks(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBanks(rowData)} />
        
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
        <h5 className="m-0">Manage Bankss</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const banksDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveBanks} />
    </>
);
const deleteBanksDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBanksDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteBanks} />
    </>
);
const deleteBankssDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankssDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedBankss} />
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
                    value={bankss}
                    selection={selectedBankss}
                    onSelectionChange={(e) => setSelectedBankss(e.value as Banks[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Bankss"
                    emptyMessage="No Bankss found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="accountname" header="Account name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by accountname" ></Column>
            

    <Column showAddButton={false}  field="accountnumber" header="Account number" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by accountnumber" ></Column>
            

    <Column showAddButton={false}  field="bankname" header="Bank Name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by bankname" ></Column>
            

    <Column showAddButton={false}  field="city" header="City" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by city" ></Column>
            

    <Column showAddButton={false}  field="state" header="State" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by state" ></Column>
            

    <Column showAddButton={false}  field="postcode" header="Postcode" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by postcode" ></Column>
            

    <Column showAddButton={false}  field="active" header="Active" sortable  headerStyle={{ minWidth: '10rem' }} filterField="active" dataType="boolean"  filter filterElement={activeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="swiftcode" header="Swiftcode" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by swiftcode" ></Column>
            

    <Column showAddButton={false}  field="bankaddress" header="Bank address" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by bankaddress" ></Column>
            

    <Column showAddButton={false}  field="document" header="Document" sortable  headerStyle={{ minWidth: '10rem' }}  body={documentBodyTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={banksDialog} style={{ width: '450px' }} header="Banks Details" modal className="p-fluid" footer={banksDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="accountname">Account name</label>
         <InputText id="accountname" value={banks.accountname} onChange={(e) => onInputChange(e, 'accountname')}    required className={classNames({ 'p-invalid': submitted && !banks.accountname })} />
    </div>
            

    <div className="field">
        <label htmlFor="accountnumber">Account number</label>
         <InputText id="accountnumber" value={banks.accountnumber} onChange={(e) => onInputChange(e, 'accountnumber')}    required className={classNames({ 'p-invalid': submitted && !banks.accountnumber })} />
    </div>
            

    <div className="field">
        <label htmlFor="bankname">Bank Name</label>
         <InputText id="bankname" value={banks.bankname} onChange={(e) => onInputChange(e, 'bankname')}    required className={classNames({ 'p-invalid': submitted && !banks.bankname })} />
    </div>
            

    <div className="field">
        <label htmlFor="swiftcode">Swiftcode</label>
         <InputText id="swiftcode" value={banks.swiftcode} onChange={(e) => onInputChange(e, 'swiftcode')}    required className={classNames({ 'p-invalid': submitted && !banks.swiftcode })} />
    </div>
            

    <div className="field">
        <label htmlFor="bankaddress">Bank address</label>
         <InputTextarea id="bankaddress" value={banks.bankaddress} onChange={(e) => onInputChange(e, 'bankaddress')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !banks.bankaddress })} />
    </div>
            

    <div className="field">
        <label htmlFor="city">City</label>
         <InputText id="city" value={banks.city} onChange={(e) => onInputChange(e, 'city')}    required className={classNames({ 'p-invalid': submitted && !banks.city })} />
    </div>
            

    <div className="field">
        <label htmlFor="state">State</label>
         <InputText id="state" value={banks.state} onChange={(e) => onInputChange(e, 'state')}    required className={classNames({ 'p-invalid': submitted && !banks.state })} />
    </div>
            

    <div className="field">
        <label htmlFor="postcode">Postcode</label>
         <InputText id="postcode" value={banks.postcode} onChange={(e) => onInputChange(e, 'postcode')}    required className={classNames({ 'p-invalid': submitted && !banks.postcode })} />
    </div>
            

    <div className="field">
        <label htmlFor="active">Active</label>
         <TriStateCheckbox  name="active"  id="active" value={banks.active} onChange={(e) => onInputBooleanChange(e, 'active')}  />
    </div>
            

                </Dialog>

                <Dialog visible={deleteBanksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBanksDialogFooter} onHide={hideDeleteBanksDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {banks && (
                            <span>
                                Are you sure you want to delete <b>Banks record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteBankssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBankssDialogFooter} onHide={hideDeleteBankssDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {banks && <span>Are you sure you want to delete the selected Banks?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Banks)} url={uploadInfo?.url} table="banks" tableId={banks.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default BanksPage;
        
       
        