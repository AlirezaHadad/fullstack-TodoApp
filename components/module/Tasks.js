import { RiMastodonLine } from "react-icons/ri";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import { useState } from "react";
import { useRouter } from "next/router";

function Tasks({ data, next, back, fetchTodos }) {  

  const router = useRouter()

  const changeStatus = async (id, status) => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "success") fetchTodos();
  };

  const deleteHandler = async (id) =>{
    const res = await fetch("/api/todos",{
      method : "DELETE",
      body : JSON.stringify({id}),
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json();
    console.log(data);
    if (data.status === "success") fetchTodos();
  }

  const editHandler = (id) => {
    router.push(`/editTodo/${id}`)
  }

  return (
    <div className="tasks">
      {data?.map((i) => (
        <div key={i._id} className="tasks__card">
          <span className={i.status}></span>
          <div className="title">
            <RiMastodonLine />
            <h4>{i.title}</h4>
          </div>
          <h4 className="description">{i.description}</h4>
          <div className="buttons">
            {back ? (
              <button
                className="button-back"
                onClick={() => changeStatus(i._id, back)}
              >
                <BiLeftArrow />
                Back
              </button>
            ) : null}
            {next ? (
              <button
                className="button-next"
                onClick={() => changeStatus(i._id, next)}
              >
                Next
                <BiRightArrow />
              </button>
            ) : null}
          </div>
          <div className="buttons">
              <button
                className="button-back"
                onClick={() => deleteHandler(i._id)}
              >
                <BiLeftArrow />
                delete
              </button>
              <button
                className="button-next"
                onClick={()=>editHandler(i._id)}
              >
                edit
                <BiRightArrow />
              </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
