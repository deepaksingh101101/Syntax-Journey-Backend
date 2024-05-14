import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ConsentForm = () => {
    const questions = [
        { "ques": "questions1" },
        { "ques": "questions2" },
        { "ques": "questions3" },
    ]
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
                <button className="btn bg-primary-color text-light p-5 w-100  "><i className="fa-solid fa-file-signature"></i> Upload Signature</button>
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