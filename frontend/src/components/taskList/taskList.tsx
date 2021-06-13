import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import "./taskList.css";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  withStyles,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TableRowComponent from "./taskListRow";
import TaskService from "../../services/TaskService";

const TableCell = withStyles((theme) => ({
  root: {
    height: 10,
    padding: 3,
    borderColor: "#C8C8C8",
    borderTop: "1px",
  },
}))(MuiTableCell);

function createData(
  color: string,
  name: string,
  person: string,
  status: string
) {
  return { name, person, status };
}

const rows = [
  createData("red", "Zakupy", "Tomek", "W trakcie"),
  createData("red", "Pranie", "Oliwia", "Wykonano"),
  createData(
    "red",
    "Wysłanie pocztówek na święta robie długiego stringa szalom",
    "Karolek <3",
    "Do zrobienia"
  ),
  createData("red", "Wypełnienie spisu ludności", "Marysia", "Wstrzymano"),
];

export default function BasicTable(props: { selectedDay: string }) {
  const [state, setState] = React.useState({
    inProgressColor: {
      backgroundColor: "#FFEF62",
      fontWeight: "bold" as "bold",
      width: "100%",
      color: "black",
    },
    doneColor: {
      backgroundColor: "#33EB91",
      fontWeight: "bold" as "bold",
      width: "100%",
      color: "black",
    },
    toDoColor: {
      backgroundColor: "#CFCFCF",
      fontWeight: "bold" as "bold",
      width: "100%",
      color: "black",
    },
    pausedColor: {
      backgroundColor: "#F1503A",
      fontWeight: "bold" as "bold",
      width: "100%",
      color: "black",
    },
    editing: false,
    newTask: "",
    rows: rows,
  });

  const [open, setOpen] = React.useState(false);

  const [newTask, setNewTask] = React.useState({
    title: "",
    date: "2021-06-14", //TODO jak ustawić date Łukasz?
    groupId: "60c4c2d0f60a5623b2cf253c", //TODO tu muszisz przekazać id grupy tego komponentu
    assignee: "",
    description: "",
  });

  const handleAdding = (event: React.MouseEvent<HTMLElement>) => {
    setState({ ...state, editing: true });
  };

  const handleAddButton = (event: React.MouseEvent<HTMLElement>) => {
    state.rows.push(
      createData("red", state.newTask, "undefiend", "Do zrobienia")
    );
    setState({ ...state, editing: false });

    const newTaskData = {
      title: newTask.title,
      date: newTask.date,
      group: newTask.groupId,
      description: newTask.description,
    };
    TaskService.addTask(newTaskData).then((response) => {
      console.log(response);
    });
    window.location.reload();
    //TODO nie wiem czy tu powinien być refresz
    // czy inny sposób żeby załadować nowy task,
    // jeżeli inny to trzeba jeszcze wyczyścić stan "newTask"
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, newTask: event.target.value });
  };

  const handleNewTaskChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTask({ ...newTask, [prop]: event.target.value });
    };

  return (
    <TableContainer className="table-main">
      <p
        style={{
          textAlign: "left",
          color: "#f1503a",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Rodzina
      </p>
      <Table className="table" aria-label="simple table">
        <TableHead>
          <TableRow
            style={{
              height: "auto !important",
              borderTop: "10px",
              borderColor: "yellow",
            }}
          >
            {/* cell z kolorkiem */}
            <TableCell className="color-rec-head"></TableCell>
            <TableCell></TableCell>
            <TableCell className="head-text" align="center">
              Osoba
            </TableCell>
            <TableCell className="head-text" align="center">
              Status
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {state.rows.map((row) => {
            let style;
            if (row.status === "W trakcie") {
              style = state.inProgressColor;
            } else if (row.status === "Wykonano") {
              style = state.doneColor;
            } else if (row.status === "Do zrobienia") {
              style = state.toDoColor;
            } else {
              style = state.pausedColor;
            }

            return (
              <TableRowComponent
                key={row.name}
                {...row}
                style={style}
              ></TableRowComponent>
            );
          })}

          <TableRow className="row">
            <TableCell id={"color"} className="color-rec">
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>

            <TableCell
              id="addCell"
              onClick={handleAdding}
              className="add-row-text"
            >
              {state.editing ? (
                <TextField
                  className="new-task-input"
                  id="standard-basic"
                  placeholder="Dodaj zadanie"
                  value={newTask.title}
                  onChange={handleNewTaskChange("title")}
                />
              ) : (
                <div style={{ color: "#979797" }}>+ Dodaj</div>
              )}
            </TableCell>

            <TableCell style={{ backgroundColor: "#EDEDED" }}></TableCell>
            <TableCell className="add-row-text">
              {state.editing ? (
                <div className="button-div">
                  <Button
                    id={"menuButton"}
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    style={{ width: "100%", backgroundColor: "#03A9F4" }}
                    onClick={handleAddButton}
                  >
                    DODAJ
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            {
              //TODO dąłbyś radę zrobić żeby ten texfield zajmował cały row
              // z marginesami po prae px z obu stron?
            }
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <TextField
                    multiline
                    label="Opis"
                    placeholder="Opis zadania..."
                    value={newTask.description}
                    onChange={handleNewTaskChange("description")}
                    className={"description-input"}
                  />
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
