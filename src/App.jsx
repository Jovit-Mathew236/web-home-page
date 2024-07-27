// import React from 'react'
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import MusicPlayerSlider from "./components/musicPlayer";
import { Bot, Github, Mail, Search, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { makeGetRequest } from '../api/axios-request'; // Importing the function from axios-request.js
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Callback from './Callback';

const CLIENT_ID = "4613ad851712424d87c043c5b029da27"
// const CLIENT_SECRET = "99661f511d374780a6447471f4ba13bf"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const REDIRECT_URI = "http://localhost:5173/callback"
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state"
];

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

  function login() {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=code&show_dialog=true`;
  }

  // useEffect(() => {
  //   async function initialize() {
  //     const tokenValid = await checkAndRefreshToken();
  //     setIsAuthorized(tokenValid);
  //   }
  //   initialize();
  // }, []);


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token !== 'undefined' && token !== null) {
      // console.log(token)
      setIsAuthorized(true);
    }
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
    // call currentlyPlaying
    currentlyPlaying()
  }, [])
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await makeGetRequest(); // Call the function to fetch data
        setNewsData(data.results.slice(0, 2));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  // console.log(newsData);
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={
          <>
            <div className="h-dvh w-screen flex flex-col justify-between">

              <div className=" flex z-50 relative flex-col flex-wrap bg-transparent">
                <div className="w-screen flex flex-wrap lg:flex-nowrap justify-between border-x-0 border-y-2 border-t-0 text-white">
                  <div className="grow lg:grow-0 order-1 p-5 text-sm  lg:text-3xl border border-y-0 border-l-0 flex items-center gap-14">
                    <p>2nd July 2024</p>
                    <p>6:35 PM</p>
                  </div>

                  <div className="grow order-3 lg:order-2 lg:grow-0 p-1 w-[65%] border-t-2 lg:border-0">
                    {
                      isAuthorized ?
                        <>
                          {/* <button onClick={currentlyPlaying}>Sync Spotify</button> */}
                          <MusicPlayerSlider
                            currentlyPlayingTrack={currentlyPlayingTrack}
                            onNextTrack={handleNextTrack}
                            onPrevTrack={handlePrevTrack}
                          />
                        </>
                        : <button onClick={login}>Login Spotify</button>
                    }
                  </div>

                  <div className="p-5 order-2 lg:order-3 border border-y-0 border-r-0 border-t-0 content-center">
                    <p className="bg-[url('/assets/logo.png')] w-20 h-10 lg:w-28 lg:h-14 bg-contain bg-no-repeat m-auto"></p>
                  </div>
                </div>
              </div>



              <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row z-50 h-auto md:h-full relative">

                <div className="border-r-white mt-10 lg:mt-0 lg:border-r lg:flex-1 flex flex-col gap-10 justify-center items-center">

                  <div className="hidden lg:flex w-fit gap-3 bg-[#161616]/40 backdrop-blur-md p-2 rounded-3xl">
                    <div className="flex flex-col gap-3">
                      <div className="bg-black/40 w-60 h-2/4 flex justify-center items-center rounded-2xl">
                        <Mail />
                      </div>
                      <div className="bg-black/40 w-60 h-2/4 flex justify-center items-center rounded-2xl">
                        <Twitter />
                      </div>
                    </div>
                    <div className="bg-custom-gradient w-56 h-56 flex justify-center items-center rounded-2xl">
                      <Github size={60} />
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="relative w-11/12 m-auto">
                      <input
                        className="bg-black/40 backdrop-blur-md w-full md:w-[485px] h-10 p-4 pl-10 flex justify-center items-center rounded-lg border placeholder-gray-400 text-white"
                        type="search"
                        placeholder="Where do you wanna go today?"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search />
                      </div>
                      <button className="absolute inset-y-0 right-0 m-auto h-fit flex items-center mr-2 bg-white rounded-lg text-sm p-1 px-5 text-black">
                        search
                      </button>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-6xl w-[485px] leading-snug text-center">Meet the web again</h1>

                </div>



                <div className="px-7 lg:p-0 lg:border-l lg:flex-1 flex flex-col gap-10 lg:justify-center items-center w-full">

                  <div className="flex flex-col gap-5 md:gap-10 bg-[#192C3D] p-5 lg:p-10 md:w-4/5 lg:h-4/5 rounded-3xl border bg-[url('./assets/aibg.jpg')] bg-cover bg-blend-multiply bg-center ">

                    <div className="flex justify-center items-center gap-5">
                      <Bot />
                      <p className="text-lg md:text-3xl font-thin">Hey Milan how&apos;s your day going</p>
                    </div>

                    <input
                      className="bg-black/40 backdrop-blur-md w-full h-12 p-4 pl-10 flex justify-center items-center rounded-2xl text-center border placeholder-gray-400 text-white"
                      type="search"
                      placeholder="Talk to our ai "
                    />

                    <div className="lg:h-36 md:p-5 bg-black/40 rounded-3xl flex gap-20 justify-center items-center overflow-scroll">
                      <img src="https://www.google.com/s2/favicons?domain=figma.com&sz=40" alt="" />
                      <img src="https://www.google.com/s2/favicons?domain=youtube.com&sz=40" alt="" />
                      <img src="https://www.google.com/s2/favicons?domain=x.com&sz=40" alt="" />
                      <img src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=40" alt="" />
                      <img src="https://www.google.com/s2/favicons?domain=savee.it&sz=40" alt="" />
                    </div>
                    {isLoading ? <p>Loading...</p> :
                      <ul className="list-disc text-2xl p-5 rounded-3xl flex flex-col gap-5">
                        {newsData.map((article, index) => (
                          <li key={index} className="text-sm md:text-1xl">{article.title}</li>
                        ))}
                      </ul>}
                  </div>



                </div>
              </div>

              <div className="flex z-50 items-center justify-center relative h-20 border-t-2 overflow-scroll md:overflow-hidden text-xs md:text-1xl">
                <div className="border-r-1 px-2 w-fit min-w-28 md:px-10 flex justify-center items-center">100 cookies blocked</div>
                <div className="w-[2px] h-5 bg-white rounded-md"></div>
                <div className="border-r-1 px-2 w-fit min-w-28 md:px-10 flex justify-center items-center">34Mbps & 20Mbps </div>
                <div className="w-[2px] h-5 bg-white rounded-md"></div>
                <div className="border-r-1 px-2 w-fit min-w-28 md:px-10 flex justify-center items-center">weather is rainy today</div>
                <div className="w-[2px] h-5 bg-white rounded-md"></div>
                <div className="border-r-1 px-2 w-fit min-w-28 md:px-10 flex justify-center items-center">you have visited 2700 unique websites</div>
                <div className="w-[2px] h-5 bg-white rounded-md"></div>
                <div className="border-r-1 px-2 w-fit min-w-28 md:px-10 flex justify-center items-center">you have spent 300 hours and 47 minutes here with us</div>
                {/* <div className="w-[2px] h-5 bg-white rounded-md"></div> */}
              </div>
            </div>




            <div className="h-screen w-screen z-10 top-0 absolute pointer-events-none opacity-35">
              <p className="bg-[url('/assets/noise.webp')] object-cover h-screen"></p>
            </div>
            <div className="h-screen w-screen z-0 top-0 absolute pointer-events-none">
              <ShaderGradientCanvas
                importedFiber={{ ...fiber, ...drei, ...reactSpring, }}
                style={{
                  position: "absolute",
                  pointerEvents: "none",
                  top: 0,
                }}
                className='pointer-events-none z-0'
              >
                <ShaderGradient
                  control="query"
                  urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23ff08ea&bgColor2=%2300b83a&brightness=1.2&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%2300400d&color2=%23005252&color3=%2300ebeb&embedMode=off&envPreset=dawn&fov=45&gizmoHelper=hide&grain=off&lightType=env&pixelDensity=2.2&positionX=0&positionY=0&positionZ=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=2.6&uDensity=0.7&uFrequency=5.5&uSpeed=0.1"
                />

              </ShaderGradientCanvas>
            </div>
          </>
        } />
      </Routes>
    </Router>

  );
}
export default App;
