import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas';
import { getApi, postApi, uploadImage } from '../../helpers/requestHelpers'
import { useRecordWebcam } from 'react-record-webcam'
import QuillEditor from "react-quill";
import Loader from '../loader/Loader';
import { Toast } from "../../components/alert/Alert";

const ConsentForm = () => {

    const OPTIONS = { options: { fileName: 'custom-name', fileType: 'webm', height: 1080, width: 1920 } }
    const { createRecording, openCamera, startRecording, stopRecording, closeCamera, clearAllRecordings } = useRecordWebcam()
    const [loader, setLoader] = useState(false);
    const [surgenLoader, setSurgenLoader] = useState(false);
    const [generalLoader, setGeneralLoader] = useState(false);


    const navigate = useNavigate();
    const [consentData, setConsentData] = useState({ patientName: "", patientId: "", mobileNo: "", adharCard: "", gender: "", dob: "", gaurdianName: "", address: "",relation:"" });
    const [errorMessage, setErrorMessage] = useState()
    const [loading, setLoading] = useState(false)

    const [allCaseType, setAllCaseType] = useState()
    const [allQuestions, setAllQuestions] = useState()
    const [allAnswer, setAllAnswer] = useState()
    const [caseType, setCaseType] = useState()
    const [customOption, setCustomOption] = useState()
    const [inputValues, setInputValues] = useState([]);

    // const [imageUrl, ] = useState()
    const [VideoUrl, setVideoUrl] = useState()
    const [showPreview , setShowPreview] = useState();

    const getAllcaseType = async () => {
        let allCase = await getApi("get", "/api/template/getAllCaseType")

        setAllCaseType(allCase?.data?.caseType)

    }


    const [smallLoader1, setsmallLoader1] = useState(false)
    const [smallLoader2, setsmallLoader2] = useState(false)

    useEffect(() => {
        // Fetch case types when component mounts
        getAllcaseType();
    
        // Set up form validation
      
    }, []);
    

    const [sign, setSign] = useState();
    const [surgenSign, setSurgenSign] = useState();

    const handleClearSign = () => {
        sign.clear();
    };
    const handleClearSurgenSign = () => {
        surgenSign.clear();
    };

    const [imageUrl, setImageUrl] = useState()
    const generateSign = async () => {
        setGeneralLoader(true)
        // Assuming sign is defined somewhere in your code
        const base64 = sign.getTrimmedCanvas().toDataURL('image/png');

        // Convert base64 string to Blob
        const base64ToBlob = (base64) => {
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: 'image/png' });
        };

        // Create a FormData object
        const formData = new FormData();
        const file = base64ToBlob(base64);
        formData.append('images', file, 'signature.png');

        try {
            const response = await uploadImage("/api/consent/uploadImage", formData);
            setImageUrl(response?.imageUrls[0])
            setGeneralLoader(false)
        } catch (error) {
            console.log(error);
            setGeneralLoader(false)
        }
    };

    const [surgenImageUrl, setSurgenImageUrl] = useState()
    const generateSurgenSign = async () => {
        setSurgenLoader(true)
        // Assuming sign is defined somewhere in your code
        const base64 = sign.getTrimmedCanvas().toDataURL('image/png');

        // Convert base64 string to Blob
        const base64ToBlob = (base64) => {
            const byteCharacters = atob(base64.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: 'image/png' });
        };

        // Create a FormData object
        const formData = new FormData();
        const file = base64ToBlob(base64);
        formData.append('images', file, 'signature.png');

        try {
            const response = await uploadImage("/api/consent/uploadImage", formData);
            setSurgenImageUrl(response?.imageUrls[0])
            setSurgenLoader(false)
        } catch (error) {
            setSurgenLoader(false)
            console.log(error);
        }
    };

    const handleInputChange = async (e) => {
        setErrorMessage("")
        setMobileRedBorder(false);
        setAadharRedBorder(false);
        const { name, value } = e.target;
        setConsentData({ ...consentData, [name]: value });
    };

    const [value, setValue] = useState("");
    const quill = useRef();

    const handleCaseTypeChange = async (e) => {
    setsmallLoader1(true)
        setCaseType(e.target.value)
        const res = await getApi("get", `/api/template/questionsByCaseType?caseType=${e.target.value}`);
        setAllQuestions(res?.data?.questions)
        
        const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${e.target.value}`);
        console.log(temp)
        setValue(temp?.data?.deltaForm)
        setSingleConsentData(temp?.data)
        console.log(temp?.data?.videoUrl)
        setsmallLoader1(false)
        // setSingleConsentData(temp?.data?.template)
    }

// Working here
const [customFields, setCustomFields] = useState([])
const handleCustomOptionChange = async (e, field) => {
    const optionValue = e.target.value;
    setCustomOption(optionValue);  // Assuming setCustomOption updates the state for the current option value

    // Update the customFields state array to modify the existing field or add a new one
    setCustomFields(prevFields => {
        const fieldIndex = prevFields.findIndex(f => f.fieldName === field);
        const newField = { fieldName: field, option: optionValue };

        if (fieldIndex !== -1) {
            // If the field already exists, update it
            return prevFields.map((item, index) => index === fieldIndex ? newField : item);
        } else {
            // If the field does not exist, add it
            return [...prevFields, newField];
        }
    });

    // Log the customFields state after the update (this will not immediately show the updated state)
    console.log(customFields);

    // Ensure caseType is available here, either from state or props
    const temp = await getApi("get", `/api/template/getOptions?caseType=${encodeURIComponent(caseType)}&fieldName=${encodeURIComponent(field)}&optionName=${encodeURIComponent(optionValue)}`);
    console.log(temp);

    if (temp?.data) {
        // Update singleOptionData by either adding new data or updating existing
        setSingleOptionData(prevOptions => {
            const index = prevOptions.findIndex(option => option.fieldName === field);
            if (index !== -1) {
                // If data exists for this field, update it
                return prevOptions.map((opt, idx) => idx === index ? {...opt, ...temp.data} : opt);
            } else {
                // If no data exists for this field, add new data
                return [...prevOptions, {...temp.data, fieldName: field}];
            }
        });
    }
};





    const handleAnswerChange = async (e, index) => {
        const { value } = e.target;
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

    };

    const handleConsentSubmit = async (e) => {
        e.preventDefault();
        // e.stopPropagation();
        
        if(consentData?.mobileNo?.length!=10){
            setMobileRedBorder(true);
            window.scrollTo(0,0)
            return
        }

        if(consentData?.adharCard?.length!=12){
            setAadharRedBorder(true);
            window.scrollTo(0,0)
            return
        }

        setLoader(true)
        console.log(imageUrl)

        if(imageUrl===undefined){
            Toast.fire({
                icon: "error",
                title: "We need Your Signature",
              });
              setLoader(false)
              setLoading(false)
              return
        }
        // if(videoUrlState===undefined){
        //     Toast.fire({
        //         icon: "error",
        //         title: "We need Your Video",
        //       });
        //       setLoader(false)
        //       setLoading(false)
        //       return
        // }

        // const form = e.currentTarget;
        // if (!form.checkValidity()) {
        //     form.classList.add('was-validated');
        //     return;
        // }
        
        const data = {
            ...consentData,
            signatureUrl: imageUrl,
            surgenSignatureUrl: surgenImageUrl,
            // VideoUrl: videoUrlState,
            VideoUrl: "hello",
            caseType: caseType,
            createdBy: JSON.parse(localStorage.getItem('user'))?.user?.email,
            question: allQuestions.reduce((acc, question, index) => {
                acc[question] = inputValues[index];
                return acc;
            }, {}),
            customFields:customFields
        };
    

        try {
            setLoading(true);
            let res = await postApi('post', `api/consent/submitConsent`, data);
            setLoading(false);
            setLoader(false)
            navigate('/consentList');
            console.log(res);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setLoader(false)

        }
    };
    


    const handleClearVideo = () => {

    }



    const [recordingState, setRecordingState] = useState()

    const startRecoding = async () => {
        setLoading(true);
        const recording = await createRecording();


        setRecordingState(recording);
        await openCamera(recording?.id);
        await startRecording(recording?.id);
        setLoading(false);
    };


    const [recordedState, setRecordedState] = useState()

    const stopRecoding = async () => {
        const recorded = await stopRecording(recordingState?.id);
        setRecordedState(recorded)
        await closeCamera(recordingState?.id)
        setShowPreview(true);
        // Upload the blob to a back-end


    };

    const [videoUrlState, setVideoUrlState] = useState();

    const saveRecoding = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('video', recordedState?.blob, 'recorded.webm');
        try {

            let res = await postApi("post", "api/consent/uploadVideo", formData)
            console.log(res)
            if (res?.data?.status === true) {
                setVideoUrlState(res?.data?.videoUrl)
                setLoading(false);
                document.getElementById('saveBtn').click();
            }
            else {
                console.log(errorMessage)
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    const { activeRecordings } = useRecordWebcam()
    const [singleConsentData, setSingleConsentData] = useState()
    const [singleOptionData, setSingleOptionData] = useState([])


   const [mobileRedBorder, setMobileRedBorder] = useState(false)
   const [aadharRedBorder, setAadharRedBorder] = useState(false)


    return (
        <>
          {loader && (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
       { !loader &&  <div style={{ minHeight: "90vh" }} className="container consentForm p-5">
            <form className='row g-3 needs-validation'  onSubmit={handleConsentSubmit}>
            <div className="col-md-4  has-validation">
    <label htmlFor="Pname" className="form-label">Patient Name</label>
    <input
        type="text"
        className="form-control"
        id="Pname"
        placeholder="Enter Patient Name"
        required
        name="patientName"
        value={consentData.patientName}
        onChange={handleInputChange}
        aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
    />
</div>



                <div className="col-md-4">
                    <label htmlFor="Pid" className="form-label">
                        Patient Id
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="Pid"
                        name='patientId'
                        placeholder="Enter Paitent Id"
                         required
                        value={consentData.patientId}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-4">
            <label htmlFor="Pnum" className="form-label">
                Mobile Number <span style={{ color: "red" }}>{mobileRedBorder && "(Must be of 10 digits)"}</span>
            </label>
            <input
                type="text"
                className="form-control"
                id="Pnum"
                style={mobileRedBorder ? { border: "1px solid red" } : {}}
                name='mobileNo'
                placeholder="Enter Mobile Number"
                required
                value={consentData.mobileNo}
                onChange={handleInputChange}
            />
        </div>
                <div className="col-md-4">
                    <label htmlFor="Paadhar" className="form-label">
                        Aadhar Card  <span style={{ color: "red" }}>{aadharRedBorder && "(Must be of 12 digits)"}</span>
                    </label>
                    <input
                        type="text"
                        className="form-control "
                        id="Paadhar"
                        placeholder="Enter Aadhar Number"
                        required
                        style={aadharRedBorder ? { border: "1px solid red" } : {}}

                        value={consentData.adharCard}
                        onChange={handleInputChange}
                        name='adharCard'
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="gender" className="form-label">
                        Gender
                    </label>
                    <select
                        className="form-control"
                        id="gender"
                        required
                        value={consentData.gender}
                        onChange={handleInputChange}
                        name='gender'
                    >
                        <option  value=""  >Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="Pdob" className="form-label">
                        Date Of Birth
                    </label>
                    <input
                        type="date"
                        className="form-control "
                        id="Pdob"
                        required
                        name='dob'
                        value={consentData.dob}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="Gname" className="form-label">
                        Gaurdian Name
                    </label>
                    <input
                        type="text"
                        className="form-control "
                        id="Gname"
                        placeholder="Enter Gaurdian Name"
                        required
                        name='gaurdianName'
                        value={consentData.gaurdianName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="Paddress" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className="form-control "
                        id="Paddress"
                        placeholder="Enter Patient Address"
                        required
                        name='address'
                        value={consentData.address}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="col-md-4">
                    <label htmlFor="relation" className="form-label">
                        Relation with patient
                    </label>
                    <input
                        type="text"
                        className="form-control "
                        id="relation"
                        placeholder="Enter relation with patient"
                        required
                        name='relation'
                        value={consentData.relation}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="col-md-12">
                    <label htmlFor="caseType" className="form-label">
                        Case Type
                    </label>
                    <select
                        className="form-control"
                        id="caseType"
                        required
                        name='caseType'
                        value={caseType}
                        onChange={handleCaseTypeChange}
                    >
                        <option value="" >Select Case Type</option> {/* Default placeholder option */}
                        {/* Map each case type to an option element */}
                        {allCaseType?.map((caseType, index) => (
                            <option key={index} value={caseType}>{caseType.charAt(0).toUpperCase() + caseType.slice(1)}</option>
                        ))}
                    </select>
                </div>


              

{smallLoader1 && <div className="d-flex justify-content-center">
    <Loader/>
</div>
}
                {caseType && !smallLoader1 &&
                
              

                <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={value}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />
<div className="">
{singleConsentData?.imageUrl.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
                        {/* <iframe height="fit-content" style={{height:"50vh",width:"30vw"}} src={singleConsentData?.videoUrl}  ></iframe> */}
                        <iframe
  width="380"
  height="220"
//   src="https://www.youtube.com/embed/IxYtTTCWCwk"
  src={singleConsentData?.videoUrl}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>

      {/* <video controls > 
        <source src={singleConsentData?.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>
</div>

</div>
</div>

<div className="col-md-12 my-4">
<div className="accordion" id="accordionExample">



 {singleConsentData?.faqs?.map((faq,index)=>(
  <div key={index} className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        {faq?.title}
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <div className="row">

 
{/* <label htmlFor="created By" className="form-label">
                        {faq?.caseType}
                        </label> */}
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={faq?.description}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />
<div className="">
{faq?.imageUrl.map((image,index)=>(


<img  className='object-fit-contain my-2' style={{height:"200px", width:"50vw"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
   
      <iframe
  width="380"
  height="220"
//   src="https://www.youtube.com/embed/IxYtTTCWCwk"
src={faq?.videoUrl}
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
    </div>
</div>
</div>
      </div>
    </div>
  </div>
 )) }
 
</div>
</div>
                </div>
                
                }


{/* Custom Fields Started */}


{caseType && !smallLoader1 && 
    <div className="">



<div  className="col-md-12">
<h3>Custom Fields</h3>
</div>

{ singleConsentData?.customFields?.map((custom,index)=>(
    <div key={index} className="col-md-12">
                    <label htmlFor="caseType" className="form-label">
                       {custom?.fieldName}
                    </label>
                    <select
                        className="form-control"
                        id="caseType"
                        // required
                        name='caseType'
                        value={customOption}
                        onChange={(e) => handleCustomOptionChange(e, custom?.fieldName)}
                        >
                        <option>Select {custom?.fieldName}</option> {/* Default placeholder option */}
                        {/* Map each case type to an option element */}
                        {custom?.options?.map((option, index) => (
                            <option key={index} value={option?.name}>{option?.name?.charAt(0).toUpperCase() + option?.name?.slice(1)}</option>
                        ))}
                    </select>


                {customOption &&    <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>
<div className="col-md-7 height_of_quill">
<QuillEditor
            theme="snow"
            value={singleOptionData[index]?.description}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />
<div className="">
{singleOptionData[index]?.imageUrl?.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label>

                        <div className="video-container">
            <iframe height="fit-content" style={{height:"50vh",width:"30vw"}} src={singleOptionData[index]?.videoUrl}  ></iframe>

      {/* <video controls > 
        <source src={singleOptionData[index]?.videoUrl} type="video/mp4" /> 
        Your browser does not support the video tag.
      </video> */}
    </div>
</div>

</div>
</div>

                </div>}







                </div>
)) 
}
<div  className="col-md-12">
<h3 className='mt-3'>Questions</h3>
</div>


{allQuestions?.map((que, index) => (
                    <div key={index} className="col-md-12">
                        <label htmlFor={`ques-${index}`} className="form-label">
                            <b>Question {index + 1} </b>   {que}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id={`ques-${index}`}
                            name='questions'
                            placeholder="Enter Your Answer"
                            value={inputValues[index] || ''} // Use inputValues state to populate input value
                            onChange={(e) => handleAnswerChange(e, index)} // Pass index to identify which input is being changed
                            // required
                        />
                    </div>
                ))}
</div>}

<div className="col-md-12">
<button
  type='button'
  className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light p-5 w-100"
  data-bs-toggle="modal"
  data-bs-target="#uploadSurgenSignatureModal"
>
  <i className="fa-solid fa-file-signature me-2"></i>
  {surgenImageUrl ? 'Signature Uploaded' : 'Upload Surgen Signature'}

  
                                {surgenLoader && <div  className="d-flex mx-3 justify-content-end align-items-center">
                                     <div style={{height:"20px",width:"20px"}} className="spinner-border text-white" role="status">

</div>
                                 </div>}

                                 
</button>
                </div>

                <div className="col-md-6">
                    <button type='button' 
                    className=" d-flex justify-content-center align-items-center btn bg-primary-color text-light p-5 w-100  " 
                    data-bs-toggle="modal"
                     data-bs-target="#uploadSignatureModal">
                        <i className="fa-solid fa-file-signature mx-2">
                        </i>
                        {imageUrl ? 'Signature Uploaded' : 'Upload Signature'}
                        {generalLoader && <div  className="d-flex mx-3 justify-content-end align-items-center">
                                     <div style={{height:"20px",width:"20px"}} className="spinner-border text-white" role="status">

</div>
                                 </div>}
                         </button>
                </div>

             

                {/* ----modal--- */}

                <div className="modal fade" id="uploadSignatureModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header">
                        <h2>Your Signature</h2>
                            <button type="button" className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                                <SignatureCanvas
                                    canvasProps={{width:1480,height:550, className: 'sigCanvas' }}
                                    ref={data => setSign(data)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClearSign} >Reset</button>
                                <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={generateSign}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>


{/* Modal of surgen */}
   <div className="modal fade" id="uploadSurgenSignatureModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header">
                        <h2>Your Signature</h2>
                            <button type="button" className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                            <div className="modal-body">
                               
                                <SignatureCanvas
                                    canvasProps={{width:1480,height:550, className: 'sigCanvas' }}
                                    ref={data => setSurgenSign(data)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClearSurgenSign} >Reset</button>
                                <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={generateSurgenSign}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>






                <div className="modal fade" id="uploadVideoModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                            <button type="button" id='saveBtn' className="btn-close ms-auto p-4 " data-bs-dismiss="modal" aria-label="Close"></button>
                            {loading &&
                                <div className="d-flex w-100 justify-content-center align-items-center">
                                    <Loader />
                                </div>
                            }
                            <div className="modal-body d-flex align-items-center ">
                                {activeRecordings.map(recording => (
                                    <div key={recording.id} >
                                        <h2 className={`text-center ${showPreview? 'd-none' : ''}`} >Your Camera</h2>
                                        <video ref={recording.webcamRef} autoPlay className={`videoPreview ${showPreview? 'd-none' : ''}`} />
                                        <h2 className={`text-center ${!showPreview? 'd-none' : ''}`}>Your Video Preview</h2>
                                        <video ref={recording.previewRef} controls className={`videoPreview ${!showPreview? 'd-none' : ''}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClearVideo} >Reset</button>
                                <button type="button" className="btn btn-main" onClick={startRecoding}>Start Recording </button>
                                <button type="button" className="btn btn-danger" onClick={stopRecoding}>Stop Recording </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    data-bs-dismiss={recordedState?.id && loading ? 'modal' : ''}
                                    onClick={saveRecoding}
                                >
                                    Save Recording
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <button type="button" className="btn bg-primary-color text-light p-5 w-100  " data-bs-toggle="modal" data-bs-target="#uploadVideoModal"><i className="fa-solid fa-video"></i> Capture Consent Video</button>
                </div>

                <div className="col-12">
                    <button className="btn btn-success w-100">Submit</button>
                </div>
            </form>
        </div>}
        </>
    )
}

export default ConsentForm