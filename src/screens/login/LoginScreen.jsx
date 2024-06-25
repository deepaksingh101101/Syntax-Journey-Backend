import React, { useEffect, useRef, useState } from "react";
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
    if(isOtpVerfied){
      handleChangePassword()
      return
    }

if(forgetPasswordActive){
  handleVerifyOtp();
  return
}



    console.log(loginData?.email)
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
    console.log(loginData)
  };

const [forgetPasswordActive, setForgetPasswordActive] = useState(false)

  const handleForgetPasswordClick=()=>{
setForgetPasswordActive(true)
  }



const [otp, setOtp] = useState(["","","","","",""])
const inputRefs=useRef([])
const handleOtpChange=(index, value)=>{
const newOtp=[...otp];
newOtp[index]=value;

if(value && index<otp.length-1){
  inputRefs.current[index+1].focus();
}
setOtp(newOtp)

}

const handleKeyDown=(index,e)=>{
  if(e.key==="Backspace" && index>0 && !otp[index]){
const newOtp=[...otp];
newOtp[index-1]="";
inputRefs.current[index-1].focus();
setOtp(newOtp)

  }
}


const [emailF, setEmailF] = useState("")

const [isSendOtpClicked, setIsSendOtpClicked] = useState(false)
const [isOtpSended, setIsOtpSended] = useState(false)

const handleSendOtp=async()=>{
  setErrorMessage("")

if(emailF===""){
setErrorMessage("Please Enter your email")
return
}



try {
  let res=await postApi("post","api/user/forgetPassword",{email:emailF})
console.log(res)
if(res?.data?.status===true){
  setIsSendOtpClicked(true)
  setIsOtpSended(true)
  Toast.fire({
    icon: "success",
    title: "OTP sended to your email"
  });
}else{
  setErrorMessage(res?.response?.data?.message)
}


} catch (error) {
  console.log(error)
}




}


const [isOtpVerfied, setIsOtpVerfied] = useState(false)

const handleVerifyOtp=async()=>{
  setLoading(true)
  const otpString = otp.join('');

try {
  let res=await postApi("post","api/user/verifyOtp",{email:emailF,otp:otpString})
setErrorMessage(res?.response?.data?.message)
console.log(res)
if(res?.data?.status==="true"){
setIsOtpVerfied(true)
}
setLoading(false)

} catch (error) {
  setLoading(false)
  console.log(error)
}

}




const [newPassword, setNewPassword] = useState()



const handleChangePassword=async()=>{
  setErrorMessage("")

if(emailF===""){
setErrorMessage("Please Enter your email")
return
}

try {
  setLoading(true)
  let res=await postApi("post","api/user/changePassword",{email:emailF,password:newPassword})
console.log(res)
setLoading(false)
setForgetPasswordActive(false)
setIsOtpVerfied(false)
setEmailF("")
setLoginData({ email: "", password: "" })
setOtp(["","","","","",""])
setNewPassword("")

} catch (error) {
console.log(error)
setLoading(false)

}
}

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
            {!forgetPasswordActive &&<><h2 className="text-start mb-1 fw-bolder ">Login</h2>
            <span className="text-start text-secondary">
              Login into your account
            </span></>}
            {isOtpVerfied &&<><h2 className="text-start mb-1 fw-bolder ">Reset Password</h2>
            <span className="text-start text-secondary">
              Enter new Password
            </span></>}
           { forgetPasswordActive && !isOtpVerfied &&<><h2 className="text-start mb-1  fw-bolder ">Forget Password</h2>
            <span className="text-start text-secondary">
              Verify Your OTP 
            </span>
            </>}
            <form onSubmit={handleSubmit}>

             {!forgetPasswordActive && <div className="mt-4 mb-3">
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
              </div>}

              { forgetPasswordActive && <div className="mt-4 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailF"
                  name="emailF"
                  placeholder="Enter your email"
                  required
                  value={emailF}
                  onChange={(e)=>{setEmailF(e.target.value)}}
                />
              </div>}

             {forgetPasswordActive  && !isOtpVerfied && <div className="d-flex justify-content-between px-1">
                <span className="text-danger pb-3" >{errorMessage}</span>
                <button onClick={handleSendOtp}  role="button" type="button" className="text-decoration-none text-secondary  forget_btn ">
                  Send Otp
                </button>
              </div>}

              { !forgetPasswordActive && <div className="mb-3 ">
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
              </div>}

              { isOtpVerfied && <div className="mb-3 ">
                <label htmlFor="newPassword" className="form-label">
                 New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  required
                  value={newPassword}
                  onChange={(e)=>{setNewPassword(e.target.value)}}
                />
              </div>}


             {forgetPasswordActive && !isOtpVerfied && isSendOtpClicked && <div className="mb-3 mt-3">
                <label htmlFor="otp" className="form-label">
                  OTP
                </label>
                <div className="d-flex justify-content-center">
               {otp?.map((digit,index)=>(
                <input
                  type="text"
                  style={{maxWidth:"40px"}}
                  key={index}
                  className="form-control mx-2"
                  id="otp"
                  name="otp"
                  maxLength={1}
                  value={digit}
                  required
                  autoFocus={index===0}
                  ref={(ref)=>(inputRefs.current[index]=ref)}
                  onChange={(e)=>handleOtpChange(index,e.target.value)}
                  onKeyDown={(e)=>handleKeyDown(index,e)}
                />
                ))}
                </div>
              </div>}

              <div className="d-flex justify-content-between px-1">
{            !forgetPasswordActive &&    <span className="text-danger" >{errorMessage}</span>
}              { !forgetPasswordActive &&  <button  onClick={handleForgetPasswordClick}  type="button" className="text-decoration-none text-secondary forget_btn ">
                  Forgot Password
                </button>}
              </div>
              <div className="d-grid gap-2 mt-3">
               { ! forgetPasswordActive && <button type="submit" disabled={loading} className="btn fw-bold ">
                  Log In
                  {loading && <div style={{height:"16px", width:"16px"}} className=" ms-3   spinner-border text-light" role="status">
                  </div>}
                </button>}
               {forgetPasswordActive  && !isOtpVerfied && <button type="submit" disabled={!isOtpSended || loading} className="btn fw-bold ">
                  Verfiy Otp
                  {loading && <div style={{height:"16px", width:"16px"}} className=" ms-3   spinner-border text-light" role="status">
                  </div>}
                </button>}
               {isOtpVerfied && <button type="submit" disabled={loading} className="btn fw-bold ">
                  Change Password
                  {loading && <div style={{height:"16px", width:"16px"}} className=" ms-3   spinner-border text-light" role="status">
                  </div>}
                </button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
