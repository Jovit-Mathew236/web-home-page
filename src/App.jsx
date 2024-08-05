import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { makeGetRequest } from '../api/axios-request';
import './App.css';
import Callback from './Callback';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Background from './components/Background';

// async function checkAndRefreshToken() {
//   const accessToken = localStorage.getItem('access_token');
//   const refreshToken = localStorage.getItem('refresh_token');

//   if (!accessToken || !refreshToken) {
//     // No tokens, user needs to log in again
//     return false;
//   }

//   // Check if the token is still valid
//   const response = await fetch('https://api.spotify.com/v1/me', {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`
//     }
//   });

//   if (response.ok) {
//     // Token is still valid
//     return true;
//   } else if (response.status === 401) {
//     // Token has expired, try to refresh it
//     const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken,
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET
//       })
//     });

//     if (refreshResponse.ok) {
//       const refreshData = await refreshResponse.json();
//       localStorage.setItem('access_token', refreshData.access_token);
//       return true;
//     }
//   }

//   // If we get here, we couldn't refresh the token
//   return false;
// }

function App() {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentlyPlayingTrack, setCurrentlyPlayingTrack] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token !== 'undefined' && token !== null) {
      setIsAuthorized(true);
    }
  }, []);

  // useEffect(() => {
  //   async function initialize() {
  //     const tokenValid = await checkAndRefreshToken();
  //     setIsAuthorized(tokenValid);
  //   }
  //   initialize();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await makeGetRequest();
        setNewsData(data.results.slice(0, 2));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  async function currentlyPlaying() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    var playerParams = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      }
    }
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player', playerParams)
      if (response.status === 200) {
        const data = await response.json();
        setCurrentlyPlayingTrack(data.item);
      } else if (response.status === 204) {
        console.log("No track currently playing");
      } else {
        console.log("Error fetching currently playing track");
        const errorData = await response.json();
        console.log("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    currentlyPlaying();
  }, []);

  const handleNextTrack = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await currentlyPlaying(); // Fetch the new current track
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  const handlePrevTrack = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await currentlyPlaying(); // Fetch the new current track
    } catch (error) {
      console.error("Error going to previous track:", error);
    }
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <>
        <div className="h-dvh w-screen flex flex-col justify-between">
          <Header
            isAuthorized={isAuthorized}
            currentlyPlayingTrack={currentlyPlayingTrack}
            handleNextTrack={handleNextTrack}
            handlePrevTrack={handlePrevTrack}
          />
          <MainContent newsData={newsData} isLoading={isLoading} />
          <Footer />
        </div>
        <Background />
      </>,
    },
    {
      path: "/callback",
      element: <Callback />,
    }
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;