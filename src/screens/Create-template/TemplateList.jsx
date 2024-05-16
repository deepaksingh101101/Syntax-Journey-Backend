import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Loader from '../../components/loader/Loader'
import { deleteApi, getApi } from '../../helpers/requestHelpers';
export default function TemplateList() {

    const [loader, setLoader] = useState(true)

    const [filteredData, setFilteredData] = useState()

    const getAllTemplateList=async()=>{
        setLoader(true)
        let res=await getApi("get","api/template/getAllTemplate")
        console.log(res)
        setFilteredData(res?.data?.templates)
        setLoader(false)
    }

    useEffect(() => {
    getAllTemplateList()
    }, [])

 

    const handleDeleteConsent=async(_id)=>{

       await Swal.fire({
            title: "Are you sure want to delete?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                let res= await deleteApi("delete",`api/consent/consentById?consentId=${_id}`)
                if(res?.data?.status===true){
                    setFilteredData(prevData => prevData.filter(item => item._id !== _id));
                }
              } catch (error) {
                console.log(error)
              }
            }
          });


    }

    const generateActionButtons = (row) => (
        <div>
          <Link to={`/viewTemplate/${row._id}`}>
            <button className="btn btn-primary mx-2">
            <i className="fa-solid fa-eye"></i>
            </button>
          </Link>
          <button className="btn btn-danger mx-2" onClick={(e)=>handleDeleteConsent(row?._id)}>
          <i className="fa-solid fa-trash"></i>          </button>
          <Link to={`/editConsent/${row._id}`}>
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
          name: 'Template Id',
          selector: row => row._id,
          sortable: true,
        },
        {
          name: 'Case Type',
          selector: row => row.caseType,
          sortable: true,
        },
        {
          name: 'Created At',
          selector: row => row.createdAt,
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
        templateId: row?._id ,
        sno: index + 1,
        actions: generateActionButtons(row),
      }));
      
      

  return (
  <>
   {loader &&
   <div className="d-flex w-100 justify-content-center align-items-centers">
       <Loader/>
   </div>
}
{ !loader && <div style={{minHeight:"90vh"}} className="container consentForm p-5">
             <DataTable
columns={columns}
data={modifiedData}
pagination
responsive
/>
                </div>}
  </>
                    
  )
}
