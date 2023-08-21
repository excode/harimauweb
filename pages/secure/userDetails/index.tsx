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
import {UserDetails,UserDetailsQuery,UserDetailsKey, UserDetailsService } from '@services/UserDetails';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const UserDetailsPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'address',type:validate.text,max:300,min:2,required:true},
{id:'icpassport',type:validate.username,max:25,min:2,required:true}
    ]
let emptyUserDetails:UserDetails = {
    address: '',
icpassport: ''
};
const [userDetailss, setUserDetailss] = useState<UserDetails[]>([]);
const [backupUserDetailss, setBackupUserDetailss] =  useState<UserDetails[]>([]);
const [loading,setLoading] = useState(false);
const [userDetailsDialog, setUserDetailsDialog] = useState(false);
const [deleteUserDetailsDialog, setDeleteUserDetailsDialog] = useState(false);
const [deleteUserDetailssDialog, setDeleteUserDetailssDialog] = useState(false);
const [userDetails, setUserDetails] = useState<UserDetails>(emptyUserDetails);
const [selectedUserDetailss, setSelectedUserDetailss] = useState<UserDetails[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<UserDetails[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const userdetailsService = new UserDetailsService();
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
    let d=  await userdetailsService.getUserDetails({limit:row});
    if(d.error==undefined ){
        setUserDetailss(d.docs);
        setBackupUserDetailss(d.docs);
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
        icpassport: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};
    
    const photoBodyTemplate = (rowData:UserDetails) => {  
    let imageURL= config.serverURI+"/"+rowData.photo
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="images/*"
    if(rowData.photo!=undefined && rowData.photo!=''){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="photo"  preview downloadable width="250" /> ;
    }else if(rowData.photo==undefined || rowData.photo=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src="/photo_na.png"  alt="photo" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'photo',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              
    
    const icdocumentBodyTemplate = (rowData:UserDetails) => {  
    let imageURL= config.serverURI+"/"+rowData.icdocument
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
    if(rowData.icdocument!=undefined && rowData.icdocument!='' && rowData.icdocument.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="icdocument"  preview downloadable width="250" /> ;
    }else if(rowData.icdocument!=undefined && rowData.icdocument!='' && !rowData.icdocument.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')} onClick={()=>downloadFile(rowData,'icdocument')}  src={fileURL}  alt="icdocument"  width="250" /> ;
    }else if(rowData.icdocument==undefined || rowData.icdocument=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={fileNoURL}  alt="icdocument" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'icdocument',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              

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
        let _userDetailss = [...userDetailss];
        const index = _userDetailss.findIndex(c => c.id === userDetails.id)
        if (index !== -1) {
            _userDetailss[index] = _userDetails;
        }
        setUserDetails(_userDetails);
        setUserDetailss(_userDetailss);
                
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
                
const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setUserDetails(emptyUserDetails);
    setSubmitted(false);
    setUserDetailsDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setUserDetailsDialog(false);
};

const hideDeleteUserDetailsDialog = () => {
    setDeleteUserDetailsDialog(false);
};

const hideDeleteUserDetailssDialog = () => {
    setDeleteUserDetailssDialog(false);
};

const saveUserDetails = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(userDetails,validation)
        if (validationErrors.length==0) {
        let _userDetailss:UserDetails[] = [...userDetailss];
        let _userDetails:UserDetails = { ...userDetails };
        if (userDetails.id) {
        
            let d=  await userdetailsService.updateUserDetails(_userDetails);
                if(d.error==undefined){
                    
                    const index = _userDetailss.findIndex(c => c.id === userDetails.id)
                    if (index !== -1) {
                        _userDetailss[index] = {..._userDetails};
                       // _userDetailss[index] = _userDetails;
                        //_userDetailss.splice(index, 1, {..._userDetails,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'UserDetails Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await userdetailsService.addUserDetails(_userDetails);
            if(d.error==undefined){
                var newID= d.id
               // _userDetailss.unshift({..._userDetails,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'UserDetails Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setUserDetailss(_userDetailss);
        setBackupUserDetailss(_userDetailss);
        setUserDetailsDialog(false);
        setUserDetails(emptyUserDetails);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editUserDetails = (userDetails:UserDetails) => {
    setUserDetails({ ...userDetails });
    setUserDetailsDialog(true);
};

const confirmDeleteUserDetails = (userDetails:UserDetails) => {
    setUserDetails(userDetails);
    setDeleteUserDetailsDialog(true);
};

const deleteUserDetails = async() => {

    let d=  await userdetailsService.deleteUserDetails(userDetails.id??'');
    if(d.error==undefined){
        let _userDetailss = userDetailss.filter((val) => val.id !== userDetails.id);
        setUserDetailss(_userDetailss);
        setBackupUserDetailss(_userDetailss);
        setDeleteUserDetailsDialog(false);
        setUserDetails(emptyUserDetails);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'UserDetails Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'UserDetails Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteUserDetailssDialog(true);
};

const deleteSelectedUserDetailss = () => {
    let _userDetailss = userDetailss.filter((val) => !selectedUserDetailss.includes(val));
    setUserDetailss(_userDetailss);
    setDeleteUserDetailssDialog(false);
    setSelectedUserDetailss([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'UserDetailss Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:UserDetailsKey) => {
    let val = (e.target && e.target.value) || '';
    let _userDetails:UserDetails = { ...userDetails };
    _userDetails[name] = val;
    setUserDetails(_userDetails);
};
const onInputBooleanChange=(e:any, name:UserDetailsKey)=>{
    let val =  e.target.value;
    let _userDetails:UserDetails = { ...userDetails };
    _userDetails[name] = val;

    setUserDetails(_userDetails);
}

const onInputChange = (e:any, name:UserDetailsKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=userDetails[name];	
           	
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
    
    
    let _userDetails:UserDetails = { ...userDetails };
    _userDetails[name] = val;

    setUserDetails(_userDetails);
};

const onInputNumberChange = (e: any, name:UserDetailsKey) => {
    let val = e.value || 0;
    let _userDetails = { ...userDetails };
    _userDetails[name] = val;

    setUserDetails(_userDetails);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:UserDetailsQuery={}
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
        
        let d=  await userdetailsService.getUserDetails(searchObj);
        if(d.error==undefined ){
            
            setUserDetailss(d.docs);
            setBackupUserDetailss(d.docs);
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
        let _userDetailss =[...userDetailss];
        let filtered = _userDetailss.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setUserDetailss(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setUserDetailss(backupUserDetailss);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUserDetailss || !selectedUserDetailss.length} />
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



const actionBodyTemplate = (rowData:UserDetails) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUserDetails(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUserDetails(rowData)} />
        
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
        <h5 className="m-0">Manage UserDetailss</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const userDetailsDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUserDetails} />
    </>
);
const deleteUserDetailsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDetailsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUserDetails} />
    </>
);
const deleteUserDetailssDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDetailssDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUserDetailss} />
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
                    value={userDetailss}
                    selection={selectedUserDetailss}
                    onSelectionChange={(e) => setSelectedUserDetailss(e.value as UserDetails[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} UserDetailss"
                    emptyMessage="No UserDetailss found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="photo" header="Photo" sortable  headerStyle={{ minWidth: '10rem' }}  body={photoBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="icpassport" header="IC/Passport" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by icpassport" ></Column>
            

    <Column showAddButton={false}  field="address" header="Address" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by address" ></Column>
            

    <Column showAddButton={false}  field="icdocument" header="IC Dcoument" sortable  headerStyle={{ minWidth: '10rem' }}  body={icdocumentBodyTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={userDetailsDialog} style={{ width: '450px' }} header="UserDetails Details" modal className="p-fluid" footer={userDetailsDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="address">Address</label>
         <InputTextarea id="address" value={userDetails.address} onChange={(e) => onInputChange(e, 'address')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !userDetails.address })} />
    </div>
            

    <div className="field">
        <label htmlFor="icpassport">IC/Passport</label>
         <InputText id="icpassport" value={userDetails.icpassport} onChange={(e) => onInputChange(e, 'icpassport')}    required className={classNames({ 'p-invalid': submitted && !userDetails.icpassport })} />
    </div>
            


                </Dialog>

                <Dialog visible={deleteUserDetailsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDetailsDialogFooter} onHide={hideDeleteUserDetailsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {userDetails && (
                            <span>
                                Are you sure you want to delete <b>UserDetails record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteUserDetailssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDetailssDialogFooter} onHide={hideDeleteUserDetailssDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {userDetails && <span>Are you sure you want to delete the selected UserDetails?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof UserDetails)} url={uploadInfo?.url} table="userDetails" tableId={userDetails.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default UserDetailsPage;
        
       
        