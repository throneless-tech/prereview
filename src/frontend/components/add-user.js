// base imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material ui imports
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import MuiButton from '@material-ui/core/Button';

// hooks
import { useGetUsers } from '../hooks/api-hooks.tsx';

// components
import Search from './search';

// icons
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const Button = withStyles({
  root: {
    textTransform: 'none',
  },
})(MuiButton);

const useStyles = makeStyles(theme => ({
  buttonText: {
    paddingLeft: 6,
  },
  paper: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  spinning: {
    color: '#ff3333',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const AddUsers = ({ community }) => {
  const classes = useStyles();

  const [users, setUsers] = useState(null);

  /* API calls */
  // fetch users from API
  const { data: usersData, loading, error } = useGetUsers();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!loading) {
      if (usersData) {
        setUsers(usersData.data);
      }
    }
  }, [usersData, loading]);

  if (loading) {
    return <CircularProgress className={classes.spinning} />;
  } else {
    return (
      <div>
        <Button type="button" onClick={handleOpen}>
          <AddCircleOutlineIcon />
          <span className={classes.buttonText}>Add new community members</span>
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.paper}>
            <Search
              community={community}
              handleClose={handleClose}
              users={users}
            />
          </div>
        </Modal>
      </div>
    );
  }
};

AddUsers.propTypes = {
  community: PropTypes.string,
};

export default AddUsers;