import React, { useCallback, useEffect, useRef, useState } from "react";
import QuillEditor from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './CreateTemplate.scss';
import { getApi, postApi, uploadImage } from "../../helpers/requestHelpers";
import { Toast } from "../../components/alert/Alert";
import { useNavigate, useParams } from "react-router-dom";
import { AreaTop } from "../../components";
import Loader from "../../components/loader/Loader";

const EditTemplate = () => {
  const [value, setValue] = useState("");
  const quill = useRef();
const navigate=useNavigate();
const {_id}=useParams()
const [caseType, setCaseType] = useState("")
const [templateData, setTemplateData] = useState()
const [questions, setQuestions] = useState([]);
const [questionInput, setQuestionInput] = useState("");

const getTemplateById=async()=>{
    let res=   await getApi("get",`api/template/templateId/?templateId=${_id}`)
    console.log(res?.data?.template?.questions)
    setTemplateData(res?.data?.template)
    setCaseType(res?.data?.template?.caseType)
    setValue(res?.data?.template?.deltaForm)
    setQuestions(res?.data?.template?.questions)
    setFaqs(res?.data?.template?.faqs)
setCustomFields(res?.data?.template?.customFields)
document.getElementById("videoUrl").value=res?.data?.template?.videoUrl
    setImages(res?.data?.template?.imageUrl)

    
}

useEffect(() => {
getTemplateById()
}, [])

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
    event.preventDefault(); // Prevent the default form submission behavior


    if(questions?.length<=0){
      scrollToAndHighlightButton('question_add');
      return
    }
    if(faqs?.length<=0){
      scrollToAndHighlightButton('faq_btn');
      return
    }

    // Accessing the Quill editor instance and its contents in Delta format
    const editor = quill.current.getEditor();
    const deltaContent = editor.getContents();
    const faqEditor = faqQuill.current.getEditor();
    const faqDeltaContent = faqEditor.getContents();

    const formData = {
      caseType: document.getElementById("Ctype").value,
      videoUrl: document.getElementById("videoUrl").value,
      questions:  questions.map(question => ({ text: question})),
      createdBy: JSON.parse(localStorage.getItem('user'))?.user?.email,
      deltaForm:deltaContent,
      imageUrl:images,
      faqs:faqs,
      customFields:customFields,
      updatedBy:JSON.parse(localStorage.getItem('user'))?.user?.email

      // Faq Section

    };
    console.log(formData)
   
try {
  let res= await postApi("post",`/api/template/updateTemplate?templateId=${_id}`,formData)
  console.log(res)

  if(res?.data?.status===true){
 
   Toast.fire({
     icon: "success",
     title: "Template Updated"
 });
 navigate('/templateList')
  }
  else{
   Toast.fire({
     icon: "error",
     title: `${res?.response?.data?.message}`
 });
  }
} catch (error) {
  Toast.fire({
    icon: "error",
    title: `Something went's wrong`
});
}
  
    // Here you can handle the Delta content further, like sending it to a server or processing it in some way.
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };
      reader.readAsDataURL(file);
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet",
    "indent", "link", "image", "color", "align","clean"
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





  // copying from create template 

  const [imageLoader, setImageLoader] = useState(false)
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false)
  const [faqs, setFaqs] = useState([]);
  const [faqTitle, setFaqTitle] = useState('');
  const faqQuill = useRef(null); 
  const [faqDescription, setFaqDescription] = useState('');
  const [faqVideoUrl, setFaqVideoUrl] = useState('');
  const [faqImages, setFaqImages] = useState([]);
  const [editIndex, setEditIndex] = useState()


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

   const handleEditOption=(index)=>{
    setOptionIndex(index)
    
    const fieldIndex = customFields[customEditIndex]
    console.log(fieldIndex?.options[index]?.name)

    setCustomOptionName(fieldIndex?.options[index]?.name)
    setTempOptionDescription(fieldIndex?.options[index]?.description)
    setCustomOptionVideo(fieldIndex?.options[index]?.videoUrl)
    setTempOptionImage(fieldIndex?.options[index]?.imageUrl)
   }
  

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


  const handleDeleteFaqImage = (faqIndex, imageIndex) => {
    console.log(faqs, faqIndex, imageIndex);
  
    setFaqs(faqs => faqs.map((faq, index) => {
      if (index === faqIndex) {  // Find the right FAQ
        // Create a new array without the image at imageIndex
        const updatedImages = faq.imageUrl.filter((_, idx) => idx !== imageIndex);
        console.log(updatedImages)
        console.log(faq)

        return {
          ...faq,
          imageUrl: updatedImages  // Update the images array for the FAQ
        };
      }
      return faq;
    }));
  };
  
  
  const handleDeleteFaq = (faqIndex) => {
    setFaqs(currentFaqs => currentFaqs.filter((_, index) => index !== faqIndex));
  };


  const handleEditFaq = async (index) => {
 
    if (index < 0 || index >= faqs.length) {
      console.error('Index out of bounds');
      return;
    }

    setEditIndex(index)

    const selectedFaq = faqs[index];
    
    // Set the states with the values from the selected FAQ
    setFaqTitle(selectedFaq?.title);
    setFaqDescription(selectedFaq?.description);
    setFaqVideoUrl(selectedFaq?.videoUrl);
    setFaqImages(selectedFaq?.imageUrl);
  
}


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


