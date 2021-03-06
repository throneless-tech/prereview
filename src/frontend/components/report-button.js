// base imports
import React from 'react';
import PropTypes from 'prop-types';

// hooks
import { usePutReported } from '../hooks/api-hooks.tsx';

// Material UI imports
import { withStyles } from '@material-ui/core/styles';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import MuiButton from '@material-ui/core/Button';

const Button = withStyles({
  root: {
    textTransform: 'none',
  },
})(MuiButton);

const ReportButton = props => {
  const { uuid, type, title } = props;

  const { mutate: updateReview } = usePutReported({
    id: uuid,
  });

  const handleReport = () => {
    if (confirm(`Are you sure you want to report this ${type}?`)) {
      updateReview({
        type: type,
        title: title,
      })
        .then(() =>
          alert(
            `This ${type} has been reported to the moderators. They will review it promptly.`,
          ),
        )
        .catch(err => alert(`An error occurred: ${err.message}`));
    }
  };

  return (
    <Button color="primary" onClick={handleReport}>
      <EmojiFlagsIcon />
      Report
    </Button>
  );
};

ReportButton.propTypes = {
  uuid: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
};

export default ReportButton;
