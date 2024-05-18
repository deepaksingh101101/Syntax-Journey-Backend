
import { useEffect, useRef, useState } from 'react'
import './Template.css'
import { getApi } from '../../helpers/requestHelpers'
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'

import QuillEditor from "react-quill";
import { AreaTop } from '../../components'




export default function ViewTemplate() {

    const [value, setValue] = useState("");
    const quill = useRef();

    const [singleConsentData, setSingleConsentData] = useState()
    const [loader, setLoader] = useState(true)

    const {_id}=useParams()
    console.log(_id)

    const getConsentData=async()=>{
      try {
        setLoader(true)
        let res=   await getApi("get",`api/template/templateId/?templateId=${_id}`)
       setValue(res?.data?.template?.deltaForm)
        setSingleConsentData(res?.data?.template)
        setLoader(false)
      } catch (error) {
        console.log(error)
        setLoader(false)
      }
    }

    useEffect(() => {
        getConsentData();
    }, [])

  return (
    <>
      {loader &&
   <div className="d-flex w-100 justify-content-center align-items-center">
       <Loader/>
   </div>
}
  
   {!loader && 
    <div className="">
      <AreaTop title={`Template - ${singleConsentData?._id}`}/>
   <div className="container consentForm px-0 py-5 d-flex  flex-wrap justify-content-center align-items-center">
        <div className="col-md-3 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Template Id
                        </label>
                        <span className="form-label">
                            {singleConsentData?._id}
                        </span>
                        
                    </div>
                   
        <div className="col-md-3 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <span className="form-label">
                        {singleConsentData?.caseType}
                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Created At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdAt}                      </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="adharCard" className="form-label">
                            Updated At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedAt}
                        </span>
                        
                    </div>
                    
                    
                   
        
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdBy}                       </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedBy?singleConsentData?.updatedBy:"Unknown"}                      </span>
                        
                    </div>

                    <div className="col-md-10">
  <ul className="list-group ">
    {singleConsentData?.questions.map((question, index) => (
      <div key={index} className="mt-2">
        <span className="form-label">Question {index + 1}</span>
        <li className="list-group-item my-1 d-flex justify-content-between align-items-center">
          {question.text} {/* Accessing the text property of each question */}
        </li>
      </div>
    ))}
  </ul>
</div>

<div className="col-md-10 my-4">
<label htmlFor="created By" className="form-label">
                        Template View
                        </label>
<QuillEditor
            theme="snow"
            value={value}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />

</div>



</div>
</div> }
 </>

  )
}
