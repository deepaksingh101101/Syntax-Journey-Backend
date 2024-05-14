import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas';
import { uploadImage} from '../../helpers/requestHelpers'

const ConsentForm = () => {
    const questions = [
        { "ques": "questions1" },
        { "ques": "questions2" },
        { "ques": "questions3" },
    ]
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
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    

        return (
            <div className="container consentForm p-5">
                <form className='row g-3'>
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
                            placeholder="Enter Paitent Id"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Pnum" className="form-label">
                            Mobile Number
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="Pnum"
                            placeholder="Enter Paitent Id"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="Paadhar" className="form-label">
                            Aadhar Card
                        </label>
                        <input
                            type="text"
                            className="form-control "
                            id="Paadhar"
                            placeholder="Enter Aadhar Number"
                            required
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
                        >
                            <option >Select Gender</option>
                            <option value="urgent">Male</option>
                            <option value="routine">Female</option>
                            <option value="referral">Others</option>
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
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="caseType" className="form-label">
                            Case Type
                        </label>
                        <select
                            className="form-control"
                            id="caseType"
                            required
                        >
                            <option>Select Case Type</option> {/* Default placeholder option */}
                            <option value="urgent">Urgent</option>
                            <option value="routine">Routine</option>
                            <option value="referral">Referral</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>


                    {questions && questions.map((que, index) => (
                        <div key={index} className="col-md-12">
                            <label htmlFor="ques" className="form-label">
                                {que.ques}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="ques"
                                placeholder="Enter Your Answer"
                                required
                            />
                        </div>
                    ))}
                    <div className="col-md-6">
                        <button className="btn bg-primary-color text-light p-5 w-100  " data-bs-toggle="modal" data-bs-target="#uploadSignatureModal"><i className="fa-solid fa-file-signature"></i> Upload Signature</button>
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
                        <button className="btn bg-primary-color text-light p-5 w-100  "><i className="fa-solid fa-video"></i> Capture Consent Video</button>
                    </div>

                    <div className="col-12">
                        <button className="btn btn-success w-100">Submit</button>
                    </div>
                </form>
            </div>
        )
    }

    export default ConsentForm