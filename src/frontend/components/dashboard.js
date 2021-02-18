// base imports
import React, { useEffect, useContext, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import omit from 'lodash/omit';
import { subDays } from 'date-fns'
import { useHistory, useLocation } from 'react-router-dom';

// Material UI
import Link from '@material-ui/core/Link';
import Pagination from '@material-ui/lab/Pagination';

import { ORG } from '../constants';

// hooks
import { useGetPreprints } from '../hooks/api-hooks.tsx';
import { useNewPreprints } from '../hooks/ui-hooks';

// utils
import { getUsersRank, isYes } from '../utils/stats';
import { processParams, searchParamsToObject } from '../utils/search';
import { getId } from '../utils/jsonld';

// contexts
import UserProvider from '../contexts/user-context';

// modules
import AddButton from './add-button';
import Banner from "./banner.js";
import Button from './button';
import LoginRequiredModal from './login-required-modal';
import Checkbox from './checkbox';
import SortOptions from './sort-options';
import HeaderBar from './header-bar';
import PreprintCard from './preprint-card';
import SearchBar from './search-bar';
import RecentActivity from './recent-activity'
import ActiveUser from './active-user'
import PrivateRoute from './private-route';
import NewPreprint from './new-preprint';
import Modal from './modal';


export default function Dashboard() {
  const history = useHistory();
  const location = useLocation();
  const [user] = useContext(UserProvider.context);

  const [loginModalOpenNext, setLoginModalOpenNext] = useState(null);
  const [newPreprints, setNewPreprints] = useNewPreprints();

  // search
  const params = processParams(location.search);
  const [search, setSearch] = useState(params.get('search') || '');
  const covidTerms = ['COVID-19', 'Coronavirus', 'SARS-CoV-2'];

  const { data: preprints, loading: loadingPreprints, error } = useGetPreprints(
    {
      queryParams: searchParamsToObject(params),
    },
  );

  const [hoveredSortOption, setHoveredSortOption] = useState(null);

  /**
   * builds an array where each item of the array is an object with an 'actions' key,
   * the value to which are all of actions from each preprint
   * */
  // let allActions = []
  // !loadingPreprints && preprints ? allActions = preprints.data.map(preprint => {
  //   return {
  //     preprint: preprint.doc, // details of each preprint
  //     actions: preprint.doc.potentialAction
  //   }
  // })
  //   : allActions = []

  /**
   * adding the preprint info to each action,
   * and pushing each individual action to a new array
   */
  // let justActions = [];
  // allActions.forEach(setOfActions => setOfActions.actions.forEach(action => {
  //   action["preprint"] = setOfActions.preprint
  //   justActions.push(action)
  // }))

  // const safeActions = useMemo(() => {
  //   return justActions.filter(
  //     action =>
  //       !checkIfIsModerated(action) &&
  //       (action['@type'] === 'RequestForRapidPREreviewAction' ||
  //         action['@type'] === 'RapidPREreviewAction')
  //   );
  // }, [justActions]);

  // filtering actions for ones that happened within the last week
  // const recentActions = safeActions ? safeActions.filter(action => new Date(action.startTime) >= subDays(new Date(), 7)) : []

  // sort recent actions to populate a "Recent activity" section,
  // but sorts all actions if none occurred in the last week
  // const sortedActions = recentActions.length ? recentActions.slice(0, 15).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) : safeActions ? safeActions.slice(0, 15).sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) : null

  // gets active users, ranked by number of requests+reviews
  // const rankedUsers = getUsersRank(safeActions ? safeActions : [])

  // gets 10 of the top users, just their user ids
  // const justUsers = rankedUsers.slice(0, 10).map(user => user[0])

  // next three functions copied from home.js
  const handleNewRequest = useCallback(
    preprint => {
      if (user) {
        history.push({
          pathname: '/dashboard/new',
          search: history.location.search,
          state: {
            preprint: omit(preprint, ['potentialAction']),
            tab: 'request',
            isSingleStep: true
          }
        });
      } else {
        const search = new URLSearchParams(location.search);
        search.set('identifier', preprint.doi || preprint.arXivId);
        search.set('tab', 'request');

        setLoginModalOpenNext(`/dashboard/new?${search}`);
      }
    },
    [user, history]
  );

  const handleNew = useCallback(
    preprint => {
      if (user) {
        history.push({
          pathname: '/dashboard/new',
          search: history.location.search,
          state: {
            preprint: omit(preprint, ['potentialAction'])
          }
        });
      } else {
        const search = new URLSearchParams(location.search);
        search.set('identifier', preprint.doi || preprint.arXivId);

        setLoginModalOpenNext(`/dashboard/new?${search}`);
      }
    },
    [user, history]
  );

  const handleNewReview = useCallback(
    preprint => {
      if (user) {
        history.push({
          pathname: '/dashboard/new',
          search: history.location.search,
          state: {
            preprint: omit(preprint, ['potentialAction']),
            tab: 'review',
            isSingleStep: true
          }
        });
      } else {
        const search = new URLSearchParams(location.search);
        search.set('identifier', preprint.doi || preprint.arXivId);
        search.set('tab', 'review');

        setLoginModalOpenNext(`/dashboard/new?${search}`);
      }
    },
    [user, history]
  );

  return (
    <div className="toc-page">
      <Helmet>
        <title>{ORG} • Dashboard </title>
      </Helmet>
      <Banner />
      <HeaderBar
        thisUser={user}
        onClickMenuButton={() => {
          setShowLeftPanel(!showLeftPanel);
        }}
      />
      {loginModalOpenNext && (
        <LoginRequiredModal
          next={loginModalOpenNext}
          onClose={() => {
            setLoginModalOpenNext(null);
          }}
        />
      )}
      <PrivateRoute path="/dashboard/new" exact={true}>
        <Modal
          showCloseButton={true}
          title="Add Entry"
          onClose={() => {
            history.push({ pathname: '/dashboard', search: location.search });
          }}
        >
          <Helmet>
            <title>Rapid PREreview • Add entry</title>
          </Helmet>
          <NewPreprint
            user={user}
            onCancel={() => {
              history.push({ pathname: '/dashboard', search: location.search });
            }}
            onSuccess={preprint => {
              history.push({ pathname: '/dashboard', search: location.search });
                setNewPreprints(newPreprints.concat(preprint));
            }}
            onViewInContext={({ preprint, tab }) => {
                    history.push(
                      `/preprints/${createPreprintId(preprint.handle)}`,
                      {
                        preprint: preprint,
                        tab,
                      },
                    );
                  }}
          />
        </Modal>
      </PrivateRoute>
      <article className="toc-page__main">
        <div className="toc-page__body">
          <section className="dashboard home__main">
          <h1 id="Dashboard">COVID-19 Dashboard</h1>
            <SearchBar
            defaultValue={search}
            isFetching={loadingPreprints}
            onChange={value => {
              params.delete('page');
              setSearch(value);
            }}
            onCancelSearch={() => {
              params.delete('search');
              setSearch('');
              history.push({
                pathname: location.pathame,
                search: params.toString(),
              });
            }}
            onRequestSearch={() => {
              params.set('search', search);
              params.delete('page');
              history.push({
                pathname: location.pathame,
                search: params.toString(),
              });
            }}
          />
            <div className="dashboard__flex">
              <div className="dashboard__flex_item">

              <SortOptions
                sort={params.get('sort') || ''}
                order={params.get('asc') === 'true' ? 'asc' : 'desc'}
                onMouseEnterSortOption={sortOption => {
                  setHoveredSortOption(sortOption);
                }}
                onMouseLeaveSortOption={() => {
                  setHoveredSortOption(null);
                }}
                onChange={(sortOption, sortOrder) => {
                  params.set('asc', sortOrder === 'asc');
                  params.set('sort', sortOption);
                  history.push({
                    pathname: location.pathame,
                    search: params.toString(),
                  });
                }}
              />
              
                {preprints && preprints.totalCount === 0 && !loadingPreprints ? (
                  <div>
                    No preprints about this topic have been added to Rapid PREreview.{' '}
                    {!!location.search && (
                      <Link
                        onClick={() => {
                          setSearch('');
                          if (user) {
                            history.push('/new');
                          } else {
                            setLoginModalOpenNext('/new');
                          }
                        }}
                      >
                        Review or request a review of a Preprint to add it to the
                        site.
                      </Link>
                    )}
                  </div>
                ) : 
                  <ul className="dashboard__preprint-list">
                    {preprints &&
                      preprints.data.map(row => (
                        <li key={row.id} className="home__preprint-list__item">
                          <PreprintCard
                            isNew={false}
                            user={user}
                            preprint={row}
                            onNewRequest={handleNewRequest}
                            onNew={handleNew}
                            onNewReview={handleNewReview}
                            hoveredSortOption={hoveredSortOption}
                            sortOption={params.get('asc') === 'true'}
                          />
                        </li>
                      ))}
                  </ul>}
                <br/>
                {preprints && preprints.totalCount > params.get('limit') && (
                  <div className="home__pagination">
                    <Pagination
                      count={Math.ceil(preprints.totalCount / params.get('limit'))}
                      page={parseInt('' + params.get('page'))}
                      onChange={(ev, page) => {
                        params.set('page', page);
                        history.push({
                          pathname: location.pathname,
                          search: params.toString(),
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="dashboard__flex_item">
                <div>
                  <AddButton
                    onClick={e => {
                      if (user) {
                        history.push({ pathname: '/dashboard/new', search: location.search });
                      } else {
                        setLoginModalOpenNext(`/dashboard/new?${location.search}`);
                      }
                    }}
                    disabled={location.pathname === '/dashboard/new'}
                  />
                </div>
                <div className="dashboard__activity">
                  <div  className="dashboard__activity_item">
                    <h2 className="dashboard__h2">Recent Activity</h2>
                    {/* {sortedActions.map( action =>
                      <RecentActivity
                        key={action['@id']}
                        action={action}
                      />
                    )} */}
                  </div>
                  <div  className="dashboard__activity_item">
                    <h2 className="dashboard__h2">Active Reviewers</h2>
                    {/* <ol className="dashboard__activity_item_list">
                      {justUsers.map(user =>
                        <li>
                          <ActiveUser
                            key={user['@id']}
                            user={user}
                          />
                        </li>
                      )}
                    </ol> */}
                  </div> 
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
