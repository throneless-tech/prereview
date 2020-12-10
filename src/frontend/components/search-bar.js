import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MdSearch, MdClose } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import { createPreprintQs } from '../utils/search';
import IconButton from './icon-button';
import { useIsMobile } from '../hooks/ui-hooks';
import { useSearch } from '../hooks/api-hooks.tsx';

export default function SearchBar({ isFetching }) {
  const history = useHistory();
  const location = useLocation();
  const isMobile = useIsMobile();
  //const { data: searchResults, loading, refetch } = useSearch({ lazy: true });

  const defaultValue = '';
  const prevDefaultValueRef = useRef(null);

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue !== prevDefaultValueRef.current) {
      setValue(defaultValue || '');
    }
    prevDefaultValueRef.current = defaultValue;
  }, [defaultValue]);

  function handleSubmit(value) {
    const search = `?query=${value}`;
    if (search !== location.search) {
      history.push({
        pathname: location.pathame,
        search,
        state: { prevSearch: location.search },
      });
    }
  }

  return (
    <div className="search-bar">
      <div className="search-bar__left-spacer" />
      <div className="search-bar__search-box">
        <input
          value={value}
          type="text"
          className="search-bar__search-box__input"
          placeholder={
            isMobile
              ? 'Search by DOI, arXiv ID or title'
              : 'Search preprints with reviews or requests for reviews by DOI, arXiv ID or title'
          }
          disabled={isFetching}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSubmit(e.target.value);
            }
          }}
          onChange={e => {
            setValue(e.target.value);
          }}
          onBlur={e => {
            handleSubmit(e.target.value);
          }}
        />
        {!isFetching && defaultValue && defaultValue === value ? (
          <IconButton
            className="search-bar__search-box__button"
            onClick={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <MdClose className="search-bar__search-box__button-icon" />
          </IconButton>
        ) : (
          <IconButton
            className="search-bar__search-box__button"
            onClick={e => {
              e.preventDefault();
              handleSubmit(value);
            }}
          >
            <MdSearch className="search-bar__search-box__button-icon" />
          </IconButton>
        )}
      </div>
      <div className="search-bar__right-spacer" />
    </div>
  );
}

SearchBar.propTypes = {
  isFetching: PropTypes.bool,
};
