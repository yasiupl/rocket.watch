import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchLaunchData, ReadableDateString, getLongStatusName } from "@/lib/api"; // Adjusted path
import sourcesData from "@/data/sources.json"; // Adjusted path
import styles from "@/styles/Home.module.css"; // Assuming you might use some styles

export default function Home() {
  const [upcomingLaunches, setUpcomingLaunches] = useState([]);
  const [pastLaunches, setPastLaunches] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHomePageData() {
      try {
        setLoading(true);
        const upcomingData = await fetchLaunchData("launch/upcoming/?limit=4&mode=detailed");
        if (upcomingData && upcomingData.results) {
          setUpcomingLaunches(upcomingData.results);
        } else {
          console.error("Failed to fetch upcoming launches or data is null");
          // Optionally set an error state here for upcoming launches
        }

        const pastData = await fetchLaunchData("launch/previous/?limit=4&status=3&mode=summary"); // status=3 for successful
        if (pastData && pastData.results) {
          setPastLaunches(pastData.results);
        } else {
          console.error("Failed to fetch past launches or data is null");
          // Optionally set an error state here for past launches
        }

        if (sourcesData && sourcesData.featuring) {
          setFeaturedItems(sourcesData.featuring);
        }

      } catch (err) {
        console.error("Error loading home page data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadHomePageData();
  }, []);

  if (loading) {
    return <div className="container center-align" style={{padding: '2rem'}}><p>Loading page data...</p><div className="progress"><div className="indeterminate"></div></div></div>;
  }

  if (error) {
    return <div className="container center-align" style={{padding: '2rem'}}><p>Error loading data: {error}</p></div>;
  }

  // Determine the main featured launch (first non-TBD upcoming launch if available)
  const featuredLaunch = upcomingLaunches.find(launch => launch.status && launch.status.id !== 2) || upcomingLaunches[0];

  return (
    <>
      <Head>
        <title>Rocket.Watch - Next.js Home</title>
        <meta name="description" content="Upcoming and past rocket launches" />
      </Head>

      {/* Main Info Section (equivalent to #info card) */}
      {featuredLaunch && (
        <div id="info" className="card" style={{marginBottom: "20px"}}>
          <div className="card-content">
            <span className="card-title">{featuredLaunch.name}</span>
            <p><strong>Status:</strong> {getLongStatusName(featuredLaunch.status.id)}</p>
            <p><strong>Date:</strong> {ReadableDateString(featuredLaunch.net)}</p>
            {featuredLaunch.mission && <p><strong>Mission:</strong> {featuredLaunch.mission.description?.substring(0,150)}...</p>}
            <p>Provider: {featuredLaunch.launch_service_provider?.name}</p>
          </div>
          <div className="card-action">
            {/* Links will be added when we componentize cards and handle routing */}
            <a href="#">Details</a>
            <a href="#">Countdown</a>
          </div>
        </div>
      )}

      <div className="section">
        <h2>Upcoming Launches</h2>
        {upcomingLaunches.length > 0 ? (
          <div className="row">
            {upcomingLaunches.map((launch) => (
              <div key={launch.id || launch.slug} className="col s12 m6 l3">
                {/* This will be replaced by LaunchCard component later */}
                <div className="card small">
                  <div className="card-content">
                    <span className="card-title truncate">{launch.name}</span>
                    <p>Status: {getLongStatusName(launch.status.id)}</p>
                    <p>Date: {ReadableDateString(launch.net)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming launches to display.</p>
        )}
      </div>

      <div className="section">
        <h2>Recent Successful Launches</h2>
        {pastLaunches.length > 0 ? (
          <div className="row">
            {pastLaunches.map((launch) => (
              <div key={launch.id || launch.slug} className="col s12 m6 l3">
                {/* This will be replaced by LaunchCard component later */}
                <div className="card small">
                  <div className="card-content">
                    <span className="card-title truncate">{launch.name}</span>
                     <p>Date: {ReadableDateString(launch.net)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent successful launches to display.</p>
        )}
      </div>

      <div className="section">
        <h2>Featured</h2>
        {featuredItems.length > 0 ? (
          <div className="row">
            {featuredItems.map((item, index) => (
              <div key={index} className="col s12 m6 l4">
                {/* This will be replaced by a generic Card component later */}
                 <div className="card">
                   {item.img && <div className="card-image"><img src={item.img.startsWith('./assets/') ? item.img.replace('./assets/', '/assets/') : item.img} alt={item.name} style={{maxHeight: '150px', objectFit: 'contain'}} /></div>}
                   <div className="card-content">
                     <span className="card-title truncate">{item.name}</span>
                     <p className="truncate">{item.desc}</p>
                   </div>
                   <div className="card-action">
                      <a href={item.url.startsWith('#') ? `/${item.url.substring(2)}` : item.url} target={item.url.startsWith('#') ? '_self' : '_blank'} rel="noopener noreferrer">{item.action || 'Learn More'}</a>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No featured items to display.</p>
        )}
      </div>
    </>
  );
}