function truncateHtml(html, maxLength) {
  const strippedString = html.replace(/(<([^>]+)>)/gi, ""); // Strips HTML tags
  if (strippedString.length > maxLength) {
    return strippedString.substring(0, maxLength) + "...";
  }
  return strippedString;
}

const handleDeleteFaqImageEdit = (idx) => {
  // Update the faqImages state to filter out the image at index 'idx'
  setFaqImages(currentImages => currentImages.filter((image, index) => index !== idx));
}

const handleSubmitEdit = () => {
  // Create a new FAQ object with the updated data
  const newFaq = {
    title: faqTitle,
    description: faqDescription,
    videoUrl: faqVideoUrl,
    imageUrl: faqImages,
  };
  
  // Check if the index is within the bounds of the array
  if (editIndex >= 0 && editIndex < faqs.length) {
    // Update the FAQ at the specified index
    faqs[editIndex] = newFaq;
  } else {
    // Optional: Handle the error case where the index is out of bounds
    console.error('Invalid index');
  }

  setFaqTitle("")
  setFaqDescription("")
  setFaqVideoUrl("")
  setFaqImages([])
};


const [key, setkey] = useState()
const [tempOption, setTempOption] = useState()
const optionsQuill = useRef(null); 
const [tempOptionDescription, setTempOptionDescription] = useState()
const [tempOptionVideo, setTempOptionVideo] = useState()
const [tempOptionImage, setTempOptionImage] = useState([])
const [customFields, setCustomFields] = useState([])
const [customEditIndex, setCustomEditIndex] = useState()
const [allOptions, setAllOptions] = useState([])
const [customEditTitle, setCustomEditTitle] = useState()
const [optionIndex, setOptionIndex] = useState()
const [customOptionName, setCustomOptionName] = useState()
const [customOptionVideo, setCustomOptionVideo] = useState()
const customQuill = useRef(null); 


