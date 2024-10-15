import connectDB from "../../utils/connectDB";
import { getSession } from "next-auth/react";
import UserTodo from "../../models/User";
import { sortTodos } from "../../utils/sortTodos";

async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Error in connecting to DB" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res
      .status(401)
      .json({ status: "failed", message: "You are not logged in!" });
  }

  const user = await UserTodo.findOne({ email: session.user.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "User doesn't exsit!" });
  }

  if (req.method === "POST") {
    const { title, status , description } = req.body;

    if (!title || !status || !description) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invaild data!" });
    }

    user.todos.push({ title, status, description });
    user.save();

    res.status(201).json({ status: "success", message: "Todo created!" });
  } else if (req.method === "GET") {
    const sortedData = sortTodos(user.todos);

    res.status(200).json({ status: "success", data: { todos: sortedData } });
  } else if (req.method === "PATCH") {
    const { id, status } = req.body;

    if (!id || !status) {
      return res
        .status(422)
        .json({ status: "failed", message: "Invalid data!" });
    }

    const result = await UserTodo.updateOne(
      { "todos._id": id },
      { $set: { "todos.$.status": status } }
    );
    console.log(result);
    res.status(200).json({ status: "success" });
    
  }else if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
        return res.status(422).json({ status: "failed", message: "Invalid data!" });
    }

    const user = await UserTodo.findOne({ "todos._id": id });

    if (!user) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    user.todos = user.todos.filter(todo => todo._id.toString() !== id);
    user.save();

    return res.status(200).json({
        status: "success",
        message: 'Todo deleted successfully'
    });
  }else if(req.method === "PUT"){
    const { id , title , description,status } = req.body;

    if (!id || !title || !description || !status) {
      return res.status(422).json({ status: "failed", message: "Invalid data!" });
    }

    const user = await UserTodo.findOne({ "todos._id": id });

    if (!user) {
        return res.status(404).json({ message: 'user not found' });
    }

    const todo = user.todos.id(id);

    console.log(todo);
    if (!todo) {
      return res.status(404).json({ message: 'todo not found' });
    }

    todo.title = title;
    todo.description = description;
    todo.status = status;
    user.save();
    
    res.status(200).json({
      status: "success",
      message: 'Todo updated successfully',
      todo
  });
  }
}

export default handler;
