// base imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// hooks
import { useGetUserNotifications, useGetFullReviews, usePostFullReviewInviteAccept, useDeleteFullReviewInvite } from '../hooks/api-hooks.tsx';

// MaterialUI components
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiButton from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const Button = withStyles({
  root: {
    color: '#fff',
    textTransform: 'none',
  },
})(MuiButton);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles(theme => ({
  input: {
    marginBottom: '1rem',
    width: '100%',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    top: `50%`,
    left: `50%`,
    maxWidth: 750,
    padding: theme.spacing(2, 4, 3),
    position: 'absolute',
    transform: `translate(-50%, -50%)`,
    width: '80vw',
  },
  spinning: {
    color: '#ff3333',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  submit: {
    marginTop: '1rem',
  },
}));

function InviteRow({ invite, onRemove }) {
  const { mutate: acceptInvite } = usePostFullReviewInviteAccept({
    id: invite.preprint,
    role: invite.role,
    pid: invite.persona,
  });
  const { mutate: declineInvite } = useDeleteFullReviewInvite({
    id: invite.preprint,
    role: invite.role,
    pid: invite.persona,
  });

  console.log('***invite***:', invite);
  const handleAcceptInvite = () => {
    acceptInvite()
      .then(() => {
        alert('Invite has been accepted.');
        onRemove(invite);
        return;
      })
      .catch(() => alert('Failed to accept the invitation.'));
  };

  const handleDeclineInvite = () => {
    declineInvite()
      .then(() => {
        alert('Invite has been declined.');
        onRemove(invite);
        return;
      })
      .catch(() => alert('Failed to decline the invitation.'));
  };

  return (
    <>
      <StyledTableRow>
        <TableCell component="th" scope="row">
          {invite.title}
        </TableCell>
        <TableCell align="right">
          <Button
            color="primary"
            variant="contained"
            onClick={handleAcceptInvite}
          >
            Accept
          </Button>
        </TableCell>
        <TableCell align="right">
          <Button
            color="primary"
            variant="contained"
            onClick={handleDeclineInvite}
          >
            Delete
          </Button>
        </TableCell>
      </StyledTableRow>
    </>
  );
}

export default function SettingsInvites({ user }) {
  const classes = useStyles();

  // fetch all invites from the API
  const [invites, setInvites] = useState(null);
  const [reviews, setReviews] = useState(null);
  const { data: invitesData, loading: invitesLoading } = useGetUserNotifications({
    uid: user.orcid,
    resolve: invites => invites.data,
  });
  const { data: reviewsData, loading: reviewsLoading } = useGetFullReviews({
    queryParams: {
      can_edit: user.personas.map(persona => persona.uuid).toString(),
      is_published: false,
    },
    resolve: reviews => reviews.data,
  });

  useEffect(() => {
    if (!invitesLoading) {
      if (invitesData) {
        setInvites(invitesData);
      }
    }
  }, [invitesLoading]);

  useEffect(() => {
    if (!reviewsLoading) {
      if (reviewsData) {
        setReviews(reviewsData);
      }
    }
  }, [invitesLoading]);

  const onRemove = remove => {
    const filtered = invites.filter(invite => invite.preprint !== remove.preprint && invite.persona !== remove.persona);
    setInvites(filtered);
  };

  if (invitesLoading) {
    return <CircularProgress className={classes.spinning} />;
  } else {
    return (
      <section className="settings-notifications settings__section">
        <h3 className="settings__title">Collaboration</h3>
        <h4 className="settings__subtitle">Invites</h4>
        {invites && invites.length ? (
          <Box my={4}>
            <TableContainer>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell className="vh">Name</TableCell>
                    <TableCell className="vh">Accept</TableCell>
                    <TableCell className="vh">Deny</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invites.map(invite => (
                    <InviteRow
                      key={invite.uuid}
                      invite={invite}
                      onRemove={onRemove}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
            <div>No invites yet.</div>
          )}
        <h4 className="settings__subtitle">Drafts</h4>
        {reviews && reviews.length ? (
          <Box my={4}>
            <TableContainer>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell className="vh">Title</TableCell>
                    <TableCell className="vh">Handle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map(review => (
                    <Link
                      href={`/preprints/${review.preprint.uuid}/reviews/${review.uuid}`}
                      target="_blank"
                      rel="noreferrer"
                      key={review.uuid}
                    >
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {review.preprint.title}
                        </TableCell>
                        <TableCell align="right">
                          {review.preprint.handle}
                        </TableCell>
                      </StyledTableRow>
                    </Link>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
            <div>No accepted invites to display.</div>
          )}
      </section>
    );
  }
}

SettingsInvites.propTypes = {
  user: PropTypes.object.isRequired,
};
