import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Todo() {
  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Get todos for logged-in user
  const fetchTodos = async () => {
    try {
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(`https://todo-list-mern-1-pu0w.onrender.com/api/todos/${userId}`);

      const data = await response.json();

      if (response.ok) {
        setTodos(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (task.trim() === "") {
      alert("Please enter a task");
      return;
    }

    try {
      const response = await fetch("https://todo-list-mern-1-pu0w.onrender.com/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodos([data, ...todos]);
        setTask("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Cannot connect to server");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`https://todo-list-mern-1-pu0w.onrender.com/api/todos/${id}`, {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle completed
  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`https://todo-list-mern-1-pu0w.onrender.com/api/todos/${todo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTodos(
          todos.map((item) =>
            item._id === todo._id ? data : item
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <div className="todo-container">
      <div className="todo-box">

        <div className="todo-header">
          <div>
            <h1>My Todo List</h1>

            {userName && (
              <p>Welcome, {userName}!</p>
            )}
          </div>

          <button onClick={logout}>Logout</button>
        </div>

        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />

          <button onClick={addTodo}>Add</button>
        </div>

        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>

              <span
                onClick={() => toggleTodo(todo)}
                className={todo.completed ? "completed" : ""}
              >
                {todo.text}
              </span>

              <button onClick={() => deleteTodo(todo._id)}>
                Delete
              </button>

            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty">No tasks yet.</p>
        )}

      </div>
    </div>
  );
}

export default Todo;