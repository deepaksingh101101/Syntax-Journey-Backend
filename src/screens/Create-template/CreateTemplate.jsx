import React, { useCallback, useRef, useState } from "react";
import QuillEditor from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './CreateTemplate.scss';
import { postApi, uploadImage } from "../../helpers/requestHelpers";
import { Toast } from "../../components/alert/Alert";
import { useNavigate } from "react-router-dom";
import { AreaTop } from "../../components";
import QuillResizeImage from 'quill-resize-image';
import ReactQuill, { Quill } from 'react-quill';
import Loader from "../../components/loader/Loader";

// import ImageResize from 'quill-image-resize-module'

const CreateTemplate = () => {
const [loader, setLoader] = useState(false)
const [imageLoader, setImageLoader] = useState(false)
const [value, setValue] = useState("");
const [questions, setQuestions] = useState([]);
const [questionInput, setQuestionInput] = useState("");
const [images, setImages] = useState([]);
// const [imageUrls, setImageUrls] = useState();





const quill = useRef();
const navigate=useNavigate();
Quill.register("modules/resize", QuillResizeImage);

function scrollToAndHighlightButton(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
      // Scroll to the element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Add a class to highlight the button
      element.classList.add('highlight');
  } else {
      console.error('Element not found:', elementId);
  }
}


  const submitHandler = async(event) => {
    event.preventDefault(); 
    if(questions?.length<=0){
      scrollToAndHighlightButton('question_add');
      return
    }
    if(faqs?.length<=0){
      scrollToAndHighlightButton('faq_btn');
      return
    }

    setLoader(true)
   
    const editor = quill.current.getEditor();
    const deltaContent = editor.getContents();

    const faqEditor = faqQuill.current.getEditor();
    const faqDeltaContent = faqEditor.getContents();
    const formData = {
      caseType: document.getElementById("Ctype").value,
      VideoUrl: document.getElementById("videoUrl").value,
      questions: questions.map(question => ({ text: question })),
      createdBy: JSON.parse(localStorage.getItem('user'))?.user?.email,
      deltaForm:deltaContent,
      imageUrl:images,
      faqs:faqs
      // Faq Section

    };
  
    console.log(formData)
   
try {
  let res= await postApi("post","api/template/submitTemplate",formData)
  console.log(res)

  if(res?.data?.status===true){
 
   Toast.fire({
     icon: "success",
     title: "Template Created"
 });
 setLoader(false)
 navigate('/das')
  }
  else{
    setLoader(false)
   Toast.fire({
     icon: "error",
     title: `${res?.response?.data?.errors?.[0]?.msg ? res.response.data.errors[0].msg : res?.response?.data?.message}`
 });
  }
} catch (error) {
  setLoader(false)
  Toast.fire({
    icon: "error",
    title: `Something went's wrong`
});
}
  
    // Here you can handle the Delta content further, like sending it to a server or processing it in some way.
  };

  // const imageHandler = useCallback(() => {
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();

  //   input.onchange = () => {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageUrl = reader.result;
  //       const quillEditor = quill.current.getEditor();
  //       const range = quillEditor.getSelection(true);
  //       quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
  //     };
  //     reader.readAsDataURL(file);
  //   };
  // }, []);



  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link",],
        [{ align: [] }],
        ["clean"],
        // ['image'],
      ],
      // handlers: {
      //   image: imageHandler,
      // },
    },
    clipboard: {
      matchVisual: true,
    },
    // resize: {
    //   parchment: Quill.import('parchment'),
    //   modules: ['Resize', 'DisplaySize']
    // }
  };
  
  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet",
    "indent", "link",  "color", "align", "clean"
  ];



  const handleAddQuestion = () => {
    if (questionInput.trim()) {  
      setQuestions([...questions, questionInput]);
      setQuestionInput("");  
    }
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };


  const handleMainFileSelect = async (event) => {
    setImageLoader(true)
    const files = event.target.files;
    const formData = new FormData();
    
    // Append each file into formData
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  
    try {
      const response = await uploadImage("/api/consent/uploadImage", formData);
      console.log(response);
      // setImages(response?.imageUrls)

      setImages(prevUrls => [...prevUrls, ...response.imageUrls]); 
      setImageLoader(false)
    } catch (error) {
      setLoader(false)
      setImageLoader(false)

      console.log(error);
    }
  };




  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
   };
  
   const [faqs, setFaqs] = useState([]);
   const [faqTitle, setFaqTitle] = useState('');
   const [faqDescription, setFaqDescription] = useState('');
   const [faqVideoUrl, setFaqVideoUrl] = useState('');
   const [faqImages, setFaqImages] = useState([]);
   const faqQuill = useRef(null); 

   const handlefaqImageSelect = async (event) => {
    setImageLoader(true)

    const files = event.target.files;
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
  
    try {
      const response = await uploadImage("/api/consent/uploadImage", formData);
      console.log(response);
      setFaqImages(prevUrls => [...prevUrls, ...response.imageUrls]); // Assuming the API responds with an array of image URLs
      setImageLoader(false)
    } catch (error) {
      setLoader(false);
      setImageLoader(true)
      console.log(error);
    }
  };
  
  const addFaq = () => {

    if(faqTitle?.length<=0){
      return
    }

    const newFaq = {
      title: faqTitle,
      description: faqDescription,
      videoUrl: faqVideoUrl,
      imageUrl: faqImages,
    };

  
    setFaqs([...faqs, newFaq]); // Add new FAQ to the array
    // Reset fields
    console.log(faqs)
    setFaqTitle('');
    setFaqDescription('');
    setFaqVideoUrl('');
    setFaqImages([]);
  };

  const handleDeleteFaqImage = (faqIndex, imageIndex) => {
    setFaqs(faqs => faqs.map((faq, index) => {
      if (index === faqIndex) {  // Find the right FAQ
        return {
          ...faq,
          images: faq.images.filter((_, idx) => idx !== imageIndex)  // Filter out the image
        };
      }
      return faq;
    }));
  };
  
  const handleDeleteFaq = (faqIndex) => {
    setFaqs(currentFaqs => currentFaqs.filter((_, index) => index !== faqIndex));
  };
  
  function truncateHtml(html, maxLength) {
    const strippedString = html.replace(/(<([^>]+)>)/gi, ""); // Strips HTML tags
    if (strippedString.length > maxLength) {
      return strippedString.substring(0, maxLength) + "...";
    }
    return strippedString;
  }
  
  return (
    <>
    {loader &&
      <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
      </div>
  }



    {!loader && <div className="content-area">
      
      <AreaTop title='Template Form'/>
    <div className="container consentForm p-5">
      <form className='row g-3' onSubmit={submitHandler}>
        <div className="col-md-12">
          <label htmlFor="Ctype" className="form-label">
            Case Type
          </label>
          <input
            type="text"
            className="form-control"
            id="Ctype"
            placeholder="Enter Case Type"
            required
            name='caseType'
          />
        </div>
        <div className="col-md-12" id="editor">
          <label htmlFor="editor_content mb-2" className="form-label">
            Description
          </label>
          <QuillEditor
            ref={quill}
            theme="snow"
            value={value}
            formats={formats}
            modules={modules}
            onChange={setValue}
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="Ctype" className="form-label">
            Video
          </label>
          <input
            type="text"
            className="form-control"
            id="videoUrl"
            placeholder="Enter Video Link "
            required
            name='videUrl'
          />
        </div>

        <div className="col-md-12" id="questions">
          <label htmlFor="question_input" className="form-label">Insert Questions</label>
          <div className="d-flex justify-content-between">
            <input
              type="text"
              className="form-control"
              id="question_input"
              placeholder="Enter Question and click on add to add"
              required={questions?.length>=1?false:true}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              name='question_input'
            />
            <button style={{maxWidth: "100px"}} id="question_add"  onClick={handleAddQuestion} type="button" className="btn btn-success w-100 ms-2">Add</button>
          </div>
        </div>

           {/* List questions */}
           <div className="col-md-12">
          <ul className="list-group mt-3">
            {questions?.map((question, index) => (
              <div key={index} className="">
                <span  className="form-label ">Question {index+1}</span>
              <li  className="list-group-item my-1 d-flex justify-content-between align-items-center">
                {question}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveQuestion(index)}>Remove</button>
              </li>
              </div>
            ))}
          </ul>
        </div>

        <div className="col-md-12">
  <label className="btn bg-primary-color text-light w-100 p-5">
    <i className="fa-solid fa-file-signature"></i> Upload Image
    <input
      type="file"
      style={{ display: 'none' }}
      onChange={handleMainFileSelect}
      multiple
      accept=".jpg,.jpeg,.png" // Specify accepted file types
    />
  </label> 
  <div className="col-md-12 d-flex justify-content-around mt-3">
    {imageLoader && <Loader/>}
  {images?.map((image, index) => (
    <div className="position-relative" style={{width:"200px", height:"150px"}}   key={index}  >
      <i onClick={()=>{handleDeleteImage(index)}} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
    <img className='px-2 mx-2 img-fluid'style={{width:"200px", height:"150px"}} src={image} alt={`Uploaded file ${index + 1}`} />
    </div>
  ))}
</div>
</div>


     



{/* ------------------------------------ */}


<div>
  <h2 className="text-center">Create FAQ'S</h2>
  <div className="col-md-12" id="faq">
    <label htmlFor="faqTitle" className="form-label">FAQ's Title</label>
    <input
      type="text"
      className="form-control"
      id="question_input"
      placeholder="Enter FAQ Title"
      name='faq_title'
      required={faqs[0]?.title?.length >= 1 ? false : true}
      value={faqTitle}
      onChange={(e) => setFaqTitle(e.target.value)}
    />
  </div>
  <div className="col-md-12" id="faqDescription">
    <label htmlFor="faqDescription" className="form-label">FAQ's Description</label>
    <QuillEditor
      ref={faqQuill}
      theme="snow"
      value={faqDescription}
      formats={formats}
      modules={modules}
      onChange={setFaqDescription}
    />
  </div>
  <div className="col-md-12">
    <label htmlFor="videoUrl" className="form-label">Video Link</label>
    <input
      type="text"
      className="form-control"
      id="videoUrl"
      placeholder="Enter Video Link"
      value={faqVideoUrl}
      onChange={(e) => setFaqVideoUrl(e.target.value)}
    />
  </div>
  <div className="col-md-12 my-3">
    <label className="btn bg-primary-color text-light w-100 ">
      Upload Image
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handlefaqImageSelect}
        multiple
        accept=".jpg,.jpeg,.png"
      />
    </label>

  </div>

  <div className="col-12 d-flex justify-content-center">
  {imageLoader && <Loader/>}
  </div>
  <div className="col-12">
    <button id="faq_btn" type="button" className="btn btn-success w-100 my-3" onClick={addFaq}>Add This FAQ</button>
  </div>
