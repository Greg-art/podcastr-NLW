import { createContext, useState, ReactNode, useContext } from 'react'
import Player from '../components/Player';

type Episode = {
    title: string;
    members: string
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playPrevious: () => void;
    playNext: () => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;    
    isLooping: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isShuffling: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [isShuffling, setIsShuffling] = useState(true);

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  function clearPlayerState(){
    setEpisodeList({});
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1)  < episodeList.length

  function playNext(){
    if(isShuffling){
      const nextRandonEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandonEpisodeIndex);
    } else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1 );
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play, 
        playList,
        isPlaying, 
        togglePlay,
        isLooping,
        toggleLoop, 
        playPrevious,
        playNext,
        setPlayingState,
        hasPrevious,
        hasNext,
        toggleShuffle,
        isShuffling,
        clearPlayerState,
      }}
    >
        {children}
    </PlayerContext.Provider>)
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}