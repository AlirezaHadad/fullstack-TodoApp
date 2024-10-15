import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  lastName: String,
  todos: [{ title: String, description : String ,status: String }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

const UserTodo = models.UserTodo || model("UserTodo", userSchema);

export default UserTodo;
