import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdMenu } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MenuLink } from '@reach/menu-button';
import { GetUser } from '../hooks/api-hooks.tsx';
import PreReviewLogo from './pre-review-logo';
import IconButton from './icon-button';
import UserBadge from './user-badge';
import XLink from './xlink';
import NoticeBadge from './notice-badge';
import { checkIfRoleLacksMininmalData } from '../utils/roles';
import { useIsMobile } from '../hooks/ui-hooks';

export default function HeaderBar({ onClickMenuButton, closeGap, user }) {
  const roles = user && user.groups ? user.groups : []; //GetUser(1);

  //const showProfileNotice = checkIfRoleLacksMininmalData(role);
  const showProfileNotice = false;
  const isMobile = useIsMobile();

  const [initialHeaderOffset, setinitialHeaderOffset] = useState(null);
  const [initialHeaderOffsetMobile, setinitialHeaderOffsetMobile] = useState(
    null,
  );

  useEffect(() => {
    if (document) {
      document.documentElement.style.setProperty(
        '--announcement-bar-height',
        closeGap ? '0px' : initialHeaderOffset,
      );

      document.documentElement.style.setProperty(
        '--announcement-bar-height--mobile',
        closeGap ? '0px' : initialHeaderOffsetMobile,
      );
      setHeaderOffset();
    }
  }, []);

  const setHeaderOffset = () => {
    const headerBarOffset = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--announcement-bar-height');

    const headerBarOffsetMobile = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--announcement-bar-height--mobile');

    setinitialHeaderOffset(headerBarOffset);
    setinitialHeaderOffsetMobile(headerBarOffsetMobile);
  };

  return (
    <div className="header-bar">
      <div className="header-bar__left">
        {!!onClickMenuButton && (
          <IconButton
            data-noclickoutside="true"
            onClickCapture={onClickMenuButton}
            className="header-bar__menu-button"
          >
            <MdMenu
              className="header-bar__menu-button-icon"
              data-noclickoutside="true"
            />
          </IconButton>
        )}
        <PreReviewLogo />
      </div>

      <div className="header-bar__right">
        <Link className="header-bar__nav-item" to="/about">
          About
        </Link>
        <Link className="header-bar__nav-item" to="/code-of-conduct">
          {isMobile ? (
            <abbr title="Code of Conduct">CoC</abbr>
          ) : (
            <span>Code of Conduct</span>
          )}
        </Link>
        <Link className="header-bar__nav-item" to="/extension">
          Extension
        </Link>
        <Link className="header-bar__nav-item" to="/api">
          API
        </Link>
        <span className="header-bar__nav-item header-bar__nav-item--user-badge">
          {user ? (
            <UserBadge user={user} showNotice={showProfileNotice}>
              {showProfileNotice && (
                <MenuLink
                  as={process.env.IS_EXTENSION ? undefined : Link}
                  to={process.env.IS_EXTENSION ? undefined : '/settings'}
                  href={process.env.IS_EXTENSION ? `/settings` : undefined}
                  target={process.env.IS_EXTENSION ? '_blank' : undefined}
                >
                  Complete Profile
                  <div className="menu__link-item__icon">
                    <NoticeBadge />
                  </div>
                </MenuLink>
              )}

              <MenuLink
                as={process.env.IS_EXTENSION ? undefined : Link}
                to={process.env.IS_EXTENSION ? undefined : '/settings'}
                href={process.env.IS_EXTENSION ? `settings` : undefined}
                target={process.env.IS_EXTENSION ? '_blank' : undefined}
              >
                User Settings
              </MenuLink>

              {user.isAdmin && (
                <MenuLink
                  as={process.env.IS_EXTENSION ? undefined : Link}
                  to={process.env.IS_EXTENSION ? undefined : '/admin'}
                  href={process.env.IS_EXTENSION ? `admin` : undefined}
                  target={process.env.IS_EXTENSION ? '_blank' : undefined}
                >
                  Admin Settings
                </MenuLink>
              )}

              {user.isAdmin && (
                <MenuLink
                  as={process.env.IS_EXTENSION ? undefined : Link}
                  to={process.env.IS_EXTENSION ? undefined : '/block'}
                  href={process.env.IS_EXTENSION ? `block` : undefined}
                  target={process.env.IS_EXTENSION ? '_blank' : undefined}
                >
                  Moderate Users
                </MenuLink>
              )}

              {(roles.includes('moderators') && !user.isModerated) && (
                <MenuLink
                  as={process.env.IS_EXTENSION ? undefined : Link}
                  to={process.env.IS_EXTENSION ? undefined : '/moderate'}
                  href={process.env.IS_EXTENSION ? `moderate` : undefined}
                  target={process.env.IS_EXTENSION ? '_blank' : undefined}
                >
                  Moderate Reviews
                </MenuLink>
              )}
              <MenuLink href={`/logout`}>Logout</MenuLink>
            </UserBadge>
          ) : (
            <XLink to="/login" href="/login">
              Login
            </XLink>
          )}
        </span>
      </div>
      {/* TODO link to feedback form */}
      <div className="header-bar__give-feedback">
        <a
          href="https://docs.google.com/forms/d/1ao2f12U96lKlbVJifrWHEhPmCAB3ZHD16s-I7WmJyU4/viewform?edit_requested=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          Give Feedback
        </a>
      </div>
    </div>
  );
}

HeaderBar.propTypes = {
  onClickMenuButton: PropTypes.func,
  closeGap: PropTypes.bool,
  user: PropTypes.object,
};
