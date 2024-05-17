import { useEffect, useState } from "react";
import { deleteApi, getApi } from "../../helpers/requestHelpers";
import Swal from "sweetalert2";
import Loader from "../../components/loader/Loader";
import DataTable from "react-data-table-component";
import { Toast } from "../../components/alert/Alert";
import { AreaTop } from "../../components";

export default function ViewAdmin() {
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const getAllAdminList = async () => {
    setLoader(true);
    let res = await getApi("get", "api/user/getAllUsers");
    setOriginalData(res?.data?.allUsers || []);
    setFilteredData(res?.data?.allUsers || []);
    setLoader(false);
  };

  useEffect(() => {
    getAllAdminList();
  }, []);

  const handleDeleteConsent = async (email) => {
    await Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await deleteApi("delete", `api/user/deleteAdmin`, {
            LoggedEmail: JSON.parse(localStorage.getItem('user'))?.user?.email,
            userToRemove: email,
          });
          if (res?.data?.status === true) {
            setFilteredData((prevData) => prevData.filter((item) => item?.email !== email));
            setOriginalData((prevData) => prevData.filter((item) => item?.email !== email));
            Toast.fire({
              icon: "success",
              title: "Admin Deleted",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: `${res?.response?.data?.message}`,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoader(false);
        }
      }
    });
  };

  const generateActionButtons = (row) => (
    <div>
      <button className="btn btn-danger mx-2" onClick={() => handleDeleteConsent(row?.email)}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );

  const columns = [
    {
      name: 'Sno',
      selector: (row) => row.sno,
      sortable: true,
    },
    {
      name: 'Admin Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Is SuperAdmin',
      selector: (row) => row.isSuperAdmin,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => row.actions,
      sortable: true,
      width: "auto",
    },
  ];

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = originalData.filter((item) =>
      item.email?.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const modifiedData = filteredData?.map((row, index) => ({
    ...row,
    createdBy: row?.createdBy ? row?.createdBy : 'Unknown',
    sno: index + 1,
    isSuperAdmin: row?.isSuperAdmin ? "Yes" : "No",
    actions: generateActionButtons(row),
  }));

  return (
    <>
      {loader && (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loader && (
        <div className="content-area">
      <AreaTop title='Admin List'/>
        <div style={{ minHeight: "90vh" }} className="container consentForm p-5">
          <div className="d-flex align-items-center mb-3 pb-3 justify-content-end">
            <div className="search-container">
              <form className="d-flex flex-row-reverse" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search by email"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </form>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={modifiedData}
            pagination
            responsive
          />
        </div>
        </div>
      )}
    </>
  );
}
