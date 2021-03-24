// base imports
import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

// Material UI imports
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// site logo
import PreReviewLogo from './pre-review-logo';

// icons
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles(() => ({
  footerNav: {
    height: 210,
    marginTop: '2rem',
  },
  footerNavItem: {
    color: '#000 !important', // #FIXME remove after porting to MUI
    fontSize: '1.25rem',
  },
  img: {
    display: 'block',
    width: '100%',
  },
  signUp: {
    color: '#fff !important',
    display: 'inline-block',
    fontSize: '2rem',
    marginBottom: 30,
    marginTop: 30,
    position: 'relative',
  },
  signUpIcon: {
    position: 'absolute',
    right: '-30px',
    top: '55%',
    transform: 'translateY(-50%)',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Box pt={3} px={3} borderTop="1px solid #54948E">
            <Link to="/" href={'https://prereview.org'}>
              <PreReviewLogo />
            </Link>
            <Grid
              container
              direction="column"
              spacing={2}
              justify="space-between"
              className={classes.footerNav}
            >
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  href="https://content.prereview.org/mission"
                >
                  Mission
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  href="https://content.prereview.org/people"
                >
                  People
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  href="https://content.prereview.org/funding"
                >
                  Funding
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://codeforscience.org/donate/prereview/"
                >
                  Donate
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://content.prereview.org/blog"
                >
                  Blog
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://content.prereview.org/coc"
                >
                  Code of Conduct
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://content.prereview.org/privacypolicy"
                >
                  Privacy Policy
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="/api/docs"
                >
                  API
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://github.com/PREreview/prereview"
                >
                  GitHub
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  color="textPrimary"
                  href="https://content.prereview.org/contact"
                >
                  Contact
                </Link>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              spacing={2}
              className={classes.footerNav}
            >
              <Grid item>
                <Link className={classes.footerNavItem} href="/reviews">
                  Preprint Review Platform
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  href="https://content.prereview.org/programs"
                >
                  Programs
                </Link>
              </Grid>
              <Grid item>
                <Link className={classes.footerNavItem} href="/communities">
                  Communities
                </Link>
              </Grid>
              <Grid item>
                <Link
                  className={classes.footerNavItem}
                  href="https://content.prereview.org/resources"
                >
                  Resource Center
                </Link>
              </Grid>
            </Grid>
            <Box borderTop="1px solid #000" mt={2} py={2}>
              <Typography>
                <em>
                  Except where otherwise noted, content on this site is licensed
                  under a{' '}
                  <Link href="https://creativecommons.org/licenses/by/4.0/">
                    Creative Commons Attribution 4.0 International license
                  </Link>
                  . All project and service logos, images, videos, and brands
                  are property of their respective owners and should not be
                  reused without permission, except where otherwise noted. Icons
                  by The Noun Project.
                </em>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box bgcolor="#54948E" color="#fff" p={8} height="85%">
            <Typography variant="h4" component="h2" gutterBottom>
              Stay Connected.
            </Typography>
            {/*<Typography component="div" gutterBottom>
              <Link
                href="https://mailchi.mp/97886570610a/prereview-newsletter-signup"
                className={classes.signUp}
              >
                Sign up
                <ArrowForwardIosIcon className={classes.signUpIcon} />
              </Link>
            </Typography>*/}
            {/* Begin Mailchimp Signup Form */}
            <link
              href="https://cdn-images.mailchimp.com/embedcode/slim-10_7.css"
              rel="stylesheet"
              type="text/css"
            />
            <div id="mc_embed_signup">
              <form
                action="https://prereview.us2.list-manage.com/subscribe/post?u=59f5a6fb4d4e4c2764dd6b2c8&amp;id=ea4641711a"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
                noValidate
              >
                <div id="mc_embed_signup_scroll">
                  <label htmlFor="mce-EMAIL">Stay connected.</label>
                  <input
                    type="email"
                    value=""
                    name="EMAIL"
                    className="email"
                    id="mce-EMAIL"
                    placeholder="email address"
                    required
                  />
                  {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                  <div
                    style={{ position: 'absolute', left: '-5000px' }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_59f5a6fb4d4e4c2764dd6b2c8_ea4641711a"
                      tabIndex="-1"
                      value=""
                    />
                  </div>
                  <div className="clear">
                    <input
                      type="submit"
                      value="Subscribe"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="button"
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* End mc_embed_signup */}
            <Typography variant="h5" component="div">
              <em>
                By providing your email address, you are opting in to receive
                communications about PREreview. All data is subject to the
                PREreview privacy policy. Please contact contact@prereview.org
                with any questions.
              </em>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box borderTop="1px solid #54948E">
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="PREreview_"
              options={{ height: 700 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