const addThisOption = () => {
  const option = {
    name: tempOption,
    description: tempOptionDescription,
    videoUrl: tempOptionVideo,
    imageUrl: tempOptionImage,
  };

  // Log the new option being added
  console.log("Adding new option:", option);

  // Then, check if the field with the specified key already exists
  setCustomFields(prevCustomFields => {
    const fieldIndex = prevCustomFields.findIndex(field => field.fieldName === key);
    console.log("Field index found at:", fieldIndex);

    if (fieldIndex !== -1) {
      // If the field exists, update it by adding the new option to its options array
      const updatedFields = [...prevCustomFields];
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        options: [...updatedFields[fieldIndex].options, option]
      };
      setTempOption("")
      setTempOptionDescription("")
      setTempOptionImage([])
      setTempOptionVideo([])
      console.log("Updated existing field with new option:", updatedFields);
      return updatedFields;
    } else {
      // If the field does not exist, create a new field with the option
      const newField = {
        fieldName: key,
        options: [option]
      };
      setTempOption("")
      setTempOptionDescription("")
      setTempOptionImage([])
      setTempOptionVideo([])
      console.log("Adding new field with new option:", newField);
      return [...prevCustomFields, newField];
    }
  });
};

const handleEditCustom = (index) => {
  // Access the custom field using the provided index
  setCustomEditIndex(index)
  const field = customFields[index];
  setAllOptions(field?.options)
      console.log(allOptions)
  if (field) {
    setCustomEditTitle(field.fieldName);

    // Assuming you want to edit the first option for simplicity
    if (field.options && field.options.length > 0) {
      setAllOptions(field?.options)
      console.log(allOptions)
     }
  }
};

const handleOptionsImageSelect = async (event) => {
  setImageLoader(true)

  const files = event.target.files;
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }

  try {
    const response = await uploadImage("/api/consent/uploadImage", formData);
    console.log(response);
    setTempOptionImage(prevUrls => [...prevUrls, ...response.imageUrls]); // Assuming the API responds with an array of image URLs
    setImageLoader(false)
  } catch (error) {
    setLoader(false);
    setImageLoader(true)
    console.log(error);
  }
};

const handleDeleteCustom = (index) => {
  console.log("hello")
  setCustomFields(prevCustomFields => {
    // Filter out the element at the specified index
    return prevCustomFields.filter((_, i) => i !== index);
  });
};

const handleDeleteOptionsImage = (index) => {
  const updatedImages = tempOptionImage.filter((_, i) => i !== index);
  setTempOptionImage(updatedImages);
 };

 const handleDeleteCustomImageEdit = (index) => {
  // Update the customImages state to filter out the image at the specified index
  setTempOptionImage(currentImages => currentImages.filter((_, imgIndex) => imgIndex !== index));
};

const handleCustomImageSelect = async (event) => {
  setImageLoader(true)

  const files = event.target.files;
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }

  try {
    const response = await uploadImage("/api/consent/uploadImage", formData);
    console.log(response);
    setTempOptionImage(prevUrls => [...prevUrls, ...response.imageUrls]); // Assuming the API responds with an array of image URLs
    setImageLoader(false)
  } catch (error) {
    setLoader(false);
    setImageLoader(true)
    console.log(error);
  }
};


const handleSubmitCustomEdit = () => {
  if (customEditIndex !== null) {
    // Make a deep copy of customFields to mutate
    const updatedCustomFields = [...customFields];
    const fieldOptions = [...updatedCustomFields[customEditIndex].options];

    // Prepare the new or updated option object
    const newOption = {
      name: customOptionName,
      description: tempOptionDescription,
      videoUrl: customOptionVideo,
      imageUrl: tempOptionImage,
    };

    // Check if optionIndex is defined, if not, add the new option to the end of the list
    if (typeof optionIndex !== 'undefined' && optionIndex !== null) {
      // Update the specific option
      fieldOptions[optionIndex] = newOption;
    } else {
      // Add new option to the end of the options list
      fieldOptions.push(newOption);
    }

    // Update the options in the field
    updatedCustomFields[customEditIndex] = {
      ...updatedCustomFields[customEditIndex],
      options: fieldOptions,
    };

    // Update the customFields state
    setCustomFields(updatedCustomFields);
    console.log(updatedCustomFields);

  } else {
    console.error('Invalid index for editing custom field option');
  }
};






// const handleSubmitCustomEdit = () => {
//   // Ensure the indices are within the valid range
//   if (customEditIndex >= 0 && customEditIndex < customFields.length &&
//       optionIndex >= 0 && optionIndex < customFields[customEditIndex].options.length) {
//     // Create a new copy of the customFields array
//     const newCustomFields = [...customFields];

