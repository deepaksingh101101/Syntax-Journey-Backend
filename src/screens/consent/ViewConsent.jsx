
import { useEffect, useState } from 'react'
import './Consent.css'
import { getApi } from '../../helpers/requestHelpers'
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import { AreaTop } from '../../components'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { format } from "date-fns";

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import QuillEditor from "react-quill";




export default function ViewConsent() {

      const [htmlStart, setHtmlStart] = useState()
      const printRef = useRef();
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

        setCaseType(res?.data?.consent?.caseType)
        const rest = await getApi("get", `/api/template/questionsByCaseType?caseType=${res?.data?.consent?.caseType}`);
        setAllQuestions(rest?.data?.questions)

        const temp = await getApi("get", `/api/template/getTemplateByCaseType?caseType=${res?.data?.consent?.caseType}`);
        console.log(temp)
        setValue(temp?.data?.deltaForm)
        
        var cfg = {};

        var converter = new QuillDeltaToHtmlConverter(temp?.data?.deltaForm?.ops, cfg);

         setHtmlStart(converter.convert()) 

    console.log(htmlStart)
        setLoader(false)
      } catch (error) {
        console.log(error)
        setLoader(false)
      }
    }

    useEffect(() => {
        getConsentData();
        // handleCaseTypeChange();
    }, [])

    const [value, setValue] = useState("");

    const [caseType, setCaseType] = useState()
    const [allQuestions, setAllQuestions] = useState()

   

    const [inputValues, setInputValues] = useState([]);


    let htmlEnd=`
    <div className="col-md-10 mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
    <img src='{{patientSignature}}' alt=''></img>
                        <h3 htmlFor="signature" className="form-label font_custom_pdf">
                        Signature and Thumb Impression of Patient:
                        </h3>
                    </div>
    
    
    <div style='margin-top:50px' className="col-md-10 mt-5 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="name" className="form-label font_custom_pdf">
                           <b> Name:</b> {{patientName}}
                        </h3>
                        
                    </div>
                    <div className="col-md-10 mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                          <b>  Address:</b> {{patientAddress}}
                        </h3>
                        
                    </div>
                    <div className="col-md-10  d-flex justify-content-between mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                          <b>  Phone Number: </b>{{patientNumber}}
                        </h3>
    
                         <h3 htmlFor="address" className="form-label font_custom_pdf">
                          <b>  Date: </b>{{patientDate}}
                        </h3>
                    </div>
                   
                    <div className="col-md-10 mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Place:</b> {{patientplace}}
                        </h3>
                        
                    </div>
    
                    <div style='margin-top:500px' className="col-md-10 mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                     <img src={{parentsSignatureImage}} alt=''></img>
                        <h3 htmlFor="signature" className="form-label font_custom_pdf">
                        Signature and Thumb Impression of Patient/guardian if the patient is minor or mentally unsound
                        </h3>
                    </div>
    
                    <div style='margin-top:20px' className="col-md-10  d-flex justify-content-between mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                          <b>  Name:</b> {{parentsName}}
                        </h3>
    
                         <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Relation with Patient:</b> {{parentsRelation}}
                        </h3>
                    </div>
    
    
    
                    <div className="col-md-10  d-flex justify-content-between mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Address:</b> {{parentsAddress}}
                        </h3>
    
                    </div>
    
    
    
                    <div className="col-md-10  d-flex justify-content-between mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Phone Number:</b> {{parentsAddress}}
                        </h3>
    
                         <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Date:</b> {{parentsDate}}
                        </h3>
                    </div>
                   
                    <div className="col-md-10 mt-2 px-2 px-sm-3 px-md-5 px-lg-0">
                        <h3 htmlFor="address" className="form-label font_custom_pdf">
                           <b> Place: </b>{{parentsPlace}}
                        </h3>
                        
                    </div>
                    

<div style="
display: flex;
justify-content: space-between;
margin-top:150px;
"
 className="d-flex justify-content-between" >

 <div className="mt-5" >
  <h3 htmlFor="signature" className="form-label mt-5">
   Witness 1
   </h3>
   <div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">
       <img src='' alt=''></img>
   <h3 htmlFor="signature" className="form-label">
   Signature:
   </h3>
</div>

<div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">

<h3 htmlFor="address" className="form-label">
Tel:
</h3>
</div>

<h3 htmlFor="address" className="form-label">
       Address:
   </h3>
   <div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">

  <h3 htmlFor="address" className="form-label">
       Tel:
   </h3>
   </div>
  </div>         
  
  <div className="mt-5">
  <h3 htmlFor="signature" className="form-label mt-5">
   Witness 2
   </h3>
   <div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">
       <img src='' alt=''></img>
   <h3 htmlFor="signature" className="form-label">
   Signature:
   </h3>
</div>

<div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">

<h3 htmlFor="address" className="form-label">
Tel:
</h3>
</div>

<h3 htmlFor="address" className="form-label">
       Address:
   </h3>
   <div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">

  <h3 htmlFor="address" className="form-label">
       Tel:
   </h3>
   </div>
   </div>
  </div>

    `

    let fullHtml = htmlStart + htmlEnd;


    fullHtml = fullHtml.replace('{{patientName}}', singleConsentData?.patientName)
                   .replace('{{patientAddress}}', singleConsentData?.address)
                   .replace('{{patientNumber}}', singleConsentData?.mobileNo)
                   .replace('{{patientDate}}', singleConsentData?.createdAt)
                   .replace('{{patientSignature}}', singleConsentData?.signatureUrl)
                   .replace('{{parentsRelation}}', singleConsentData?.relation)
                  


