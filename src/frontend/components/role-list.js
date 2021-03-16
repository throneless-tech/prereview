// base imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI imports
import AvatarGroup from '@material-ui/lab/AvatarGroup';

// components
import RoleBadge from './role-badge';

export function Reviewers({ user, allReviews, hasReviewed }) {
  const [reviews] = useState(allReviews);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    let newAuthors = [];
    reviews.map(review => {
      if (review.author) {
        const newAuthor = review.author;
        newAuthor.reviewUuid = review.uuid;
        newAuthors = [...newAuthors, newAuthor];
      } else if (review.authors) {
        if (review.isPublished) {
          review.authors.map(author => (newAuthors = [...newAuthors, author]));
        }
      }
      return newAuthors;
    });

    if (hasReviewed) {
      newAuthors = [...newAuthors, user];
    }

    const filteredAuthors = newAuthors.filter(
      (author, i, authors) =>
        i === authors.findIndex(a => a.uuid === author.uuid),
    );

    setAuthors(filteredAuthors);
  }, []);

  useEffect(() => {}), [authors];

  return (
    <div>
      {!authors.length && <p className="role-list__tip-text">No Reviewers</p>}

      <AvatarGroup max={20}>
        {authors.length
          ? authors.map(author => <RoleBadge key={author.uuid} user={author} />)
          : null}
      </AvatarGroup>
    </div>
  );
}

Reviewers.propTypes = {
  user: PropTypes.object,
  allReviews: PropTypes.array.isRequired,
  roleIds: PropTypes.arrayOf(PropTypes.object),
  hasReviewed: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
};
