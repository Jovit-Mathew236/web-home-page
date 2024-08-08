import React, { useState } from "react";
import { Bot, Github, Mail, Search, Twitter } from "lucide-react";

interface MainContentProps {
  // @ts-ignore
  newsData: any[];
  isLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ newsData, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const handleButtonClick = () => {
    if (searchQuery) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
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

        <div className="w-full md:w-auto">
          <div className="relative w-11/12 md:w-auto m-auto">
            <input
              className="bg-black/40 backdrop-blur-md w-full md:w-[485px] h-10 p-4 pl-10 flex justify-center items-center rounded-lg border placeholder-gray-400 text-white"
              type="search"
              placeholder="Where do you wanna go today?"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search />
            </div>
            <button
              className="absolute inset-y-0 right-0 m-auto h-fit flex items-center mr-2 bg-white rounded-lg text-sm p-1 px-5 text-black"
              onClick={handleButtonClick}
            >
              Search
            </button>
          </div>
        </div>

        <h1 className="text-3xl md:text-6xl w-[485px] leading-snug text-center">
          Meet the web again
        </h1>
      </div>

      <div className="px-7 lg:p-0 lg:border-l lg:flex-1 flex flex-col gap-10 lg:justify-center items-center w-full">
        <div className="flex flex-col gap-5 md:gap-10 bg-[#192C3D] p-5 lg:p-10 md:w-4/5 lg:h-4/5 rounded-3xl border bg-[url('./assets/aibg.jpg')] bg-cover bg-blend-multiply bg-center ">
          <div className="flex justify-center items-center gap-5">
            <Bot />
            <p className="text-lg md:text-3xl font-thin">
              Hey Milan, how&apos;s your day going?
            </p>
          </div>

          <input
            className="bg-black/40 backdrop-blur-md w-full h-12 p-4 pl-10 flex justify-center items-center rounded-2xl text-center border placeholder-gray-400 text-white"
            type="search"
            placeholder="Talk to our AI"
          />

          <div className="lg:h-36 md:p-5 bg-black/40 rounded-3xl flex gap-1 justify-center items-center overflow-scroll">
            <a
              href="https://figma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-full place-content-center"
            >
              <img
                src="https://www.google.com/s2/favicons?domain=figma.com&sz=40"
                alt="Figma"
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-full place-content-center"
            >
              <img
                src="https://www.google.com/s2/favicons?domain=youtube.com&sz=40"
                alt="YouTube"
              />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-full place-content-center"
            >
              <img
                src="https://www.google.com/s2/favicons?domain=x.com&sz=40"
                alt="X"
              />
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-full place-content-center"
            >
              <img
                src="https://www.google.com/s2/favicons?domain=whatsapp.com&sz=40"
                alt="WhatsApp"
              />
            </a>
            <a
              href="https://savee.it"
              target="_blank"
              rel="noopener noreferrer"
              className="w-20 h-full place-content-center"
            >
              <img
                src="https://www.google.com/s2/favicons?domain=savee.it&sz=40"
                alt="Savee"
              />
            </a>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list-disc text-2xl p-5 rounded-3xl flex flex-col gap-5">
              {newsData.map((article, index) => (
                <li key={index} className="text-sm md:text-1xl">
                  {article.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
