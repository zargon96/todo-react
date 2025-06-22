import { Container, Row, Col, Button, ListGroup, Alert } from "react-bootstrap";
import Checkbox from "./Checkbox";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useAppContext } from "../context/AppContext";

export default function Index() {
  const { tasks, setTasks, darkMode } = useAppContext();
  const [allSelected, setAllSelected] = useState(false);
  const [editId, setEditId] = useState(null);
  const [inputTask, setInputTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({
    show: false,
    type: null,
    id: null,
    message: "",
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (editId !== null && inputRef.current) inputRef.current.focus();
  }, [editId]);

  useEffect(() => {
    setAllSelected(tasks.length > 0 && tasks.every((t) => t.completed));
  }, [tasks]);

  const isDuplicate = useCallback(
    (txt, excludeId = null) =>
      tasks.some(
        (t) => t.text.toLowerCase() === txt.toLowerCase() && t.id !== excludeId
      ),
    [tasks]
  );

  const handleDelete = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      setAlert({
        show: true,
        type: "delete",
        id,
        message: `Vuoi davvero eliminare questo task?\n\n"${task.text}"`,
      });
    },
    [tasks]
  );

  const handleEdit = useCallback((task) => {
    setInputTask(task.text);
    setEditId(task.id);
  }, []);

  const closeEdit = useCallback(() => {
    setEditId(null);
    setInputTask("");
    setAlert({ show: false, type: null, id: null, message: "" });
  }, []);

  const saveTask = useCallback(() => {
    const txt = inputTask.trim();
    if (!txt) return;

    if (isDuplicate(txt, editId)) {
      setAlert({
        show: true,
        type: "duplicate",
        id: null,
        message: `Il task "${txt}" esiste già.`,
      });
      return;
    }

    setTasks((prev) => {
      if (editId !== null) {
        return prev.map((t) => (t.id === editId ? { ...t, text: txt } : t));
      }
      return [...prev, { id: Date.now(), text: txt, completed: false }];
    });

    closeEdit();
  }, [inputTask, editId, isDuplicate, setTasks, closeEdit]);

  const toggleComplete = useCallback(
    (id) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      ),
    [setTasks]
  );

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((t) => !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      setTasks((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        return updated;
      });
    },
    [setTasks]
  );

  const handleAlertCancel = () => {
    setAlert({ show: false, type: null, id: null, message: "" });
    setInputTask("");
  };

  const handleAlertConfirm = () => {
    if (alert.type === "delete") {
      setTasks((prev) => prev.filter((t) => t.id !== alert.id));
      if (editId === alert.id) closeEdit();
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
              <div
                className={editId !== null || alert.show ? "blur-overlay" : ""}
              >
                <Header
                  inputTask={inputTask}
                  setInputTask={setInputTask}
                  handleAddOrEdit={saveTask}
                  editIndex={editId !== null}
                  handleToggleAll={handleToggleAll}
                  allSelected={allSelected}
                  inputRef={inputRef}
                />

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="todo-list">
                    {(provided) => (
                      <ListGroup
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mb-3"
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
                                  <div className="ms-2 d-flex btn-delete-edit">
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

                <div className="d-flex justify-content-around align-items-center mt-4 container">
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
                    variant="danger"
                    onClick={() =>
                      setTasks((prev) => prev.filter((t) => !t.completed))
                    }
                  >
                    Elimina Completati
                  </Button>
                </div>
              </div>

              {(editId !== null || alert.show) && (
                <div className="edit-mode-box">
                  {editId !== null && (
                    <>
                      <h5 className="mb-3">Modifica task</h5>
                      <input
                        ref={inputRef}
                        value={inputTask}
                        onChange={(e) => setInputTask(e.target.value)}
                        className="form-control mb-3"
                        placeholder="Modifica il task"
                      />
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={saveTask}>
                          Salva
                        </Button>
                        <Button variant="danger" onClick={closeEdit}>
                          Annulla
                        </Button>
                      </div>
                    </>
                  )}

                  {alert.show && (
                    <>
                      <Alert
                        variant={
                          alert.type === "duplicate" ? "danger" : "secondary"
                        }
                        className="mt-4"
                        dismissible
                        onClose={handleAlertCancel}
                      >
                        {alert.message}
                      </Alert>
                      {alert.type === "delete" && (
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="danger" onClick={handleAlertConfirm}>
                            Elimina
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={handleAlertCancel}
                          >
                            Annulla
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
