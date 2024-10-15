import { useState } from "react";
import RadioButton from "../../components/element/RadioButton";
import { GrAddCircle } from "react-icons/gr";
import { BsAlignStart } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

function EditTodo() {
  const [title, setTitle] = useState("");
  const [description , setDescription] = useState("")
  const [status, setStatus] = useState("todo");
  
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  
  const updateTodo = async () => {
    const response = await fetch('/api/todos', {
        method: 'PUT',
        body: JSON.stringify({ id, title, description, status }),
        headers: {'Content-Type': 'application/json'}
    });

    const data = await response.json();
    if(data.status === "success") router.push("/")
};


  return (
    <div className="add-form">
      <h2>
        <GrAddCircle />
        Add New Todo
      </h2>
      <div className="add-form__input">
        <div className="add-form__input--first">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="add-form__input--first">
            <label htmlFor="title">description : </label>
            <input
              id="description"
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="add-form__input--second">
          <RadioButton
            status={status}
            setStatus={setStatus}
            value="todo"
            title="Todo"
          >
            <BsAlignStart />
          </RadioButton>
          <RadioButton
            status={status}
            setStatus={setStatus}
            value="inProgress"
            title="In Progress"
          >
            <FiSettings />
          </RadioButton>
          <RadioButton
            status={status}
            setStatus={setStatus}
            value="review"
            title="Review"
          >
            <AiOutlineFileSearch />
          </RadioButton>
          <RadioButton
            status={status}
            setStatus={setStatus}
            value="done"
            title="Done"
          >
            <MdDoneAll />
          </RadioButton>
        </div>
        <button onClick={updateTodo}>edit</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditTodo;
