import  { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas';
import { getApi, patchApi, postApi, uploadImage } from '../../helpers/requestHelpers';
import Loader from '../../components/loader/Loader';
import { AreaTop } from '../../components';
import QuillEditor from "react-quill";

export default function EditConsent() {


    const [consentData, setConsentData] = useState({ patientName: "", patientId: "",mobileNo:"",adharCard:"",gender:"",dob:"",gaurdianName:"",address:"",relation:"" });
    const [errorMessage, setErrorMessage] = useState()
    const [loader, setLoader] = useState(true)

const [allCaseType, setAllCaseType] = useState()
const [allQuestions, setAllQuestions] = useState()
const [allAnswer, setAllAnswer] = useState()
const [caseType, setCaseType] = useState()
const [inputValues, setInputValues] = useState([]);

const [imageUrl, setImageUrl] = useState()
const [VideoUrl, setVideoUrl] = useState()
const [singleConsentData, setSingleConsentData] = useState()

const getAllcaseType=async()=>{
    setLoader(true)
   let allCase= await getApi("get","/api/template/getAllCaseType")
   setAllCaseType(allCase?.data?.caseType)
   let res=   await getApi("get",`/api/consent/consentById?consentId=${_id}`)
   console.log(res)
   setSingleConsentData(res?.data?.consent)

  await handleCaseTypeUseEffect(res?.data?.consent?.caseType)


   setConsentData({
    patientId:res?.data?.consent?.patientId,
    patientName:res?.data?.consent?.patientName,
    mobileNo:res?.data?.consent?.mobileNo,
    adharCard:res?.data?.consent?.adharCard,
    gender:res?.data?.consent?.gender,
    dob:res?.data?.consent?.dob,
    gaurdianName:res?.data?.consent?.gaurdianName,
    address:res?.data?.consent?.address,
    relation:res?.data?.consent?.relation,
    question:res?.data?.consent?.question
   })
   setCaseType(res?.data?.consent?.caseType)
   setImageUrl(res?.data?.consent?.signatureUrl)
//    const rest = await getApi("get",`/api/template/questionsByCaseType?caseType=${res?.data?.consent?.caseType}`);
//    setAllQuestions(rest?.data?.questions)
setCustomFieldsArray(res?.data?.consent?.customFields)

const res2 = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${res?.data?.consent?.caseType}`);
  
setAllDataValue(res2?.data?.customFields)

setLoader(false)




}

const navigate=useNavigate()
const {_id}=useParams()

useEffect(() => {
    getAllcaseType()
    
}, [_id])


 
    const [sign, setSign] = useState();

    const handleClearSign = () => {
        sign.clear();
    };
    const generateSign = async () => {
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
        formData.append('Image', file, 'signature.png');
    
        try {
            const response = await uploadImage("/api/consent/uploadImage", formData);
            setImageUrl(response?.imageUrl)
        } catch (error) {
            console.log(error);
        }
    };
    

    const handleInputChange = async(e) => {
        setErrorMessage("")
        setMobileRedBorder(false);
        setAadharRedBorder(false);
        const { name, value } = e.target;
        setConsentData({ ...consentData, [name]: value });  
      };


    //   const handleCaseTypeChange=async(e)=>{
    //     setCaseType(e.target.value)
    //     const res = await getApi("get",`/api/template/questionsByCaseType?caseType=${e.target.value}`);
    //     setAllQuestions(res?.data?.questions)


    //   }

    const [customFieldsArray, setCustomFieldsArray] = useState(() => {
        return singleConsentData?.customFields?.map(field => ({
            fieldName: field.fieldName,
            option: field.option
        })) || [];
    });
    
      const handleAnswerChange = (event, questionKey) => {
        const { value } = event.target;
        setInputValues(prevState => ({
          ...prevState,
          [questionKey]: value // Update the key with the new value
        }));
        console.log(inputValues)
      };

      
   const handleConsentSubmit=async(e)=>{
e.preventDefault();



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


setCustomFieldsArray(Object.keys(customOption).map(fieldName => ({
    fieldName,
    option: customOption[fieldName]
})))


const questionsObject = questionsArray.reduce((acc, { question, answer }) => {
    acc[question] = answer;
    return acc;
  }, {});
  

const data = {
    ...consentData,
    signatureUrl: imageUrl,
    updatedBy:JSON.parse(localStorage.getItem('user'))?.user?.email,
    caseType:caseType,
    // question: inputValues,
    customFields:customFieldsArray,
    question:questionsObject
};

try {

    let res=await patchApi('patch',`api/consent/consentById?consentId=${_id}`,data)
console.log(res)
navigate('/consentList')
} catch (error) {
    console.log(error)
}

   }   
   const [mobileRedBorder, setMobileRedBorder] = useState(false)
   const [aadharRedBorder, setAadharRedBorder] = useState(false)

   const [customFields, setCustomFields] = useState([])

   const [singleOptionData, setSingleOptionData] = useState([])

//    const handleCustomOptionChange = (e, fieldName) => {
//     setCustomOption(prevState => ({
//         ...prevState,
//         [fieldName]: e.target.value
//     }));
// };





const handleCustomOptionChange = async (e, fieldName) => {
    const optionValue = e.target.value;

    // Directly update the customFieldsArray
    setCustomFieldsArray(prevArray => {
        // Find the index of the field if it exists
        const index = prevArray.findIndex(item => item.fieldName === fieldName);
        
        // If the field is found, update the option value
        if (index !== -1) {
            const newArray = [...prevArray];
            newArray[index] = { ...newArray[index], option: optionValue };
            return newArray;
        } 
        
        // If the field is not found, add it as a new entry
        return [...prevArray, { fieldName, option: optionValue }];
    });
};





const handleCustomEditOptionChange = async (option, field) => {
    const optionValue = option;
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



//    const [customOption, setCustomOption] = useState()
   const [customOption, setCustomOption] = useState(() => {
    // Initialize state based on singleConsentData
    const initialOptions = {};
    singleConsentData?.customFields?.forEach(field => {
        initialOptions[field.fieldName] = field.option;
    });
    return initialOptions;
});

   const [allDataValue, setAllDataValue] = useState()



const handleCaseTypeChange = async (e) => {
    setCaseType(e?.target?.value)
    const res = await getApi("get", `/api/template/questionsByCaseType?caseType=${e.target.value}`);
    setAllQuestions(res?.data?.questions)
    
    const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${e.target.value}`);
    console.log(temp)
    setValue(temp?.data?.deltaForm)
    setSingleConsentEditData(temp?.data)
    console.log(temp?.data)
    // setSingleConsentData(temp?.data?.template)
}

const questionsArray2 = consentData?.question
  ? Object.entries(consentData?.question).map(([question, answer]) => ({
      question,
      answer,
    }))
  : [];

const [questionsArray, setQuestionsArray] = useState(questionsArray2);

useEffect(() => {
  const updatedQuestionsArray = consentData?.question
    ? Object.entries(consentData?.question).map(([question, answer]) => ({
        question,
        answer,
      }))
    : [];
  setQuestionsArray(updatedQuestionsArray);
}, [consentData]);

const handleChangeAnswer = (question, newAnswer) => {
  setQuestionsArray(prevQuestionsArray => 
    prevQuestionsArray.map(q => 
      q.question === question ? { ...q, answer: newAnswer } : q
    )
  );
};

// console.log(questionsArray);

const handleCaseTypeUseEffect = async (caseType) => {
    setCaseType(caseType)
    const res = await getApi("get", `/api/template/questionsByCaseType?caseType=${caseType}`);
    setAllQuestions(res?.data?.questions)
    setInputValues(res?.data?.questions)
    const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${caseType}`);
    console.log(temp)
    setValue(temp?.data?.deltaForm)
    setSingleConsentEditData(temp?.data)
    console.log(temp?.data)
    // setSingleConsentData(temp?.data?.template)
}

const [value, setValue] = useState("");

const [singleConsentEditData, setSingleConsentEditData] = useState()

  return (
<>

    {loader &&
        <div className="d-flex w-100 justify-content-center align-items-center">
            <Loader/>
        </div>
     }

    {!loader &&
        <div className="content-area">
      <AreaTop title={`Edit Consent Form - ${singleConsentData?.patientName}`}/>
    <div className="container consentForm p-5">
    <form className='row g-3' onSubmit={handleConsentSubmit}>
        <div className="col-md-4">
            <label htmlFor="Pname" className="form-label">
                Patient Name
            </label>
            <input
                type="text"
                className="form-control"
                id="Pname"
                placeholder="Enter Paitent Name"
                required
                name='patientName'
                value={consentData?.patientName}
                onChange={handleInputChange}          
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
                value={consentData?.patientId}
                onChange={handleInputChange} 
            />
        </div>
        <div className="col-md-4">
            <label htmlFor="Pnum" className="form-label">
                Mobile Number <span style={{ color: "red" }}>{mobileRedBorder && "(Must be of 10 digits)"}</span>
            </label>
            <input
                type="number"
                className="form-control"
                id="Pnum"
                name='mobileNo'
                placeholder="Enter Paitent Id"
                required
                style={mobileRedBorder ? { border: "1px solid red" } : {}}
                value={consentData?.mobileNo}
                onChange={handleInputChange} 
            />
        </div>
        <div className="col-md-4">
            <label htmlFor="Paadhar" className="form-label">
                Aadhar Card <span style={{ color: "red" }}>{aadharRedBorder && "(Must be of 12 digits)"}</span>
            </label>
            <input
                type="text"
                className="form-control "
                id="Paadhar"
                placeholder="Enter Aadhar Number"
                required
                style={aadharRedBorder ? { border: "1px solid red" } : {}}

                value={consentData?.adharCard}
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
                value={consentData?.gender}
                onChange={handleInputChange} 
                name='gender'
            >
                <option >Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
            </select>
        </div>
        <div className="col-md-4">
            <label htmlFor="Pdob" className="form-label">
                D.O.B
            </label>
            <input
                type="date"
                className="form-control "
                id="Pdob"
                required
                name='dob'
                value={consentData?.dob}
                onChange={handleInputChange} 
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
                value={consentData?.gaurdianName}
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
                value={consentData?.address}
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
                placeholder="Enter Relation with patient"
                required
                name='relation'
                value={consentData?.relation}
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
               <option>Select Case Type</option> {/* Default placeholder option */}
{/* Map each case type to an option element */}
{allCaseType?.map((caseType, index) => (
<option key={index} value={caseType}>{caseType.charAt(0).toUpperCase() + caseType.slice(1)}</option>
))}
            </select>
        </div>











        {caseType && 
                
              

                <div className="col-md-12">
                    <div className="col-md-11 my-4">
  <div className="row">

 
<label htmlFor="created By" className="form-label">
                        {singleConsentEditData?.caseType}
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
{singleConsentEditData?.imageUrl.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
<label htmlFor="created By" className="form-label">
                        {singleConsentEditData?.caseType}
                        </label>

                        <div className="video-container">
      <video controls > {/* Adding controls and setting width */}
        <source src={singleConsentEditData?.videoUrl} type="video/mp4" /> {/* Setting the video source and type */}
        Your browser does not support the video tag. {/* Fallback message for unsupported browsers */}
      </video>
    </div>
</div>

</div>
</div>

<div className="col-md-11 my-4">
<div className="accordion" id="accordionExample">



 {singleConsentEditData?.faqs?.map((faq,index)=>(
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
                        {singleConsentEditData?.caseType}
                        </label>

                        <div className="video-container">
      <video controls > {/* Adding controls and setting width */}
        <source src={singleConsentData?.videoUrl} type="video/mp4" /> {/* Setting the video source and type */}
        Your browser does not support the video tag. {/* Fallback message for unsupported browsers */}
      </video>
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











       

        <div className='mt-2' >
            <h3>Questions</h3>
            <div className="row">
            {questionsArray?.map(({ question, answer }, index) => (
                <div key={index} className="col-md-12">
                    <label htmlFor={`ques-${question}`} className="form-label mt-1">
                        {question}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id={`ques-${question}`}
                        name="questions"
                        placeholder="Enter Your Answer"
                        value={answer}
                        onChange={(e)=>{handleChangeAnswer(question, e.target.value)}}
                    />
                </div>
            ))}
        </div>
    
    </div>


{/* Custom Fields Started */}
<div  className="col-md-12">
<h3>Custom Fields</h3>
</div>

<div>
            {singleConsentData?.customFields?.map((custom, index) => {
                const correspondingField = allDataValue?.find(field => field.fieldName === custom.fieldName);

                return (
                    <div key={index} className="col-md-12">
                    <label htmlFor={`custom-${index}`} className="form-label">
                        {custom?.fieldName}
                    </label>
                    <select
                        className="form-control"
                        id={`custom-${index}`}
                        name={custom?.fieldName}
                        value={customFieldsArray.find(item => item.fieldName === custom?.fieldName)?.option || ''}
                        onChange={(e) => handleCustomOptionChange(e, custom?.fieldName)}
                    >
                        {correspondingField?.options?.map((option, idx) => (
                            <option key={idx} value={option?.name}>
                                {option?.name.charAt(0).toUpperCase() + option?.name.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                
                    
                );
            })}
        </div>


        <div className="col-md-6">
            <button disabled type='button' className="btn bg-primary-color text-light p-5 w-100  " data-bs-toggle="modal" data-bs-target="#uploadSignatureModal"><i className="fa-solid fa-file-signature"></i> Upload Signature</button>
        </div>

        {/* ----modal--- */}

        <div className="modal fade" id="uploadSignatureModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <button type="button" className="btn-close ms-auto p-2 " data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="modal-body">
                        <SignatureCanvas
                            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                            ref={data => setSign(data)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClearSign} >Reset</button>
                        <button type="button" className="btn btn-primary" onClick={generateSign}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-6">
            <button disabled className="btn bg-primary-color text-light p-5 w-100  "><i className="fa-solid fa-video"></i> Capture Consent Video</button>
        </div>

        <div className="col-12">
            <button className="btn btn-success w-100">Submit</button>
        </div>
    </form>
</div>
</div>}
</>
  )
}