//     // Create a new copy of the specific option array
//     const newOptions = [...newCustomFields[customEditIndex].options];

//     // Update the specific option with new values
//     newOptions[optionIndex] = {
//       ...newOptions[optionIndex],
//       name: customOptionName,
//       videoUrl: customOptionVideo,
//       imageUrl: tempOptionImage
//     };

//     // Replace the options array in the specific custom field
//     newCustomFields[customEditIndex] = {
//       ...newCustomFields[customEditIndex],
//       options: newOptions
//     };

//     // Update the state with the new custom fields array
//     setCustomFields(newCustomFields);

//     // Optionally reset editing state
//     setCustomOptionName('');
//     setCustomOptionVideo('');
//     setTempOptionImage([]);
//     // Reset the editing indices if needed
//     setCustomEditIndex(null);
//     setOptionIndex(null);
//   } else {
//     console.error('Invalid custom field or option index');
//   }
// };

  return (
    <div className="content-area">
      <AreaTop title={`Edit Template - ${caseType}`}/>
    <div className="container consentForm p-5">
      <form className='row g-3' onSubmit={submitHandler}>

      <div className="modal fade" id="editFaqModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                          <h2 className="text-center" >Edit FAQ'S</h2>
                        </div>

                            <div className="modal-body">
                            <div className="col-md-12" id="faq">
    <label htmlFor="faqTitle" className="form-label">FAQ's Title</label>
    <input
      type="text"
      className="form-control"
      id="question_input"
      placeholder="Enter FAQ Title"
      name='faq_title'
      // required= {true}
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
      id="videoUrl2"
      placeholder="Enter Video Link"
      value={faqVideoUrl}
      onChange={(e) => setFaqVideoUrl(e.target.value)}
    />
  </div>
  <div className="col-md-12 my-3">
    <h2 className="text-center" >Faq Images</h2>
    {faqImages?.length > 0 ? (
                  faqImages?.map((image, idx) => (
                    // <div key={idx} className="img-wrapper">
                    <div  key={idx}  className=" mx-2 position-relative d-flex justify-content-start mx-2 ">
                      <img className="img-wrapper " src={image} alt={`FAQ ${idx} Image ${idx}`} style={{ width: '100px', height: '100px' }} />
                      <i  onClick={() => handleDeleteFaqImageEdit(idx)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
                      <div/>
                     </div>
                  ))
                ) : 'No images'}
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
                            </div>
                            <div className="modal-footer">
                                <button type="button"  data-bs-dismiss="modal" className="btn btn-secondary" >Exit</button>
                                <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={handleSubmitEdit} >Save changes</button>
                            </div>
                      
                    </div>
                </div>
</div>



{/* Custom Field Modal */}
<div className="modal fade" id="editCustomModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
  <div className="modal-dialog modal-fullscreen">
    <div className="modal-content">
      <div className="modal-header d-flex justify-content-center">
        <h2 className="text-center">Edit Custom Field's</h2>
      </div>

      <div className="modal-body">
       
  

  
   


   













      
          <div className="col-md-12" id="faq">

          <label htmlFor="faqTitle" className="form-label">Field Name</label>
          <input
            type="text"
            className="form-control"
            id="question_input"
            placeholder="Enter FAQ Title"
            name='faq_title'
            // required={true}
            value={customEditTitle}
            onChange={(e) => setCustomEditTitle(e.target.value)}
          />
        </div>

          <div className="table-responsive mt-5">
      <table  className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Video URL</th>
            <th scope="col">Images</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allOptions?.map((option, index) => (
            <tr key={index}>
              <td>{option?.name}</td>
              <td dangerouslySetInnerHTML={{ __html: option.description }} />
              <td>{option?.videoUrl}</td>
              <td>
                {option?.imageUrl.map((image, idx) => (
                  <img key={idx} src={image} alt={`Option ${index} Image ${idx}`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                ))}
              </td>
              <td className="d-flex  justify-content-between" >
              <i onClick={()=>{handleDeleteImage(index)}} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark  "></i>
              <i  onClick={()=>{handleEditOption(index)}}   role="button "  className="fa-solid bg-primary p-1 text-white fa-pen-to-square"></i>
                {/* <button className="btn btn-primary" onClick={() => onEdit(index)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(index)}>Delete</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div  className="">
            <div className="col-md-12" id="faqDescription">
              <h3 className="text-center">Options</h3>
              <div className="col-md-12">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter Option2 Name"
                  value={customOptionName}
                  onChange={(e) => setCustomOptionName(e.target.value)}
                />
              </div>
              <label htmlFor="faqDescription" className="form-label">Option Description</label>
              <QuillEditor
                ref={customQuill}
                theme="snow"
                value={tempOptionDescription}
                formats={formats}
                modules={modules}
                onChange={setTempOptionDescription}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="videoUrl2" className="form-label">Video Link</label>
              <input
                type="text"
                className="form-control"
                id="videoUrl2"
                placeholder="Enter Video Link"
                value={ customOptionVideo}
                onChange={(e) => setCustomOptionVideo(e.target.value)}
              />
            </div>
            <div className="col-md-12 my-3">
              <h2 className="text-center">Option Images</h2>
              {tempOptionImage?.length > 0 ? (
                tempOptionImage?.map((image, idx) => (
                  <div key={idx} className="mx-2 position-relative d-flex justify-content-start">
                    <img className="img-wrapper" src={image} alt={`FAQ ${idx} Image ${idx}`} style={{ width: '100px', height: '100px' }} />
                    <i onClick={() => handleDeleteCustomImageEdit(idx)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
                  </div>
                ))
              ) : 'No images'}
              <label className="btn bg-primary-color text-light w-100">
                Upload Image
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleCustomImageSelect}
                  multiple
                  accept=".jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>

        <div className="col-12 d-flex justify-content-center">
          {imageLoader && <Loader />}
        </div>
      </div>

      
      <div className="modal-footer">
        <button type="button" data-bs-dismiss="modal" className="btn btn-secondary">Exit</button>
        <button type="button" className="btn btn-main" data-bs-dismiss="modal" onClick={handleSubmitCustomEdit}>Save changes</button>
      </div>
    </div>
  </div>
</div>




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
            value={caseType}
            onChange={(e)=>{setCaseType(e.target.value)}}
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
            // required
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
              placeholder="Enter Question"
              required={questions?.length>=1?false:true}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              name='question_input'
            />
            <button style={{maxWidth: "100px"}} onClick={handleAddQuestion} type="button" className="btn btn-success w-100 ms-2">Add</button>
          </div>
        </div>

        {/* List questions */}
        <div className="col-md-12">
          <ul className="list-group mt-3">
            {questions?.map((question, index) => (
              <div key={index} className="">
                <span  className="form-label ">Question {index+1}</span>
              <li  className="list-group-item my-1 d-flex justify-content-between align-items-center">
                {question['text']?question['text']:question}
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

{/* faq started */}



<div>
  <h2 className="text-center">Edit FAQ'S</h2>
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
    <label htmlFor="fvideoUrl" className="form-label">Video Link</label>
    <input
      type="text"
      className="form-control"
      id="fvideoUrl"
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
                {faq?.imageUrl?.length > 0 ? (
                  faq?.imageUrl?.map((image, idx) => (
                    // <div key={idx} className="img-wrapper">
                    <div  key={idx}  className=" mx-2 position-relative d-flex justify-content-start mx-2 ">
                      <img className="img-wrapper " src={image} alt={`FAQ ${index} Image ${idx}`} style={{ width: '100px', height: '100px' }} />
                      <i  onClick={() => handleDeleteFaqImage(index, idx)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
                      <div/>
                     </div>
                  ))
                ) : 'No images'}
              </td>
              <td className="px-3 d-flex justify-content-between " >
              <i  onClick={() => handleDeleteFaq(index)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
              <i data-bs-toggle="modal" onClick={()=>{handleEditFaq(index)}} data-bs-target="#editFaqModal"   role="button "  className="fa-solid bg-primary p-1 text-white fa-pen-to-square position-absolute bottom-0 end-0"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>



<div className="">
<div>
  <h2 className="text-center">Create Custom Field's</h2>
  <div className="col-md-12" id="faq">
    <label htmlFor="faqTitle" className="form-label">Enter Field Name</label>
    <input
      type="text"
      className="form-control"
      id="key"
      placeholder="Enter Field Name"
      name='key'
      // required={true}
      value={key}
      onChange={(e) => setkey(e.target.value)}
    />
  </div>
  <div className="col-md-12 mt-3" id="faq">
    <h5>Create Options</h5>
    <label htmlFor="customOptions" className="form-label">Name </label>

    <div className="d-flex justify-content-between align-items-center">
    <input
      type="text"
      className="form-control w-100"
      id="customOptions"
      placeholder="Enter Options"
      name='key'
      // required={true}
      value={tempOption}
      onChange={(e) => setTempOption(e.target.value)}
    />

     {/* <button id="faq_btn" type="button" className="btn btn-success ms-3 my-3" onClick={addOption}>Add</button> */}
     </div> 


     



     <div className="col-md-12" id="faqDescription">
    <label htmlFor="faqDescription" className="form-label">{tempOption} Description</label>
    <QuillEditor
      ref={optionsQuill}
      theme="snow"
      value={tempOptionDescription}
      formats={formats}
      modules={modules}
      onChange={setTempOptionDescription}
    />
  </div>
  <div className="col-md-12">
    <label htmlFor="videoUrltemp" className="form-label">Video Link</label>
    <input
      type="text"
      className="form-control"
      id="videoUrltemp"
      placeholder="Enter Video Link"
      value={tempOptionVideo}
      onChange={(e) => setTempOptionVideo(e.target.value)}
    />
  </div>
  <div className="col-md-12 my-3">
    <label className="btn bg-primary-color text-light w-100 ">
      Upload Image
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleOptionsImageSelect}
        multiple
        accept=".jpg,.jpeg,.png"
      />
    </label>

  </div>
  <div className="col-md-12 d-flex justify-content-around mt-3">
    {imageLoader && <Loader/>}
  {tempOptionImage?.map((image, index) => (
    <div className="position-relative" style={{width:"200px", height:"150px"}}   key={index}  >
      <i onClick={()=>{handleDeleteOptionsImage(index)}} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark position-absolute top-0 end-0"></i>
    <img className='px-2 mx-2 img-fluid'style={{width:"200px", height:"150px"}} src={image} alt={`Uploaded file ${index + 1}`} />
    </div>
  ))}
</div>
<div className="col-md-12 my-3">
<button id="faq_btn" type="button" className="btn btn-success w-100 my-3" onClick={addThisOption}>Add This Options</button>
</div>
  </div>

  </div>

        <div className="col-12  ">
        <table border="1" className="table table-bordered" style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Serial No.</th>
                    <th>Field Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {customFields?.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.fieldName}</td>
                        <td className="d-flex position-relative justify-content-between">
                            <i  onClick={() => handleDeleteCustom(index)} role="button" className="fa-solid bg-danger text-white p-1 fa-xmark top-0 end-0"></i>
                            <i data-bs-toggle="modal" onClick={()=>{handleEditCustom(index)}} data-bs-target="#editCustomModal"   role="button "  className="fa-solid bg-primary p-1 text-white fa-pen-to-square  end-0"></i>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
</div>









        <div className="col-12">
          <button type="submit" className="btn btn-success w-100">Submit</button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default EditTemplate;
