import React, { useEffect, useRef, useState } from "react";
import Particles from "./Particles";

const App = () => {
  const [val, setVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const editInputRef = useRef(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const lastOpenedDate = localStorage.getItem("lastOpenedDate");
    const today = new Date().toDateString();
  
    if (lastOpenedDate !== today) {
      const resetTodos = savedTodos.map((todo) => ({ ...todo, done: false }));
      setTodos(resetTodos);
      localStorage.setItem("todos", JSON.stringify(resetTodos));
      localStorage.setItem("lastOpenedDate", today);
    } else {
      setTodos(savedTodos);
    }
  }, []);
  

  const handleAddTodo = (input) => {
    if (input.trim()) {
      const updatedTodos = [...todos, { input, done: false }];
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      localStorage.setItem("lastOpenedDate", new Date().toDateString());
      setVal("");
    }
  };

  const handleTaskDone = (index) => {
    const updatedTodos = todos.map((todo, idx) => {
      if (idx == index) {
        return { ...todo, done: !todo.done };
      }
      return todo;
    });
    updatedTodos.sort((a, b) => {
      return a.done === b.done ? 0 : a.done ? 1 : -1;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (index) => {
    const updatedTodo = todos.filter((todo, idx) => idx != index);
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
  };

  const handleSaveEdit = (idx) => {
    const updatedTodo = [...todos];
    updatedTodo[idx].input = editText;
    setTodos(updatedTodo);
    localStorage.setItem("todos", JSON.stringify(updatedTodo));
    setEditModeIndex(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.done;
    if (filter === "completed") return todo.done;
    return true;
  });

  return (
    <div className="bg-black h-screen overflow-hidden relative">
      <Particles
        particleColors={["#ffffff", "#ffffff", "#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="bg-white/7 max-w-xl w-7xl text-center rounded-xl backdrop-blur-xl p-8 shadow-lg pointer-events-auto">
          <h1 className="text-3xl font-mono uppercase mb-4 text-white">
            ADD YOUR TO-DO!!
          </h1>
          <div className="mt-6 mb-6 flex justify-between gap-4">
            <input
              type="text"
              value={val}
              className="p-4 w-full rounded-xl bg-white font-mono tracking-wider uppercase"
              placeholder="> Complete the latest project"
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTodo(val);
                }
              }}
            />
            <button
              onClick={() => handleAddTodo(val)}
              className="cursor-pointer bg-white w-[10rem] rounded-xl text-center font-mono text-[20px]"
            >
              ADD TO-DO
            </button>
          </div>

          <div className="flex justify-center">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 backdrop-blur-md text-white p-4 rounded-xl font-mono uppercase tracking-wider cursor-pointer transition duration-300 ease-in-out hover:bg-white/20"
            >
              <option value="all" className="bg-black text-white">
                All
              </option>
              <option value="active" className="bg-black text-white">
                Active
              </option>
              <option value="completed" className="bg-black text-white">
                Completed
              </option>
            </select>
          </div>

          <div className="flex justify-center gap-3 mb-4"></div>
          <div className="max-h-[300px] overflow-y-auto ">
            <ul className="text-white space-y-2 overflow-hidden">
              {filteredTodos.map((item, idx) => (
                <li
                  className="flex justify-between items-center bg-white/10 p-3 rounded-lg font-mono uppercase tracking-wider transition-all duration-500 ease-in-out hover:scale-105 "
                  key={idx}
                >
                  {editModeIndex === idx ? (
                    <input
                      ref={editInputRef}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="bg-white text-black p-2 rounded-lg pl-5 font-mono uppercase"
                      type="text"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleTaskDone(idx)}
                        className="w-5 h-5"
                      />
                      <span
                        className={`${
                          item.done ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {item.input}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDeleteTodo(idx)}
                      className="cursor-pointer hover:text-red-500 transition"
                    >
                      🗑️
                    </button>
                    {editModeIndex === idx ? (
                      <button
                        onClick={() => handleSaveEdit(idx)}
                        className="cursor-pointer hover:text-yellow-500 transition"
                      >
                        ✅
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditModeIndex(idx);
                          setEditText(item.input);
                          setTimeout(() => {
                            editInputRef.current?.focus();
                          }, 100);
                        }}
                        className="cursor-pointer hover:text-yellow-500 transition"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