const reportemplateRef=useRef(null);

// const  prindPdf=async()=>{
//     const input =reportemplateRef.current;
//     const canvas=await html2canvas(input)
//     const imgData=canvas.toDataURL('image/png')
//     console.log(imgData)

//     const pdf=new jsPDF({
//         orientation:"portrait",
//         unit:"px",
//         format:"a4"
//     })

//     const width=pdf.internal.pageSize.getWidth();

//     const height=(canvas.height*width)/canvas.width;

//     pdf.addImage(imgData,"PNG",0,0,width,height)
//     pdf.save('document.pdf')
// }


const prindPdf = async () => {
    setLoader(true)
    const input = reportemplateRef.current;

    try {
        const canvas = await html2canvas(input, {
            scale: 1,  // Adjust this scale to improve the quality of the output if needed
            useCORS: true,
            allowTaint: true  // Be cautious with this option as it might cause security or privacy issues
        });
        const imgData = canvas.toDataURL('image/png');
        console.log(imgData);  // Make sure imgData is logging correctly

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4"
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add the image to the first page
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;

        // Continue adding new pages as long as there is content to add
        while (heightLeft > 0) {
            position -= pageHeight;  // Move the position up by one page height
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('document.pdf');
        setLoader(false)
    } catch (error) {
        console.error("Error generating PDF", error);
        setLoader(false)

    }
};







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
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Relation With Patient
                        </label>
                        <span className="form-label">
                       {singleConsentData?.relation}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Address
                        </label>
                        <span className="form-label">
                       {singleConsentData?.address}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Date Of Birth
                        </label>
                        <span className="form-label">
                       {singleConsentData?.dob}                       </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gender
                        </label>
                        <span className="form-label">
                       {singleConsentData?.gender}                       </span>
                        
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
                       {format(new Date(singleConsentData?.createdAt), "MM/dd/yyyy")}                    </span>
                        
                    </div>
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated At" className="form-label">
                        Updated At
                        </label>
                        <span className="form-label">
                        {format(new Date(singleConsentData?.updatedAt), "MM/dd/yyyy")} 
                      
                                              </span>
                        
                    </div>
                   
                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdBy}                        </span>
                        
                    </div>
                    {/* <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedBy?singleConsentData?.updatedBy:"Unknown"}                       </span>
                        
                    </div> */}

                    <div className="col-md-5 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="video" className="form-label">
                        Video
                        </label>
                        <span className="form-label d-flex justify-content-center mt-2">
                            <video autoPlay  style={{width:"280px",height:"200px"}} src={singleConsentData?.VideoUrl}>

                            </video>

                            {/* <iframe height="fit-content" style={{height:"50vh",width:"30vw"}} src={singleOptionData[index]?.videoUrl}  >

                            </iframe> */}

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
                    <div className="col-md-10 borderC mx-3  d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <span className="form-label">
                        {singleConsentData?.caseType}
                        </span>
                        
                    </div>

                    {/* {caseType && <div className="col-md-10  px-2 px-sm-3 px-md-5 px-lg-0">
                    <label htmlFor="caseType" className="form-label">
                        Template Content
                    </label>
                    <QuillEditor
                        theme="snow"
                        value={value}
                        readOnly={true} 
                        modules={{
                            toolbar: false, 
                        }}
                    />
                </div>} */}





                {/* <div ref={reportemplateRef}  id='pdf' dangerouslySetInnerHTML={{ __html: fullHtml }} className=" col-md-10 mt-2 px-2 px-sm-3 px-md-5 w-100 px-lg-5">
                 
            
                </div> */}


<div  className="col-md-10 w-100    px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
<h3 className='text-center'>Custom Field's</h3>
</div>   
           

            {singleConsentData?.customFields?.map(item => (
                 <div key={item._id} className="col-md-10 borderC mx-3 mt-2 d-flex mb-5 flex-column justify-content-center ">
                 <label htmlFor="created By" className="form-label">
              <b> Field Name-</b>  {item.fieldName}
                 </label>
                 <span className="form-label">
                Option {item.option}                        </span>
                
             </div>
            ))}

<div  className="col-md-10 w-100    px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
<h3>Question's</h3>
</div>       

<div className='w-100' >
            {Object.entries(singleConsentData.question).map(([key, value], index) => (
                <div key={index} className="col-md-10 w-100 px-2 px-sm-3 px-md-5 px-lg-5 mt-3">
                    <label htmlFor={`ques-${index}`} className="form-label w-100">
                        <b>Question {index + 1} </b> {key}
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id={`ques-${index}`}
                        name='questions'
                        value={value}
                        required
                        readOnly
                    />
                </div>
            ))}
        </div>

<div className="col-md-10 w-100    px-2 px-sm-3 px-md-5 px-lg-5 ">
    
{/* <button className='btn btn-primary w-100 mt-3' type="button" onClick={prindPdf} >Print</button> */}
</div>


</div>
</div>
 }
 </>

  )
}
