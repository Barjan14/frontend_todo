import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";


const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";


const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => (props.darkMode ? "#333" : "#f0f8ff")};
    color: ${(props) => (props.darkMode ? "#f5f5f5" : "#333")};
    font-family: Arial, sans-serif;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
  }
`;

// Styled components for layout and task items
const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => (props.darkMode ? "#333" : "#f0f8ff")};
`;

const DashboardWrapper = styled.div`
  background-color: ${(props) => (props.darkMode ? "#444" : "#fff")};
  box-shadow: ${(props) => (props.darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)")};
  border-radius: 10px;
  padding: 30px;
  width: 400px;
  transition: all 0.3s ease;
`;

const TaskInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TaskInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${(props) => (props.darkMode ? "#555" : "#f5f5f5")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) => (props.darkMode ? "#444" : "#4CAF50")};
  color: ${(props) => (props.darkMode ? "#fff" : "#fff")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#555" : "#45a049")};
  }
`;

const FilterButton = styled.button`
  background-color: ${(props) => (props.darkMode ? "#444" : "#ddd")};
  color: ${(props) => (props.darkMode ? "#f5f5f5" : "#333")};
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#555" : "#ccc")};
  }
`;

const TaskCount = styled.p`
  color: ${(props) => (props.darkMode ? "#ddd" : "#555")};
  font-size: 14px;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.completed ? "#d4edda" : "#f8d7da")};
  border-radius: 5px;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
`;

const TaskText = styled.span`
  cursor: pointer;
  color: ${(props) => (props.completed ? "#6c757d" : "#333")};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;

  &:hover {
    color: #bd2130;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.darkMode ? "#444" : "#ddd")};
  color: ${(props) => (props.darkMode ? "#f5f5f5" : "#333")};
  padding: 10px;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#555" : "#ccc")};
  }
`;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");
  const [editId, setEditId] = useState(null); // Added to track which task is being edited
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

   // Fetch To-Do items
   const fetchTodos = () => {
    axios.get(`${apiUrl}/todos/`)  // Use environment variable for API URL
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the To-Do items!", error);
      });
  };

  // Add a new To-Do
  const addTodo = () => {
    if (newTodo.trim() === "") return;
    const todoData = { title: newTodo, completed: false };
    axios.post(`${apiUrl}/todos/`, todoData)  // Use environment variable for API URL
      .then(response => {
        fetchTodos(); // Refresh the task list after adding a new task
        setNewTodo("");  // Clear the input field
      })
      .catch(error => {
        console.error("There was an error adding the To-Do!", error);
      });
  };

  // Edit Task
  const editTask = () => {
    if (editTodo.trim() === "") return;

    const updatedTodo = {
      title: editTodo,
      completed: todos.find(todo => todo.id === editId)?.completed, // Keep current completion status
    };

    axios.put(`${apiUrl}/todos/${editId}/`, updatedTodo)  // Use environment variable for API URL
      .then(response => {
        fetchTodos(); // Refresh the task list after editing
        setEditTodo("");  // Reset the edit input field
        setEditId(null);   // Reset the editId so the form is not in edit mode
      })
      .catch(error => {
        console.error("There was an error updating the task!", error);
      });
  };

  // Toggle Task Completion (Update completion status)
  const toggleTaskCompletion = (id, currentStatus) => {
    const updatedStatus = !currentStatus;

    axios.patch(`${apiUrl}/todos/${id}/`, { completed: updatedStatus })  // Use environment variable for API URL
      .then(() => {
        fetchTodos();  // Refresh the task list after toggling completion
      })
      .catch((error) => {
        console.error("There was an error toggling task completion!", error);
      });
  };

  // Remove Task (Delete task)
  const removeTask = (id) => {
    axios.delete(`${apiUrl}/todos/${id}/`)  // Use environment variable for API URL
      .then(() => {
        fetchTodos();  // Refresh the task list after deletion
      })
      .catch((error) => {
        console.error("There was an error deleting the task!", error);
      });
  };

  // Fetch the tasks when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Filter To-Do items based on completion status
  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true; // Show all tasks
  });

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      {/* Dark Mode Toggle */}
      <ToggleButton darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light" : "Dark"} Mode
      </ToggleButton>

      <DashboardContainer darkMode={darkMode}>
        <DashboardWrapper darkMode={darkMode}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: darkMode ? "#fff" : "#333" }}>
            📌 Add New Task
          </h2>

          {/* Add Task Section */}
          <TaskInputWrapper>
            <TaskInput
              darkMode={darkMode}
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <AddButton darkMode={darkMode} onClick={addTodo}>
              Add
            </AddButton>
          </TaskInputWrapper>

          {/* Filter Buttons */}
          <div>
            <FilterButton darkMode={darkMode} onClick={() => setFilter("all")}>All</FilterButton>
            <FilterButton darkMode={darkMode} onClick={() => setFilter("completed")}>Completed</FilterButton>
            <FilterButton darkMode={darkMode} onClick={() => setFilter("pending")}>Pending</FilterButton>
          </div>

          <TaskCount darkMode={darkMode}>
            Pending Tasks: {filteredTodos.filter((t) => !t.completed).length}
          </TaskCount>

          <TaskList>
            {filteredTodos.length === 0 ? (
              <p style={{ color: darkMode ? "#ddd" : "#aaa", textAlign: "center" }}>
                No tasks added yet.
              </p>
            ) : (
              filteredTodos.map((todo) => (
                <TaskItem key={todo.id} completed={todo.completed}>
                  {editId === todo.id ? (
                    <>
                      <TaskInput
                        darkMode={darkMode}
                        type="text"
                        value={editTodo}
                        onChange={(e) => setEditTodo(e.target.value)}
                      />
                      <AddButton darkMode={darkMode} onClick={editTask}>
                        Save
                      </AddButton>
                    </>
                  ) : (
                    <>
                      <TaskText onClick={() => toggleTaskCompletion(todo.id, todo.completed)} completed={todo.completed}>
                        {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
                      </TaskText>
                      <div>
                        <EditButton onClick={() => { setEditTodo(todo.title); setEditId(todo.id); }}>
                          ✏️
                        </EditButton>
                        <RemoveButton onClick={() => removeTask(todo.id)}>❌</RemoveButton>
                      </div>
                    </>
                  )}
                </TaskItem>
              ))
            )}
          </TaskList>
        </DashboardWrapper>
      </DashboardContainer>
    </>
  );
}

export default App;
