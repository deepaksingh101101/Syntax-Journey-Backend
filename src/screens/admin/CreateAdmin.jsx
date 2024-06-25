import React, { useState } from 'react';
import { postApi } from '../../helpers/requestHelpers';
import Loader from '../../components/loader/Loader';
import { Toast } from "../../components/alert/Alert";
import { useNavigate } from 'react-router-dom';
import { AreaTop } from '../../components';

export default function CreateAdmin() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")


  const navigate=useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    const data={
    email:adminEmail,
    password:adminPassword,
    isSuperAdmin:isSuperAdmin,
    loggedInUserId:JSON.parse(localStorage.getItem('user'))?.user?._id
    }

    try {
    let res= await postApi("post","api/user/register",data)

   
    if(res?.data?.status===true){
      Toast.fire({
        icon: "success",
        title: "Admin Created"
    });
    navigate('/viewAdmin')
    }
    else{
      setLoading(false)
      Toast.fire({
        icon: "error",
        title: `${res?.response?.data?.message}`
    });
    
    }

    } catch (error) {
      console.log(error)
      setLoading(false)
      Toast.fire({
        icon: "error",
        title: `Something went's wrong`
    });

    }

  };

  return (
    <>



   {!loading && 
    <div className="content-area">
      <AreaTop title='Create New Admin'/>
    <div style={{ height: "100%" }} className="container consentForm p-5">
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-3 my-2">
          <label htmlFor="adminEmail" className="form-label">
            Email Id
          </label>
          <input
            type="text"
            className="form-control"
            id="adminEmail"
            name="adminEmail"
            placeholder="Enter Admin Email"
            required
            value={adminEmail}
            onChange={(e) => {
              setAdminEmail(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3 my-2">
          <label htmlFor="adminPassword" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            id="adminPassword"
            name="adminPassword"
            placeholder="Enter Admin Password"
            required
            value={adminPassword}
            onChange={ (e) => {
              setAdminPassword(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3 my-2">
          <label htmlFor="isSuperAdmin" className="form-label">
            Is SuperAdmin
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={isSuperAdmin}
              onChange={(e) => {
                setIsSuperAdmin(e.target.checked);
              }}
            />
          </div>
        </div>
        <div className="col-md-3 my-2">
          <button type="submit" style={{ height: "100%" }} className="w-100 btn btn-success">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
 

  }
   {loading &&
    <div className="d-flex w-100 justify-content-center align-items-center">
        <Loader/>
    </div>
 }
  </>

  )
}
