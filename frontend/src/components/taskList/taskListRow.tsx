import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  ListItemText,
  Typography,
  withStyles,
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import "./taskListRow.css";
import "./taskList.css";
import MuiTableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const TableCell = withStyles((theme) => ({
  root: {
    height: 10,
    padding: 3,
  },
}))(MuiTableCell);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function TableRowComponent(props: {
  name: string;
  person: string;
  status: string;
  style: React.CSSProperties | undefined;
}) {
  const [buttonState, setButtonState] = React.useState({
    statusText: props.status,
    statusStyle: props.style,
    person: props.person,
  });

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

  const [menu, setMenu] = React.useState({
    inProgress: "W trakcie",
    done: "Wykonano",
    toDo: "Do zrobienia",
    paused: "Wstrzymano",
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickPerson = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClosePerson = () => {
    setAnchorEl2(null);
  };

  const handlePersonMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setButtonState({ ...buttonState, person: event.currentTarget.id });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === "1") {
      setButtonState({
        ...buttonState,
        statusText: "W trakcie",
        statusStyle: {
          backgroundColor: "#FFEF62",
          fontWeight: "bold" as "bold",
          width: "100%",
          color: "black",
        },
      });
    } else if (event.currentTarget.id === "2") {
      setButtonState({
        ...buttonState,
        statusText: "Wykonano",
        statusStyle: {
          backgroundColor: "#33EB91",
          fontWeight: "bold" as "bold",
          width: "100%",
          color: "black",
        },
      });
    } else if (event.currentTarget.id === "3") {
      setButtonState({
        ...buttonState,
        statusText: "Do zrobienia",
        statusStyle: {
          backgroundColor: "#CFCFCF",
          fontWeight: "bold" as "bold",
          width: "100%",
          color: "black",
        },
      });
    } else {
      setButtonState({
        ...buttonState,
        statusText: "Wstrzymano",
        statusStyle: {
          backgroundColor: "#F1503A",
          fontWeight: "bold" as "bold",
          width: "100%",
          color: "black",
        },
      });
    }
  };

  return (
    <>
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
        <TableCell id={"name"} className="task-text" component="th" scope="row">
          {props.name}
        </TableCell>

        <TableCell id={"person"} className="person-text" align="center">
          <Button
            style={{ width: "100%" }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClickPerson}
          >
            <span style={{ textTransform: "none" }}>{buttonState.person}</span>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl2}
            keepMounted
            open={Boolean(anchorEl2)}
            onClose={handleClosePerson}
          >
            <MenuItem id={"Andżej"} onClick={handlePersonMenuClick}>
              Andżej
            </MenuItem>
            <MenuItem id={"Sebek"} onClick={handlePersonMenuClick}>
              Sebek
            </MenuItem>
            <MenuItem id={"Karyna"} onClick={handlePersonMenuClick}>
              Karyna
            </MenuItem>
          </Menu>
        </TableCell>

        <TableCell id={"status"} align="center">
          <div>
            <Button
              id={"menuButton"}
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="primary"
              onClick={handleClick}
              style={buttonState.statusStyle}
            >
              {buttonState.statusText}
            </Button>
            <StyledMenu
              id="customized-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <StyledMenuItem>
                <ListItemText
                  id={"1"}
                  onClick={handleMenuClick}
                  primary="W trakcie"
                />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemText
                  id={"2"}
                  onClick={handleMenuClick}
                  primary="Wykonano"
                />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemText
                  id={"3"}
                  onClick={handleMenuClick}
                  primary="Do zrobienia"
                />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemText
                  id={"4"}
                  onClick={handleMenuClick}
                  primary="Wstrzymano"
                />
              </StyledMenuItem>
            </StyledMenu>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                Historyyy
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Placeholder</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}