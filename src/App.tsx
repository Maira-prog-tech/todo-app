// src/App.tsx
import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { Status, Task } from "./types";
import {
  FiPlus,
  FiTrash2,
  FiCheck,
  FiRotateCcw,
  FiMoreVertical,
} from "react-icons/fi";
import "react-dropdown/style.css";

const TABS: { key: Status; label: string }[] = [
  { key: "active", label: "To Do" },
  { key: "completed", label: "Done" },
  { key: "deleted", label: "Trash" },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<Status>("active");
  const [inputValue, setInputValue] = useState("");

  // drawer (sidebar) open?
  const [drawerOpen, setDrawerOpen] = useState(false);

  // все задачи, отфильтрованные по выбранной вкладке
  const visibleTasks = tasks.filter((t) => t.status === activeTab);

  const addTask = () => {
    const text = inputValue.trim();
    if (!text) return;
    setTasks([
      { id: Date.now(), text, status: "active" },
      ...tasks,
    ]);
    setInputValue("");
    setActiveTab("active");
    setDrawerOpen(false);
  };

  const changeStatus = (id: number, status: Status) =>
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    ));

  const removeTask = (id: number) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const handleInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Drawer wrapper из DaisyUI */}
      <div className="drawer drawer-mobile">
        {/* чекбокс-контроллер дровера */}
        <input
          id="todo-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={() => setDrawerOpen(!drawerOpen)}
        />
        <div className="drawer-content flex flex-col p-8">
          {/* Заголовок */}
          <h1 className="text-3xl font-bold mb-2">
            Simple To Do List
          </h1>
          <p className="mb-6 text-gray-600">
            Today is awesome day. The weather is awesome, you are awesome too!
          </p>

          {/* Табы */}
          <div className="tabs tabs-boxed mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab flex-1 ${
                  activeTab === tab.key
                    ? "tab-active"
                    : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Секция с заголовком списка */}
          <h2 className="text-xl font-semibold mb-2 capitalize">
            {TABS.find((t) => t.key === activeTab)?.label}
          </h2>
          <hr className="mb-4" />

          {/* Список задач */}
          <ul className="space-y-2 flex-1 overflow-auto pr-2">
            {visibleTasks.length === 0 && (
              <li className="text-white-100">
                Нет задач в этой категории
              </li>
            )}
            {visibleTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-base-100 p-3 rounded shadow-sm relative group"
              >
                <div className="flex items-center gap-3">
                  {/* drag handle (просто иконка) */}
                  <span className="cursor-move text-gray-400">
                    ⋮⋮
                  </span>
                  {/* чекбокс для completed */}
                  {activeTab !== "deleted" && (
                    <input
                      type="checkbox"
                      checked={task.status !== "active"}
                      className="checkbox checkbox-sm"
                      onChange={() =>
                        changeStatus(
                          task.id,
                          activeTab === "active"
                            ? "completed"
                            : "deleted"
                        )
                      }
                    />
                  )}
                  <span
                    className={`${
                      task.status !== "active"
                        ? "line-through text-gray-400"
                        : "text-gray-400"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>

                {/* контекстное меню на три точки (появляется при наведении) */}
                <div className="dropdown dropdown-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <label
                    tabIndex={0}
                    className="cursor-pointer p-2 rounded-full hover:bg-base-200"
                  >
                    <FiMoreVertical />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                  >
                    {activeTab === "active" && (
                      <>
                        <li>
                          <button
                            onClick={() =>
                              changeStatus(
                                task.id,
                                "completed"
                              )
                            }
                          >
                            <FiCheck className="mr-2" />
                            Done
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              changeStatus(
                                task.id,
                                "deleted"
                              )
                            }
                          >
                            <FiTrash2 className="mr-2" />
                            Move to Trash
                          </button>
                        </li>
                      </>
                    )}
                    {activeTab === "completed" && (
                      <li>
                        <button
                          onClick={() =>
                            changeStatus(
                              task.id,
                              "deleted"
                            )
                          }
                        >
                          <FiTrash2 className="mr-2" />
                          Trash
                        </button>
                      </li>
                    )}
                    {activeTab === "deleted" && (
                      <>
                        <li>
                          <button
                            onClick={() =>
                              changeStatus(
                                task.id,
                                "active"
                              )
                            }
                          >
                            <FiRotateCcw className="mr-2" />
                            Move Back to To Do
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              removeTask(task.id)
                            }
                          >
                            <FiTrash2 className="mr-2" />
                            Delete Forever
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          {/* плавающая кнопка “+” */}
          <label
            htmlFor="todo-drawer"
            className="fixed bottom-8 right-8 btn btn-circle btn-primary text-2xl shadow-lg"
          >
            <FiPlus />
          </label>
        </div>

        {/* Сайдбар (drawer-side) */}
        <div className="drawer-side">
          <label
            htmlFor="todo-drawer"
            className="drawer-overlay"
          ></label>
          <div className="w-80 bg-base-100 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Add New To Do
            </h3>
            <textarea
              className="textarea textarea-bordered w-full mb-4 h-32"
              placeholder="Your text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) =>
                e.key === "Enter" && addTask()
              }
            ></textarea>
            <button
              className="btn btn-primary w-full"
              onClick={addTask}
              disabled={!inputValue.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;



