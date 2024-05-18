
import { useEffect, useState } from 'react'
import './Consent.css'
import { getApi } from '../../helpers/requestHelpers'
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import { AreaTop } from '../../components'

import QuillEditor from "react-quill";




export default function ViewConsent() {



    const [singleConsentData, setSingleConsentData] = useState()
    const [loader, setLoader] = useState(true)

    const {_id}=useParams()
    console.log(_id)

    const getConsentData=async()=>{
      try {
        setLoader(true)
        let res=   await getApi("get",`/api/consent/consentById?consentId=${_id}`)
        console.log(res?.data?.consent)
        setSingleConsentData(res?.data?.consent)
        setLoader(false)
      } catch (error) {
        console.log(error)
        setLoader(false)
      }
    }

    useEffect(() => {
        getConsentData();
        handleCaseTypeChange();
    }, [])

    const [value, setValue] = useState("");

    const [caseType, setCaseType] = useState()
    const [allQuestions, setAllQuestions] = useState()

    const handleCaseTypeChange = async () => {
        setCaseType(singleConsentData?.caseType)
        const res = await getApi("get", `/api/template/questionsByCaseType?caseType=${singleConsentData?.caseType}`);
        setAllQuestions(res?.data?.questions)

        const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${singleConsentData?.caseType}`);
        console.log(temp)
        setValue(temp?.data?.deltaForm)

    }

    const [inputValues, setInputValues] = useState([]);





  return (
    <>
      {loader &&
   <div className="d-flex w-100 justify-content-center align-items-center">
       <Loader/>
   </div>
}
  
   {!loader && 
    <div className="content-area">
      <AreaTop title={`Consent Form - ${singleConsentData?.patientName}`}/>
   <div className="container consentForm px-0 py-5 d-flex  flex-wrap justify-content-center align-items-center">
        <div className="col-md-5 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Patient Name
                        </label>
                        <span className="form-label">
                            {singleConsentData?.patientName}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Patient Id
                        </label>
                        <span className="form-label">
                        {singleConsentData?.patientId}                      </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="adharCard" className="form-label">
                            Aadhar Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.adharCard}
                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gaurdian Name
                        </label>
                        <span className="form-label">
                       {singleConsentData?.gaurdianName}                       </span>
                        
                    </div>
        <div className="col-md-5 borderC mx-3  d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <span className="form-label">
                        {singleConsentData?.caseType}
                        </span>
                        
                    </div>
                    
                    
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="mobileNo" className="form-label">
                        Mobile Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.mobileNo }                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="createdAt" className="form-label">
                        Created At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdAt}                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated At" className="form-label">
                        Updated At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedAt}                       </span>
                        
                    </div>
                   
                    
                   
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdBy}                        </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedBy?singleConsentData?.updatedBy:"Unknown"}                       </span>
                        
                    </div>

                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="video" className="form-label">
                        Video
                        </label>
                        <span className="form-label d-flex justify-content-center mt-2">
                            <video autoPlay  style={{width:"280px",height:"200px"}} src={singleConsentData?.VideoUrl}>

                            </video>
                                                </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="signature" className="form-label">
                        Signature
                        </label>
                        <span className="form-label d-flex justify-content-center">
                        <img style={{maxWidth:"280px",height:"200px"}} src={singleConsentData?.signatureUrl} alt="" />
                                             </span>
                        
                    </div>

                    {caseType && <div className="col-md-10">
                    <label htmlFor="caseType" className="form-label">
                        Template Content
                    </label>
                    <QuillEditor
                        // ref={quill}
                        theme="snow"
                        value={value}
                        readOnly={true} // Set readOnly to true to disable editing
                        modules={{
                            toolbar: false, // Hide the toolbar
                        }}
                    />
                </div>}


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
                            // value={inputValues[index] || ''}
                            required
                        />
                    </div>
                ))}

</div>
</div>
 }
 </>

  )
}
