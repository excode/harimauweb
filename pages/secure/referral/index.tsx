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
import {Referral,ReferralQuery,ReferralKey, ReferralService } from '@services/Referral';


const ReferralPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'email',type:validate.text,max:150,min:5,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'status',type:validate.text,required:true}
    ]
let emptyReferral:Referral = {
    email: '',
amount: 0
};
const [referrals, setReferrals] = useState<Referral[]>([]);
const [backupReferrals, setBackupReferrals] =  useState<Referral[]>([]);
const [loading,setLoading] = useState(false);
const [referralDialog, setReferralDialog] = useState(false);
const [deleteReferralDialog, setDeleteReferralDialog] = useState(false);
const [deleteReferralsDialog, setDeleteReferralsDialog] = useState(false);
const [referral, setReferral] = useState<Referral>(emptyReferral);
const [selectedReferrals, setSelectedReferrals] = useState<Referral[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Referral[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const referralService = new ReferralService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());



const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await referralService.getReferral({limit:row});
    if(d.error==undefined ){
        setReferrals(d.docs);
        setBackupReferrals(d.docs);
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
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};

    const datastatuss =[
	{value:"pending",name:"pending"},
	{value:"confirmed",name:"confirmed"},
	{value:"declined",name:"declined"}
]
                

const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const amountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
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
    setReferral(emptyReferral);
    setSubmitted(false);
    setReferralDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setReferralDialog(false);
};

const hideDeleteReferralDialog = () => {
    setDeleteReferralDialog(false);
};

const hideDeleteReferralsDialog = () => {
    setDeleteReferralsDialog(false);
};

const saveReferral = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(referral,validation)
        if (validationErrors.length==0) {
        let _referrals:Referral[] = [...referrals];
        let _referral:Referral = { ...referral };
        if (referral.id) {
        
            let d=  await referralService.updateReferral(_referral);
                if(d.error==undefined){
                    
                    const index = _referrals.findIndex(c => c.id === referral.id)
                    if (index !== -1) {
                        _referrals[index] = {..._referral};
                       // _referrals[index] = _referral;
                        //_referrals.splice(index, 1, {..._referral,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Referral Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await referralService.addReferral(_referral);
            if(d.error==undefined){
                var newID= d.id
               // _referrals.unshift({..._referral,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Referral Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setReferrals(_referrals);
        setBackupReferrals(_referrals);
        setReferralDialog(false);
        setReferral(emptyReferral);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editReferral = (referral:Referral) => {
    setReferral({ ...referral });
    setReferralDialog(true);
};

const confirmDeleteReferral = (referral:Referral) => {
    setReferral(referral);
    setDeleteReferralDialog(true);
};

const deleteReferral = async() => {

    let d=  await referralService.deleteReferral(referral.id??'');
    if(d.error==undefined){
        let _referrals = referrals.filter((val) => val.id !== referral.id);
        setReferrals(_referrals);
        setBackupReferrals(_referrals);
        setDeleteReferralDialog(false);
        setReferral(emptyReferral);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Referral Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Referral Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteReferralsDialog(true);
};

const deleteSelectedReferrals = () => {
    let _referrals = referrals.filter((val) => !selectedReferrals.includes(val));
    setReferrals(_referrals);
    setDeleteReferralsDialog(false);
    setSelectedReferrals([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Referrals Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:ReferralKey) => {
    let val = (e.target && e.target.value) || '';
    let _referral:Referral = { ...referral };
    _referral[name] = val;
    setReferral(_referral);
};
const onInputBooleanChange=(e:any, name:ReferralKey)=>{
    let val =  e.target.value;
    let _referral:Referral = { ...referral };
    _referral[name] = val;

    setReferral(_referral);
}

const onInputChange = (e:any, name:ReferralKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=referral[name];	
           	
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
    
    
    let _referral:Referral = { ...referral };
    _referral[name] = val;

    setReferral(_referral);
};

const onInputNumberChange = (e: any, name:ReferralKey) => {
    let val = e.value || 0;
    let _referral = { ...referral };
    _referral[name] = val;

    setReferral(_referral);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:ReferralQuery={}
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
        
        let d=  await referralService.getReferral(searchObj);
        if(d.error==undefined ){
            
            setReferrals(d.docs);
            setBackupReferrals(d.docs);
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
        let _referrals =[...referrals];
        let filtered = _referrals.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setReferrals(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setReferrals(backupReferrals);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedReferrals || !selectedReferrals.length} />
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



const actionBodyTemplate = (rowData:Referral) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editReferral(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteReferral(rowData)} />
        
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
        <h5 className="m-0">Manage Referrals</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const referralDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveReferral} />
    </>
);
const deleteReferralDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteReferralDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteReferral} />
    </>
);
const deleteReferralsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteReferralsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedReferrals} />
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
                    value={referrals}
                    selection={selectedReferrals}
                    onSelectionChange={(e) => setSelectedReferrals(e.value as Referral[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Referrals"
                    emptyMessage="No Referrals found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="email" header="Email" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by email" ></Column>
            

    <Column showAddButton={false}  field="amount" header="Amount" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={amountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={referralDialog} style={{ width: '450px' }} header="Referral Details" modal className="p-fluid" footer={referralDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="email">Email</label>
         <InputText id="email" value={referral.email} onChange={(e) => onInputChange(e, 'email')}    required className={classNames({ 'p-invalid': submitted && !referral.email })} />
    </div>
            

    <div className="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" value={referral.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={referral.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteReferralDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteReferralDialogFooter} onHide={hideDeleteReferralDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {referral && (
                            <span>
                                Are you sure you want to delete <b>Referral record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteReferralsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteReferralsDialogFooter} onHide={hideDeleteReferralsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {referral && <span>Are you sure you want to delete the selected Referral?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default ReferralPage;
        
       
        