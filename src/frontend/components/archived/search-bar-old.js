import React from 'react';
import PropTypes from 'prop-types';
import MuiSearchBar from 'material-ui-search-bar';

export default function SearchBar({
  isFetching,
  defaultValue,
  onChange,
  onCancelSearch,
  onRequestSearch,
}) {
  return (
    <div className="search-bar">
      <div className="search-bar__search-box">
        <MuiSearchBar
          value={defaultValue}
          onChange={value => onChange(value)}
          onCancelSearch={onCancelSearch}
          onRequestSearch={onRequestSearch}
          className="search-bar__search-box__input"
          placeholder="Enter search terms here"
          disabled={isFetching}
        />
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  isFetching: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onRequestSearch: PropTypes.func,
  onCancelSearch: PropTypes.func,
};
