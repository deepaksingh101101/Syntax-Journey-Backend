import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure you have imported Bootstrap CSS
import logo from "../../assets/images/mytr.png";
import "./login.scss";
import { Link } from "react-router-dom";
import {postApi} from '../../helpers/requestHelpers.js'
import {Toast} from '../../components/alert/Alert.jsx'
import { useNavigate } from "react-router-dom";


const LoginScreen = () => {
  const navigate = useNavigate();


//   useEffect(() => {
//     const auth=localStorage.getItem("user")
// if(auth){
// navigate('/das')
// }
//   }, [])

  // State variable for login data object
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState()
  const [loading, setLoading] = useState(false)


  // Function to handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent default form submission
   setLoading(true)
    try {
      const response =  await postApi("post", "/api/user/login", { email:loginData?.email,password:loginData?.password });
      if(response?.data?.status==true){
        setLoading(false)

        navigate('/das')
        Toast.fire({
          icon: "success",
          title: "Login Successfull"
      });
        localStorage.setItem("user",JSON.stringify(response?.data))
      }
      else{
        setLoading(false)
        setErrorMessage(response?.response?.data?.message?response?.response?.data?.message:response?.response?.data?.errors[0].msg)
        
      }
     
    } catch (error) {
      setLoading(false)
      Toast.fire({
        icon: "error",
        title: error
    });
    }
  };

  // Function to update the login data object
  const handleInputChange = (e) => {
    setErrorMessage("")
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="d-flex align-items-center justify-content-center overflow-hidden h-100 w-100   ">
        {/* Left Column for Image - Full width on small screens, half-width on larger screens */}
        <div className="left col-12 col-md-6 d-none d-md-block h-75 rounded-2 position-relative   ">
          <img
            src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="img-fluid rounded-2"
            alt="Login Visual"
          />
          <div className="over-text position-absolute bottom-0 w-100 text-center text-light ">
            <h3>---- Mytr ----</h3>
            <p>
              Empowering Healthcare
              <br />
              Your Health , Your Records , Your Control
            </p>
          </div>
        </div>

        {/* Right Column for Login Form - Full width on small screens, half-width on larger screens */}
        <div className="right col-12 col-md-6 h-75 ">
          <div className="p-4  ">
            <div className="logo mb-4 ">
              <img src={logo} alt="" className="logoImg px-4" width={100} />
            </div>
            <h2 className="text-start mb-1 fw-bolder ">Login</h2>
            <span className="text-start text-secondary">
              Login into your account
            </span>
            <form onSubmit={handleSubmit}>
              <div className="mt-4 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={loginData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  value={loginData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="d-flex justify-content-between px-1">
                <span className="text-danger" >{errorMessage}</span>
                <Link to="#!" className="text-decoration-none text-secondary ">
                  Forgot Password
                </Link>
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" disabled={loading} className="btn fw-bold ">
                  Log In
                  {loading && <div style={{height:"16px", width:"16px"}} className=" ms-3   spinner-border text-light" role="status">
                  </div>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