</div>


<div className="col-12 mt-5">
   {faqs?.length>=1 &&   <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Video URL</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {faqs?.map((faq, index) => (
            <tr key={index} className="position-relative">
              <td>{faq.title || 'No title provided'}</td>
              <td dangerouslySetInnerHTML={{ __html: truncateHtml(faq.description, 20) }}></td>
              <td>
                {faq.videoUrl ? 
                  <a href={faq.videoUrl} target="_blank" rel="noopener noreferrer">View Video</a> 
                  : 'No video link'}
              </td>
              <td className="d-flex justify-content-start" >
                {faq?.images?.length > 0 ? (
                  faq?.images?.map((image, idx) => (
                    // <div key={idx} className="img-wrapper">
                    <div  key={idx}  className=" mx-2 position-relative d-flex justify-content-start mx-2 ">
                      <img className="img-wrapper " src={image} alt={`FAQ ${index} Image ${idx}`} style={{ width: '100px', height: '100px' }} />
                      <i  onClick={() => handleDeleteFaqImage(index, idx)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
                      <div/>
                     </div>
                  ))
                ) : 'No images'}
              </td>
              <td className="px-3 " >
              <i  onClick={() => handleDeleteFaq(index)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>



        <div className="col-12  ">
          <button type="submit" className="btn btn-danger w-100">Submit</button>
        </div>
      </form>
    </div>
    </div>}
    </>
  )
}

export default CreateTemplate;
