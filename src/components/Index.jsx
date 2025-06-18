import { Container, Row, Col, Button, ListGroup, Alert } from "react-bootstrap";
import Checkbox from "./Checkbox";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import { useState, useEffect, useMemo, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { RxDragHandleDots2 } from "react-icons/rx";

export default function Index() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [allSelected, setAllSelected] = useState(false);
  const [editId, setEditId] = useState(null);
  const [inputTask, setInputTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [alert, setAlert] = useState({
    show: false,
    type: null,
    id: null,
    message: "",
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (tasks.length === 0) {
      setAllSelected(false);
      return;
    }

    const allCompleted = tasks.every((t) => t.completed);
    setAllSelected(allCompleted);
  }, [tasks]);

  const handleDelete = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      setAlert({
        show: true,
        type: "delete",
        id,
        message: `Vuoi davvero eliminare questo task? "${task.text}"`,
      });
    },
    [tasks]
  );

  const handleEdit = useCallback((task) => {
    setInputTask(task.text);
    setEditId(task.id);
    setAlert({
      show: true,
      type: "edit",
      id: task.id,
      message: `Vuoi modificare questo task? "${task.text}"`,
    });
  }, []);

  const handleAddOrEdit = useCallback(() => {
    const txt = inputTask.trim();
    if (!txt) return;

    setTasks((prev) => {
      if (editId !== null) {
        return prev.map((t) => (t.id === editId ? { ...t, text: txt } : t));
      }
      return [...prev, { id: Date.now(), text: txt, completed: false }];
    });

    setInputTask("");
    setEditId(null);
  }, [inputTask, editId]);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) =>
      filter === "active"
        ? !t.completed
        : filter === "completed"
        ? t.completed
        : true
    );
  }, [tasks, filter]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    setTasks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(result.source.index, 1);
      updated.splice(result.destination.index, 0, moved);
      return updated;
    });
  }, []);

  const handleAlertCancel = () => {
    setAlert({ show: false, type: null, id: null, message: "" });
    setInputTask("");
    setEditId(null);
  };

  const handleAlertConfirm = () => {
    if (alert.type === "delete") {
      setTasks((prev) => prev.filter((t) => t.id !== alert.id));
    }

    if (alert.type === "edit") {
      const txt = inputTask.trim();
      if (!txt) return;
      setTasks((prev) =>
        prev.map((t) => (t.id === alert.id ? { ...t, text: txt } : t))
      );
      setInputTask("");
      setEditId(null);
    }

    setAlert({ show: false, type: null, id: null, message: "" });
  };

  const handleToggleAll = () => {
    const newState = !allSelected;
    setTasks((prev) => prev.map((t) => ({ ...t, completed: newState })));
    setAllSelected(newState);
  };

  return (
    <div className="app-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="todo-card p-4">
              <Header
                inputTask={inputTask}
                setInputTask={setInputTask}
                handleAddOrEdit={handleAddOrEdit}
                editIndex={editId !== null}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                tasks={tasks}
                handleToggleAll={handleToggleAll}
                allSelected={allSelected}
              />

              {alert.show && (
                <Alert
                  variant="secondary"
                  dismissible
                  onClose={handleAlertCancel}
                  className="custom-alert"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {alert.message}
                    </div>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={handleAlertCancel}
                      >
                        Annulla
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleAlertConfirm}
                      >
                        Conferma
                      </Button>
                    </div>
                  </div>
                </Alert>
              )}

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="todo-list">
                  {(provided) => (
                    <ListGroup
                      className="mb-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {filteredTasks.length === 0 ? (
                        <ListGroup.Item
                          style={{ color: darkMode ? "#fff" : "#000" }}
                        >
                          Nessun task
                        </ListGroup.Item>
                      ) : (
                        filteredTasks.map((task, idx) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={idx}
                          >
                            {(prov, snap) => (
                              <ListGroup.Item
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                className={`d-flex justify-content-between align-items-center ${
                                  snap.isDragging ? "dragging-item" : ""
                                }`}
                              >
                                <div className="d-flex align-items-center flex-grow-1">
                                  <span
                                    {...prov.dragHandleProps}
                                    className="me-2 drag-icon"
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                    }}
                                  >
                                    <RxDragHandleDots2 />
                                  </span>
                                  <Checkbox
                                    id={task.id}
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)}
                                  />
                                  <span
                                    className="task-text"
                                    style={{
                                      color: darkMode ? "#fff" : "#000",
                                      textDecoration: task.completed
                                        ? "line-through"
                                        : "none",
                                    }}
                                  >
                                    {task.text}
                                  </span>
                                </div>
                                <div className="ms-2 d-flex">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(task)}
                                  >
                                    Modifica
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    Elimina
                                  </Button>
                                </div>
                              </ListGroup.Item>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </ListGroup>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="d-flex justify-content-around align-items-center mt-4">
                <div>
                  {tasks.filter((t) => !t.completed).length} task rimasti
                </div>
                <div className="width-100-mobile">
                  {[
                    ["all", "Tutti"],
                    ["active", "Attive"],
                    ["completed", "Completate"],
                  ].map(([key, label]) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={filter === key ? "secondary" : "light"}
                      onClick={() => setFilter(key)}
                      className="me-1"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() =>
                    setTasks((prev) => prev.filter((t) => !t.completed))
                  }
                >
                  Elimina Completati
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
