
import { useEffect, useRef, useState } from 'react'
import './Template.css'
import { getApi } from '../../helpers/requestHelpers'
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'

import QuillEditor from "react-quill";
import { AreaTop } from '../../components'
import { format } from "date-fns";




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
      <AreaTop title={`Case Type - ${singleConsentData?.caseType}`}/>
   <div className="container consentForm px-0 py-5 d-flex  flex-wrap justify-content-center align-items-center">
        {/* <div className="col-md-5 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Template Id
                        </label>
                        <span className="form-label">
                            {singleConsentData?._id}
                        </span>
                        
                    </div> */}
                


      

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
    
      {/* <iframe "  
      ></iframe> */}

<iframe
  width="380"
  height="220"
  src={singleConsentData?.videoUrl}
  frameborder="0"
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
      

    </div>
</div>

</div>
</div>

<div className="col-md-11 my-4">
<div className="accordion" id="accordionExample">



 {singleConsentData?.faqs?.map((faq,index)=>(
  <div key={index} className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${index}`} aria-expanded="true" aria-controls="collapseOne">
        {faq?.title}
      </button>
    </h2>
    <div id={`faq-${index}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
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
  src={singleConsentData?.videoUrl}
    frameborder="0"
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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


<div className="col-md-11">
  <h3 className='text-center' >Questions</h3>
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

<div className="col-md-11 mt-3">
<h3 className='text-center' >Custom Fields</h3>
</div>



<div className="col-md-11 my-4">

 {singleConsentData?.customFields?.map((custom,index)=>(
  <div key={index} className="row">

 
<h4 htmlFor="created By" className="form-label my-5">
                 <b>Field Name-</b>       {custom?.fieldName}
                        </h4>

                        <h6>Options of {custom?.fieldName}</h6>

{custom?.options?.map((option,index)=>(
<>
<div key={index} className="col-md-7 height_of_quill">
<h6><b>Option Name- </b>{option?.name}</h6>

<QuillEditor
            theme="snow"
            value={option?.description}
            readOnly={true} // Set readOnly to true to disable editing
            modules={{
                toolbar: false, // Hide the toolbar
              }}
          />
<div className="d-flex align-items-center justify-content-center">
{option?.imageUrl.map((image,index)=>(


<img style={{height:"200px", width:"250px"}} alt='' key={index} src={image}/>


))}
</div>

</div>
<div className="col-md-2">
{/* <label htmlFor="created By" className="form-label">
                        {singleConsentData?.caseType}
                        </label> */}

                        <div className="video-container">
     
      <iframe
  width="380"
  height="220"
  src={option?.videoUrl}    frameborder="0"
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
    </div>
</div>
</>
)) }

</div>
 )) }
</div>










<div className="col-md-11 mt-3">
<h3 className='text-center' >Template Details</h3>
</div>

<div className="col-md-11 borderC mx-3 mt-3 d-flex mb-5 flex-column justify-content-center ">

                        <label htmlFor="patientId" className="form-label">
                        Created At
                        </label>
                        <span className="form-label">
                        {format(new Date(singleConsentData?.createdAt), "MM/dd/yyyy")} 

                                         </span>

                    </div>
                    <div className="col-md-11 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="adharCard" className="form-label">
                            Updated At
                        </label>
                        <span className="form-label">
                        {format(new Date(singleConsentData?.updatedAt), "MM/dd/yyyy")} 

                        </span>
                        
                    </div>
                    <div className="col-md-11 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdBy}                       </span>
                        
                    </div>
                    <div className="col-md-11 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedBy?singleConsentData?.updatedBy:"Unknown"}                      </span>
                        
                    </div>
                    <div className="col-md-11 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <span className="form-label">
                        {singleConsentData?.caseType}
                        </span>
                        
                    </div>


</div>
</div> }
 </>

  )
}
