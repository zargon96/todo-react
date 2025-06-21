import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({
  inputTask,
  setInputTask,
  handleAddOrEdit,
  editIndex,
  darkMode,
  setDarkMode,
  tasks,
  handleToggleAll,
  allSelected,
}) {
  const isDisabled = inputTask.trim() === "";

  return (
    <Container>
      <Row className="justify-content-center text-center">
        <Col md={6} xs={6}>
          <h1 className="mb-4 title-todo" style={{ fontSize: "4rem" }}>
            Todo
          </h1>
        </Col>
        <Col md={6} xs={6}>
          <Button
            className="mt-2 icon-theme"
            variant="link"
            onClick={() => setDarkMode((prev) => !prev)}
            style={{
              fontSize: "2rem",
              color: darkMode ? "#fff" : "#000",
            }}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>
        </Col>
        <InputGroup>
          <Col md={12}>
            <Row className="d-flex flex-column align-items-center gap-2 mb-4">
              <Col md={6} lg={12}>
                <FormControl
                  placeholder="Aggiungi un task"
                  value={inputTask}
                  onChange={(e) => setInputTask(e.target.value)}
                  className="w-100 w-md-75"
                />
              </Col>
              <Col md={6} lg={12}>
                <Button
                  variant="secondary"
                  onClick={handleAddOrEdit}
                  className="w-100 w-md-75"
                  disabled={isDisabled}
                >
                  {editIndex !== null ? "Salva" : "Aggiungi"}
                </Button>
              </Col>
            </Row>
          </Col>
        </InputGroup>

        <Col md={12}>
          <div className="text-end mt-3 slection-tasks-btn">
            {tasks.length > 0 && (
              <Button
                variant="secondary"
                className="mb-3"
                onClick={handleToggleAll}
              >
                {allSelected ? "Deseleziona tutto" : "Seleziona tutto"}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
