import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
// We need to import M from materialize-css to initialize components
// We should ensure this only runs client-side.
// import M from 'materialize-css'; // Will be handled in useEffect

const Layout = ({ children }) => {
  const sidenavRef = useRef(null);

  useEffect(() => {
    // Dynamically import Materialize CSS's JavaScript
    // to ensure it only runs on the client-side.
    import('materialize-css').then(M => {
      if (sidenavRef.current) {
        M.Sidenav.init(sidenavRef.current, {});
      }
      // Initialize other Materialize components if needed globally
      // M.Tooltip.init(document.querySelectorAll('.tooltipped'));
      // Note: Tooltips and other components might be better initialized
      // in the specific components where they are used, or via a custom hook.
    });

    // Cleanup function for Sidenav instance if needed
    return () => {
      if (sidenavRef.current) {
        const instance = M.Sidenav.getInstance(sidenavRef.current);
        if (instance) {
          instance.destroy();
        }
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>rocket.watch - Next.js</title>
        {/* Add other global head elements if necessary */}
        {/* Favicon link is usually in _document.js or added here */}
        <link rel="icon" href="/favicon.ico" />
         {/* We will need to add Font Awesome here or in _document.js */}
      </Head>

      {/* Original body had class="row", applying it to a wrapper div */}
      <div className="row">
        <header className="navbar"> {/* Materialize navbar-fixed can be used if header should be fixed */}
          <nav id="nav_f" role="navigation">
            <div className="nav-wrapper"> {/* Materialize nav-wrapper is common */}
              <Link href="/" legacyBehavior>
                <a className="brand-logo" title="Rocket Watch">rocket.watch</a>
              </Link>
              <a href="#" data-target="slide-out" className="sidenav-trigger">
                <i className="fas fa-bars"></i>
              </a>
              <ul className="right hide-on-med-and-down">
                <li>
                  <Link href="/" legacyBehavior><a className="tooltipped" data-tooltip="Homepage"><i className="fas fa-home"></i></a></Link>
                </li>
                <li><Link href="/agency/121" legacyBehavior><a>SpaceX</a></Link></li>
                <li><Link href="/agency/124" legacyBehavior><a>ULA</a></Link></li>
                <li><Link href="/agency/115" legacyBehavior><a>Ariane</a></Link></li>
                <li><Link href="/agency/63" legacyBehavior><a>Roscosmos</a></Link></li>
                <li>
                  <Link href="/agency" legacyBehavior><a className="tooltipped" data-tooltip="More agencies"><i className="fas fa-chevron-circle-down"></i></a></Link>
                </li>
                <li>
                  <Link href="/location" legacyBehavior><a className="tooltipped" data-tooltip="Launch Centers"><i className="fas fa-map"></i></a></Link>
                </li>
                <li>
                  <Link href="/rocket" legacyBehavior><a className="tooltipped" data-tooltip="Rockets"><i className="fas fa-rocket"></i></a></Link>
                </li>
                <li>
                  <Link href="/launches/upcoming" legacyBehavior><a className="tooltipped" data-tooltip="Future launches"><i className="far fa-calendar-alt"></i></a></Link> {/* Adjusted link for clarity */}
                </li>
                <li>
                  <Link href="/launches/past" legacyBehavior><a className="tooltipped" data-tooltip="Historical launches"><i className="fas fa-history"></i></a></Link> {/* Adjusted link for clarity */}
                </li>
                <li>
                  <Link href="/search" legacyBehavior><a className="tooltipped" data-tooltip="Search"><i className="fas fa-search"></i></a></Link>
                </li>
                <li>
                  <a className="waves-effect waves-light btn hoverable blurple" href="https://discord.gg/cExSaKZ" target="_blank" rel="noopener noreferrer"> {/* Assuming original /discord redirects here */}
                    <i className="fab fa-discord"></i> Discord
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <ul id="slide-out" className="sidenav" ref={sidenavRef}>
          <li>
            <div className="user-view">
              <div className="background">
                <img src="/assets/rocketwatch.png" alt="Rocket Watch background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <img className="circle" src="/assets/icon.png" alt="Rocket Watch icon" />
              <span className="white-text name">rocket.watch</span>
              <a href="http://yasiu.pl" target="_blank" rel="noopener noreferrer">
                <span className="white-text email">by yasiu.pl</span>
              </a>
            </div>
          </li>
          <li><Link href="/" legacyBehavior><a><i><i className="fas fa-home"></i></i>Home page</a></Link></li>
          <li><Link href="/agency/121" legacyBehavior><a>SpaceX</a></Link></li>
          <li><Link href="/agency/124" legacyBehavior><a>United Launch Alliance</a></Link></li>
          <li><Link href="/agency/115" legacyBehavior><a>Ariane</a></Link></li>
          <li><Link href="/agency/63" legacyBehavior><a>Roscosmos</a></Link></li>
          <li><Link href="/agency" legacyBehavior><a><i><i className="fas fa-chevron-circle-down"></i></i>More agencies</a></Link></li>
          <li><Link href="/location" legacyBehavior><a><i><i className="fas fa-map"></i></i>Launch Centers</a></Link></li>
          <li><Link href="/rocket" legacyBehavior><a><i><i className="fas fa-rocket"></i></i>Rockets</a></Link></li>
          <li><Link href="/launches/upcoming" legacyBehavior><a><i><i className="far fa-calendar-alt"></i></i>Upcoming launches</a></Link></li>
          <li><Link href="/launches/past" legacyBehavior><a><i><i className="fas fa-history"></i></i>Historical launches</a></Link></li>
          <li><Link href="/search" legacyBehavior><a><i><i className="fas fa-search"></i></i>Search launches</a></Link></li>
          <li><Link href="/settings" legacyBehavior><a><i><i className="fas fa-cogs"></i></i>Settings</a></Link></li>
          <li><a href="https://github.com/yasiupl/rocket.watch" target="_blank" rel="noopener noreferrer"><i><i className="fab fa-github"></i></i>Source Code</a></li>
          <li><a href="https://launchlibrary.net" target="_blank" rel="noopener noreferrer"><i><i className="fas fa-server"></i></i>Data Source</a></li>
          <li><a href="https://discord.gg/cExSaKZ" target="_blank" rel="noopener noreferrer"><i><i className="fab fa-discord"></i></i>Contact us</a></li>
          <li><a href="https://www.patreon.com/bePatron?u=3533463" target="_blank" rel="noopener noreferrer"><i><i className="fab fa-patreon"></i></i>Become a Patron</a></li>
          {/* Ads removed for now, can be added back if needed using appropriate React components */}
        </ul>

        {/* This is where the page-specific content will go */}
        {/* The original <main> and <div id="info"> were outside the header/footer in index.html body */}
        {/* So, children should encompass them. */}
        <main className="container"> {/* Added container class as common practice for main content */}
          {children}
        </main>

        <footer className="container"> {/* Original footer also had "container" class */}
          <div className="row">
            <div className="col s12">
              <div className="card center-align">
                <a className="become-patron-button" role="button" href="https://www.patreon.com/bePatron?u=3533463" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/patreon.png" alt="Become a Patron" style={{ height: '40px' }} />
                </a>
                {/* Ads removed, can be added back if needed using appropriate React components */}
              </div>
            </div>
            <span>Made with 🖤 by </span><a href="https://yasiu.pl" target="_blank" rel="noopener noreferrer">yasiu.pl</a><span> | Data thanks to </span><a href="https://launchlibrary.net" target="_blank" rel="noopener noreferrer">launchlibrary.net</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
