import React from "react";
import MusicPlayerSlider from "./musicPlayer";
import SpotifyLogin from "./SpotifyLogin";

interface HeaderProps {
  isAuthorized: boolean;
  currentlyPlayingTrack: any;
  handleNextTrack: () => void;
  handlePrevTrack: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthorized,
  currentlyPlayingTrack,
  handleNextTrack,
  handlePrevTrack,
}) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex z-50 relative flex-col flex-wrap bg-transparent">
      <div className="w-screen flex flex-wrap lg:flex-nowrap justify-between border-x-0 border-y-2 border-t-0 text-white">
        <div className="grow lg:grow-0 order-1 p-5 text-sm lg:text-3xl border border-y-0 border-l-0 flex items-center gap-14">
          <p>{formattedDate}</p>
          <p className="w-[145px]">{formattedTime}</p>
        </div>

        <div className="grow order-3 lg:order-2 lg:grow-0 p-1 w-[65%] border-t-2 lg:border-0">
          {isAuthorized ? (
            <MusicPlayerSlider
              currentlyPlayingTrack={currentlyPlayingTrack}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
            />
          ) : (
            <SpotifyLogin />
          )}
        </div>

        <div className="p-5 order-2 lg:order-3 border border-y-0 border-r-0 border-t-0 content-center">
          <p className="bg-[url('/assets/logo.png')] w-20 h-10 lg:w-28 lg:h-14 bg-contain bg-no-repeat m-auto"></p>
        </div>
      </div>
    </div>
  );
};

export default Header;
