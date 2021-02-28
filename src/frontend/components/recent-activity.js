// base imports
import React, { Fragment, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

//utils
import { formatDistanceStrict } from 'date-fns';
import { createPreprintId } from '../../common/utils/ids.js';
//material ui
import Link from '@material-ui/core/Link';


export default function RecentActivity({activity}) {
  let author;
  let authors;

  activity.author ? author = activity.author : authors = activity.authors;

  const multiAuthors = () => {
    return authors.map( author => (
      <Link href={`/about/${author.uuid}`}>
      {author.name}{' '}
      </Link> 
    ))
  }

  const title = activity.preprintTitle
  const preprintId = createPreprintId(activity.handle);

  const getContent = type => {
    switch (type) {
      case 'request':
        return (
          <Fragment>
            <div className="dashboard__activity_item_text">
              <Link href={`/about/${author.uuid}`}>
                {author.name}
              </Link>{' '}
              requested reviews for {' '}
              <Link href={`/preprints/${preprintId}`}>
                {title}
              </Link>{' '}
              {formatDistanceStrict(new Date(activity.createdAt), new Date()) + ` ago.`}
            </div>
          </Fragment>
        )
      case 'rapid':
        return (
          <Fragment>
            <div className="dashboard__activity_item_text">
              <Link href={`/about/${author.uuid}`}>
                {author.name}
              </Link>{' '}
              rapid reviewed {' '}
              <Link href={`/preprints/${preprintId}`}>
                {title}
              </Link>{' '}
              {formatDistanceStrict(new Date(activity.createdAt), new Date()) + ` ago.`}
            </div>
          </Fragment>
        )
      case 'long':
        return (
          <Fragment>
            <div className="dashboard__activity_item_text">
              { multiAuthors() }{' '} reviewed {' '}
              <Link href={`/preprints/${preprintId}`}>
                {title}
              </Link>{' '}
              {formatDistanceStrict(new Date(activity.createdAt), new Date()) + ` ago.`}
            </div>
          </Fragment>
        )
      default:
        return ''
    }
  }

  return getContent(activity.type)
}