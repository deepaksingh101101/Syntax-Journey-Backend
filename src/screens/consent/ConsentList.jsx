import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { getApi } from '../../helpers/requestHelpers';

export default function ConsentList() {


    const [filteredData, setFilteredData] = useState()

    const getAllConsentList=async()=>{
        let res=await getApi("get","api/consent/getAllConsent")
        
        setFilteredData(res?.data?.consentData)
    }

    useEffect(() => {
    getAllConsentList()
    }, [])


    const generateActionButtons = (row) => (
        <div>
          <Link to={`/adminProfile/${row.id}`}>
            <button className="btn btn-primary mx-2">
            <i className="fa-solid fa-eye"></i>
            </button>
          </Link>
          <button className="btn btn-danger mx-2">
          <i className="fa-solid fa-trash"></i>          </button>
          <Link to={`/editAdmin/${row.id}`}>
            <button className="btn btn-info mx-2">
            <i  className=" text-white fa-solid fa-pen-to-square"></i>            </button>
          </Link>
        </div>
      );


      const columns = [
        {
          name: 'Sno',
          selector: row => row.sno,
          sortable: true,
        },
        {
          name: 'Patient Name',
          selector: row => row.patientName,
          sortable: true,
        },
        {
          name: 'Case Type',
          selector: row => row.caseType,
          sortable: true,
        },
        {
          name: 'Mobile Number',
          selector: row => row.mobileNo,
          sortable: true,
        },
        {
          name: 'Created By',
          selector: row => row.createdBy,
          sortable: true,
        },
        {
          name: 'Actions',
          selector: row => row.actions,
          sortable: true,
          width: "auto"
        },
      ];
      
   
      const modifiedData = filteredData?.map((row, index) => ({
        ...row,
        mobileNo: row?.mobileNo ,
        createdBy: row?.createdBy ? row?.createdBy : 'Unknown',
        sno: index + 1,
        actions: generateActionButtons(row),
      }));
      
      

  return (
    <div className="container consentForm p-5">
                 <DataTable
  columns={columns}
  data={modifiedData}
  pagination
  responsive
/>
                    </div>
  )
}
