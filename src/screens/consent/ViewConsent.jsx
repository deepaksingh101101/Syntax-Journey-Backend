
import { useEffect, useState } from 'react'
import './Consent.css'
import { getApi } from '../../helpers/requestHelpers'
import { useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import { AreaTop } from '../../components'





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
    }, [])

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
        <div className="col-md-3 borderC mx-3 d-flex flex-column mb-5 justify-content-center ">
                        <label htmlFor="Pname" className="form-label">
                            Patient Name
                        </label>
                        <span className="form-label">
                            {singleConsentData?.patientName}
                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="patientId" className="form-label">
                        Patient Id
                        </label>
                        <span className="form-label">
                        {singleConsentData?.patientId}                      </span>
                        
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
                        <label htmlFor="adharCard" className="form-label">
                            Aadhar Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.adharCard}
                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="gaurdianName" className="form-label">
                        Gaurdian Name
                        </label>
                        <span className="form-label">
                       {singleConsentData?.gaurdianName}                       </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="mobileNo" className="form-label">
                        Mobile Number
                        </label>
                        <span className="form-label">
                        {singleConsentData?.mobileNo }                       </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="signature" className="form-label">
                        Signature
                        </label>
                        <span className="form-label">
                        signature                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="video" className="form-label">
                        Video
                        </label>
                        <span className="form-label">
                        video                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="createdAt" className="form-label">
                        Created At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.createdAt}                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated At" className="form-label">
                        Updated At
                        </label>
                        <span className="form-label">
                        {singleConsentData?.updatedAt}                       </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="created By" className="form-label">
                        Created By
                        </label>
                        <span className="form-label">
                        Created By                        </span>
                        
                    </div>
                    <div className="col-md-3 borderC mx-3 d-flex mb-5 flex-column justify-content-center ">
                        <label htmlFor="updated By" className="form-label">
                        Updated By
                        </label>
                        <span className="form-label">
                        Updated By                        </span>
                        
                    </div>
</div>
</div>
 }
 </>

  )
}
