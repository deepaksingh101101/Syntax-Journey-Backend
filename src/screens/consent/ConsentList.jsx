import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { deleteApi, getApi } from '../../helpers/requestHelpers';
import Swal from 'sweetalert2';
import Loader from '../../components/loader/Loader';
import { AreaTop } from '../../components';


export default function ConsentList() {
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const getAllConsentList = async () => {
    setLoader(true);
    let res = await getApi('get', 'api/consent/getAllConsent');
    setOriginalData(res?.data?.consentData || []);
    setFilteredData(res?.data?.consentData || []);
    setLoader(false);
  };

  useEffect(() => {
    getAllConsentList();
  }, []);

  const handleDeleteConsent = async (_id) => {
    await Swal.fire({
      title: 'Are you sure want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await deleteApi('delete', `api/consent/consentById?consentId=${_id}`);
          if (res?.data?.status === true) {
            setFilteredData((prevData) => prevData.filter((item) => item._id !== _id));
            setOriginalData((prevData) => prevData.filter((item) => item._id !== _id));
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const generateActionButtons = (row) => (
    <div>
      <Link to={`/viewConsent/${row._id}`}>
        <button className="btn btn-primary mx-2">
          <i className="fa-solid fa-eye"></i>
        </button>
      </Link>
      <button className="btn btn-danger mx-2" onClick={() => handleDeleteConsent(row?._id)}>
        <i className="fa-solid fa-trash"></i>
      </button>
      <Link to={`/editConsent/${row._id}`}>
        <button className="btn btn-info mx-2">
          <i className="text-white fa-solid fa-pen-to-square"></i>
        </button>
      </Link>
    </div>
  );

  const columns = [
    {
      name: 'Sno',
      selector: (row) => row.sno,
      sortable: true,
    },
    {
      name: 'Patient Name',
      selector: (row) => row.patientName,
      sortable: true,
    },
    {
      name: 'Case Type',
      selector: (row) => row.caseType,
      sortable: true,
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.mobileNo,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => row.actions,
      sortable: true,
      width: 'auto',
    },
  ];

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = originalData.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key]?.toString().toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const modifiedData = filteredData.map((row, index) => ({
    ...row,
    mobileNo: row?.mobileNo,
    createdBy: row?.createdBy ? row?.createdBy : 'Unknown',
    sno: index + 1,
    actions: generateActionButtons(row),
  }));


  const handleSearchSubmit=(e)=>{
e.preventDefault()
return
  }
  return (
    <>
      {loader && (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loader && (
        <div className="content-area">
      <AreaTop title='Consent Form List'/>
        <div style={{ minHeight: '90vh' }} className="container consentForm p-5">
          <div className="d-flex align-items-center mb-3 pb-3 justify-content-end">
            <div className="search-container">
              <form onSubmit={handleSearchSubmit}  className="d-flex flex-row-reverse" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
          </div>

          <DataTable columns={columns} data={modifiedData} pagination responsive />
        </div>
        </div>
      )}
    </>
  );
}
