import React, { useCallback, useRef, useState } from "react";
import QuillEditor from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './CreateTemplate.scss';
import { postApi } from "../../helpers/requestHelpers";
import { Toast } from "../../components/alert/Alert";
import { useNavigate } from "react-router-dom";
import { AreaTop } from "../../components";

const CreateTemplate = () => {
  const [value, setValue] = useState("");
  const quill = useRef();
const navigate=useNavigate();
  const submitHandler = async(event) => {
    event.preventDefault(); // Prevent the default form submission behavior
console.log("hello")
    // Accessing the Quill editor instance and its contents in Delta format
    const editor = quill.current.getEditor();
    const deltaContent = editor.getContents();
    
    const formData = {
      caseType: document.getElementById("Ctype").value,
      questions: questions.map(question => ({ text: question })),
      // html: quill.current.getEditor().root.innerHTML, // Get HTML content from Quill editor
      html: "hi",
      createdBy: "2312314343413",
      deltaForm:deltaContent,
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
 navigate('/das')
  }
  else{
   Toast.fire({
     icon: "error",
     title: `${res?.response?.data?.errors?.[0]?.msg ? res.response.data.errors[0].msg : res?.response?.data?.message}`
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
    "indent", "link", "image", "color", "clean"
  ];

  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");

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

  

  return (
    <div className="content-area">
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
            Editor Content
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
            <button style={{maxWidth: "100px"}} onClick={handleAddQuestion} type="button" className="btn btn-success w-100 ms-2">Add</button>
          </div>
        </div>

        {/* List questions */}
        <div className="col-md-12">
          <ul className="list-group mt-3">
            {questions.map((question, index) => (
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

        <div className="col-12">
          <button type="submit" className="btn btn-success w-100">Submit</button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default CreateTemplate;
