import React, { useState, useRef, useEffect } from 'react';
import { FiRewind, FiFastForward, FiPlay, FiPause } from "react-icons/fi";
import { songs } from './data/songs';

const App = () => {
  // State
  const [songList, setSongList] = useState(songs);
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);

  // Song props
  const { name, artist, color, image, audioSrc } = songList[activeSongIndex];

  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  // Effects
  useEffect(() => {
    if (play) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [play]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(audioSrc);
    setProgress(audioRef.current.currentTime);
    
    if (isReady.current) {
      setReady(false);
      audioRef.current.addEventListener('canplaythrough', () => {
        setReady(true);
        audioRef.current.play();
        setPlay(true);
        startTimer();
      });
    } else {
      isReady.current = true;
      setReady(true);
    }
  }, [activeSongIndex]);

  //Handlers
  const startTimer = () => {
	  clearInterval(intervalRef.current);

	  intervalRef.current = setInterval(() => {
	    if (audioRef.current.ended) {
	      switchHandler('next');
	    } else {
	      setProgress(audioRef.current.currentTime);
	    }
	  }, [1000]);
	}

  const switchHandler = (action = 'next') => {
    let length = songList.length;
    switch (action){
      case 'next':
        if (activeSongIndex < length - 1) {
          setActiveSongIndex(activeSongIndex + 1);
        } else {
          setActiveSongIndex(0);
        }
        break;
      case 'prev':
        if (activeSongIndex > 0) {
          setActiveSongIndex(activeSongIndex - 1);
        } else {
          setActiveSongIndex(length - 1);
        }
        break;
      default:
        break;
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  const onScrub = value => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setProgress(audioRef.current.currentTime);
  }

  // Vars for view
  const iconStyles = 'mx-auto w-5 h-5';
  const currentPercentage = duration ? `${(progress / duration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #666), color-stop(${currentPercentage}, #ECECEC))
  `;

  return (
    <div className={`w-screen h-screen flex items-center justify-center bg-${color}-500`}>
      <div className="md:container md:mx-auto px-4">
        <div className="w-full flex justify-between bg-white rounded-3xl overflow-hidden shadow-xl relative">
          <span className={`absolute top-4 right-4 flex h-3 w-3 transition duration-100 linear ${!ready ? 'opacity-100' : 'opacity-0'}`}>
            <span className={`relative inline-flex rounded-full h-full w-full bg-${color}-500`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
            </span>
          </span>
          
          <div className="w-2/4 overflow-hidden">
            <img src={image} className="w-full object-cover" alt={`${artist} - ${name}`}/>
          </div>
          <div className="w-2/4 p-4 flex flex-col items-center justify-center">
            <div>
              <h1 className="w-full text-center text-3xl font-medium flex justify-center">{name}</h1>
              <h2 className="w-full text-center text-xl font-light pt-2">{artist}</h2>
            </div>
            <div className="w-full flex items-center justify-center pt-6">
              <button type="button" className="w-12 h-12 rounded-full bg-gray-300 transition duration-200 linear hover:bg-gray-500 mx-2" onClick={() => switchHandler('prev')}>
                <FiRewind stroke="white" className={iconStyles} />
              </button>
              <button type="button" className={`w-12 h-12 rounded-full bg-${color}-500 transition duration-200 linear hover:bg-${color}-400 mx-2`} onClick={togglePlay}>
                {play ? <FiPause stroke="white" className={iconStyles} /> : <FiPlay stroke="white" className="mx-auto w-5 h-5" />}
              </button>
              <button type="button" className="w-12 h-12 rounded-full bg-gray-300 transition duration-200 linear hover:bg-gray-500 mx-2" onClick={() => switchHandler('next')}>
                <FiFastForward stroke="white" className={iconStyles} />
              </button>
            </div>
            <div className="w-full pt-8 flex justify-center">
              <input
                type="range"
                value={progress}
                step="1"
                min="0"
                max={duration ? duration : `${duration}`}
                className="w-full max-w-xs"
                onChange={(e) => onScrub(e.target.value)}
                style={{ background: trackStyling }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
