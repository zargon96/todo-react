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
        <Col md={6}>
          <h1 className="mb-4" style={{ fontSize: "4rem" }}>
            Todo
          </h1>
        </Col>
        <Col md={6}>
          <Button
            className="mt-2"
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
        <Col md={12}>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Aggiungi o modifica un task"
              value={inputTask}
              onChange={(e) => setInputTask(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={handleAddOrEdit}
              disabled={isDisabled}
            >
              {editIndex !== null ? "Salva" : "Aggiungi"}
            </Button>
          </InputGroup>
          <div className="text-end mb-3">
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
