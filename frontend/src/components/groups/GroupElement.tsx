import React, { useState } from "react";
import {
  Box,
  IconButton,
  Chip,
  TextField,
  Select,
  Input,
  MenuItem,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import SaveIcon from "@material-ui/icons/SaveOutlined";
import CancelIcon from "@material-ui/icons/CancelOutlined";
import "./group.css";
import { UserDetails } from "../../services/AuthenticationService";
import GroupService from "../../services/GroupsService";
import { useSnackbar } from "notistack";

const GroupElement = (props: any) => {
  const [editVersion, setEdit] = useState<boolean>(false);
  const [groupName, setGroupName] = useState({
    name: props.group.name,
  });
  const [members, setMembers] = useState<UserDetails[]>(
    props.users.filter((user: UserDetails) => {
      return props.group.members.includes(user._id);
    })
  );
  const [errors, setErrors] = React.useState<any>();
  const { enqueueSnackbar } = useSnackbar();

  const changeToEdit = () => {
    setEdit(true);
  };

  const cancelEdit = () => {
    setEdit(false);
    setMembers(
      props.users.filter((user: UserDetails) => {
        return props.group.members.includes(user._id);
      })
    );
  };

  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName({ ...groupName, [prop]: event.target.value });

      if (prop === "name") {
        validateGroupName(event.target.value);
      }
    };

  const validateGroupName = (value: any) => {
    setErrors({ ...errors, name: "" });
    if (value.length === 0) {
      setErrors({ ...errors, name: "Nazwa grupy jest wymagana." });
    } else if (value.length > 32) {
      setErrors({
        ...errors,
        name: "Max. 32 znaki.",
      });
    }
  };

  const handleMembers = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMembers(event.target.value as UserDetails[]);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

  const onEditGroup = () => {
    if (members.length === 0) {
      GroupService.deleteGroup(props.group._id).then(
        () => {
          enqueueSnackbar("Usunięto grupę!");
          props.readGroups();
        },
        () => enqueueSnackbar("Wystąpił błąd. Spróbuj usunąć grupę ponownie.")
      );
    } else {
      const data = {
        _id: props.group._id,
        name: groupName.name,
        members: members,
      };
      GroupService.editGroup(data).then(
        () => {
          enqueueSnackbar("Edytowano grupę!");
          props.readGroups();
        },
        () => enqueueSnackbar("Wystąpił błąd. Spróbuj edytować grupę ponownie.")
      );
    }
  };

  if (!editVersion) {
    return (
      <Box className={"inRowElement"}>
        <div className="element-title-text" style={{ marginLeft: "5px" }}>
          {props.group.name}
        </div>

        <div className={"elementChipDiv"}>
          {members.map((member) => {
            return (
              <Chip
                key={member._id}
                label={member.name}
                style={{ margin: "1px" }}
              />
            );
          })}
        </div>

        <div>
          <IconButton onClick={changeToEdit}>
            <EditIcon style={{ color: "#03A9F4" }} fontSize="large" />
          </IconButton>

          <IconButton onClick={props.deleteHandler}>
            <DeleteIcon style={{ color: "red" }} fontSize="large" />
          </IconButton>
        </div>
      </Box>
    );
  } else {
    return (
      <Box className={"inRowElement"}>
        <TextField
          label="Nazwa grupy"
          variant="outlined"
          placeholder="Nazwa grupy"
          value={groupName.name}
          onChange={handleChange("name")}
          error={Boolean(errors?.name)}
          helperText={errors?.name}
        />

        <Select
          variant="outlined"
          multiple
          value={members}
          onChange={handleMembers}
          input={<Input className={"addGroupSelect"} />}
          renderValue={(selected) => (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {(selected as UserDetails[]).map((value) => (
                <Chip
                  key={value._id}
                  label={value.name}
                  style={{ margin: "2px" }}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {props.users.map((user: any) => {
            // @ts-ignore
            return (
              <MenuItem key={user._id} value={user}>
                {user.name}
              </MenuItem>
            );
          })}
        </Select>

        <div>
          <IconButton onClick={onEditGroup} disabled={Boolean(errors?.name)}>
            <SaveIcon
              style={{ color: Boolean(errors?.name) ? "#979797" : "#03A9F4" }}
              fontSize="large"
            />
          </IconButton>
          <IconButton onClick={cancelEdit}>
            <CancelIcon
              style={{ color: "red" }}
              fontSize="large"
              type="submit"
            />
          </IconButton>
        </div>
      </Box>
    );
  }
};

export default GroupElement;
