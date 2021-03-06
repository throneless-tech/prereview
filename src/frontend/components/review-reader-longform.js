// base imports
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { Helmet } from 'react-helmet-async';

// Material UI imports
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiButton from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

// hooks
import { usePostComments } from '../hooks/api-hooks.tsx';

// components
import CommentEditor from './comment-editor';
import Controls from './controls';
import ReportButton from './report-button';
import RoleBadge from './role-badge';
import useScript from './plaudit-script';

const PLAUDITURL = 'https://plaudit.pub/embed/endorsements.js';

const Button = withStyles({
  root: {
    textTransform: 'none',
  },
})(MuiButton);

const LongformReviewReader = props => {
  const {
    content,
    commentTitle,
    publishedComment,
    onChange,
    onSubmit,
    review,
    user,
    anchorEl,
    handleAnchor,
    isReader = true,
  } = props;

  const useStyles = makeStyles(theme => ({
    authors: {
      fontSize: '1.25rem',
      fontWeight: '600',
      justifyContent: 'flex-start',
      lineHeight: 1.3,
    },
    author: {
      '&:not(:last-child)': {
        '&:after': {
          content: '", "',
        },
      },
    },
    badge: {
      '&:not(:first-child)': {
        marginLeft: '-10px',
      },
    },
    comment: {
      borderBottom: '2px solid #EBE9E9',
      marginBottom: '1rem',
      paddingBottom: '1rem',
    },
    commentMeta: {
      fontSize: '0.9rem !important',
      fontStyle: 'italic',
    },
    date: {
      fontSize: '1rem',
    },
    h2: {
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    p: {
      fontSize: '0.9rem',
      letterSpacing: '0.1px',
      lineHeight: 1.5,
    },
    popper: {
      backgroundColor: '#fff',
      bottom: '0 !important',
      left: 'unset !important',
      overflowY: 'scroll',
      position: 'fixed !important',
      right: 0,
      top: 0,
      transform: 'none !important',
      width: '100%',
      zIndex: 10000,
      [theme.breakpoints.up('sm')]: {
        width: '40vw',
      },
    },
    popperContent: {
      padding: 20,
    },
    reviewBody: {
      '& p': {
        '& img': {
          display: 'block',
          width: '100%',
        },
      },
    },
    yellow: {
      backgroundColor: '#FFFAEE',
      padding: 10,
    },
  }));

  const classes = useStyles();
  const history = useHistory();

  const [buttonRefId, setButtonRefId] = useState(null);

  const open = Boolean(anchorEl && review.uuid === buttonRefId);
  const id = open ? review.uuid : undefined;
  const reviewDate = new Date(review.updatedAt);
  const reviewContent = review.drafts[review.drafts.length - 1];

  // react html parser functionality
  const transform = node => {
    if (node.attribs) {
      if (node.attribs.class === 'ql-editor') {
        node.attribs.class = '';
        node.attribs.contenteditable = false;
      } else if (
        node.attribs.class === 'ql-clipboard' ||
        node.attribs.class === 'ql-tooltip ql-hidden'
      ) {
        return null;
      }
    }
    return convertNodeToElement(node);
  };

  // react html parser options
  const options = {
    decodeEntities: true,
    transform,
  };

  const Plaudits = () => {
    return useScript(PLAUDITURL);
  };

  // comments
  const {
    mutate: postComment,
    loadingPostComment,
    errorPostComment,
  } = usePostComments({ fid: review.uuid });

  const canSubmit = content => {
    return content && content !== '<p></p>';
  };

  useEffect(() => {
    if (anchorEl) {
      setButtonRefId(anchorEl.getAttribute('aria-describedby'));
    } else {
      setButtonRefId(null);
      // This is in the review reader and not the search page
      if (isReader) {
        history.push(`${history.location.pathname.split('/full-reviews')[0]}`);
      }
    }
  }, [anchorEl, content, commentTitle, publishedComment]);

  return (
    <>
      <Helmet>
        <meta name="citation_doi" content={review.doi} />
      </Helmet>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Slide
            direction="left"
            mountOnEnter
            unmountOnExit
            timeout={350}
            {...TransitionProps}
          >
            <div className="review-reader-longform">
              <Button
                aria-describedby={id}
                type="button"
                onClick={handleAnchor}
                color="secondary"
              >
                Back
              </Button>
              <div className={classes.popperContent}>
                <Grid container justify="space-between" alignItems="center">
                  {review.authors.length > 1 ? (
                    <Grid
                      container
                      item
                      justify="flex-start"
                      alignItems="center"
                      spacing={2}
                      xs={12}
                      sm={9}
                    >
                      <Grid container item xs={12} sm={4}>
                        {review.authors.length
                          ? review.authors.map(author => (
                              <div key={author.uuid} className={classes.badge}>
                                <RoleBadge user={author} />
                              </div>
                            ))
                          : null}
                      </Grid>
                      <Grid item xs={12} sm={8} className={classes.authors}>
                        Review by{' '}
                        {review.authors.length ? (
                          review.authors.map(author => (
                            <span key={author.uuid} className={classes.author}>
                              {author.name}
                            </span>
                          ))
                        ) : (
                          <span className={classes.author}>Anonymous</span>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      item
                      justify="flex-start"
                      alignItems="center"
                      spacing={2}
                      xs={12}
                      sm={9}
                    >
                      <Grid item>
                        <RoleBadge user={review.authors[0]} />
                      </Grid>
                      <Grid className={classes.authors}>{`${
                        review.authors[0].name
                      }'s review`}</Grid>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={3} className={classes.date}>
                    {reviewDate.toLocaleDateString('en-US')}
                  </Grid>
                  {review.doi ? (
                    <Grid item xs={12} sm={2}>
                      <a href={`https://doi.org/${review.doi}`}>
                        <img
                          src={`https://zenodo.org/badge/DOI/${review.doi}.svg`}
                        />
                      </a>
                    </Grid>
                  ) : null}
                </Grid>
                <Box border="1px solid #E5E5E5" mt={4} px={3} pb={2}>
                  <Typography
                    component="div"
                    variant="body1"
                    className={classes.reviewBody}
                  >
                    {ReactHtmlParser(reviewContent.contents, options)}
                  </Typography>
                  <Grid
                    container
                    alignItems="center"
                    justify="space-between"
                    spacing={2}
                  >
                    <Grid item>
                      <div id="plaudits-div">
                        <Plaudits />
                      </div>
                    </Grid>
                    {/*#FIXME plaudits*/}
                    <Grid item>
                      <ReportButton uuid={review.uuid} type="fullReview" />
                    </Grid>
                  </Grid>
                </Box>
                <Box my={4} pb={1} borderBottom="5px solid #EBE9E9">
                  <Typography component="h3" className={classes.h2}>
                    Comments
                  </Typography>
                </Box>
                {review.comments ? (
                  review.comments.map(comment => {
                    return (
                      <Box key={comment.uuid} className={classes.comment}>
                        {comment.title ? (
                          <div className="comments-title">{comment.title}</div>
                        ) : null}
                        <Grid container justify="space-between">
                          <Grid
                            container
                            item
                            spacing={1}
                            alignItems="center"
                            justify="flex-start"
                            xs={12}
                            sm={6}
                          >
                            <Grid item>
                              <RoleBadge user={comment.author} />
                            </Grid>
                            <Grid item>
                              <Typography className={classes.commentMeta}>
                                {comment.author.name}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              align="right"
                              className={classes.commentMeta}
                            >
                              {new Date(comment.updatedAt).toLocaleDateString(
                                'en-US',
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        <div className={classes.p}>
                          {ReactHtmlParser(comment.contents, options)}
                        </div>
                      </Box>
                    );
                  })
                ) : publishedComment ? (
                  <Box>
                    <Grid container justify="space-between">
                      <Grid
                        container
                        item
                        spacing={1}
                        alignItems="center"
                        justify="flex-start"
                        xs={12}
                        sm={6}
                        key={`comment-${user.uuid}`}
                      >
                        <Grid item>
                          <RoleBadge user={user} />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.commentMeta}>
                            {user.defaultPersona
                              ? user.defaultPersona.name
                              : user.name}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          align="right"
                          className={classes.commentMeta}
                        >
                          {new Date().toLocaleDateString('en-US')}
                        </Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.p}>
                      {ReactHtmlParser(publishedComment, options)}
                    </div>
                  </Box>
                ) : (
                  <Typography>No comments have been added yet.</Typography>
                )}
                {publishedComment ? (
                  <Box>
                    <Grid container justify="space-between">
                      <Grid
                        container
                        item
                        spacing={1}
                        alignItems="center"
                        justify="flex-start"
                        xs={12}
                        sm={6}
                        key={`comment-${user.uuid}`}
                      >
                        <Grid item>
                          <RoleBadge user={user} />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.commentMeta}>
                            {user.defaultPersona
                              ? user.defaultPersona.name
                              : user.name}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          align="right"
                          className={classes.commentMeta}
                        >
                          {new Date().toLocaleDateString('en-US')}
                        </Typography>
                      </Grid>
                    </Grid>
                    <div className={classes.p}>
                      {ReactHtmlParser(publishedComment, options)}
                    </div>
                  </Box>
                ) : null}
                {user ? (
                  <Box mt={4} mb={2}>
                    <Typography
                      id="post-comment"
                      component="h4"
                      className={classes.h2}
                    >
                      Post a comment
                    </Typography>
                    <Box mt={2} className={classes.yellow}>
                      <form className="comments__add">
                        <CommentEditor
                          reviewId={review.uuid}
                          initialContent={content}
                          handleContentChange={onChange}
                        />
                        <Controls error={errorPostComment}>
                          <Button
                            type="submit"
                            primary="true"
                            disabled={!canSubmit(content)}
                            onClick={event => {
                              event.preventDefault();
                              if (canSubmit(content)) {
                                postComment({
                                  title: `User ${user.uuid} comment`,
                                  // #FIXME optional title needed
                                  contents: content,
                                })
                                  .then(() => {
                                    alert('Comment submitted successfully.');
                                    return onSubmit(commentTitle, content);
                                  })
                                  .catch(err =>
                                    alert(`An error occurred: ${err.message}`),
                                  );
                              } else {
                                alert('Comment cannot be blank.');
                              }
                            }}
                          >
                            Comment
                          </Button>
                        </Controls>
                      </form>
                    </Box>
                  </Box>
                ) : (
                  <Box mt={4} mb={2} className={classes.yellow}>
                    <Typography component="p">
                      Login to post a comment.
                    </Typography>
                  </Box>
                )}
              </div>
            </div>
          </Slide>
        )}
      </Popper>
    </>
  );
};

LongformReviewReader.propTypes = {
  anchorEl: PropTypes.object,
  handleAnchor: PropTypes.func.isRequired,
  content: PropTypes.string,
  commentTitle: PropTypes.string,
  isReader: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  publishedComment: PropTypes.string,
  review: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default LongformReviewReader;
