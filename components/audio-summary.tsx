"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AudioSummaryProps {
  audioSrc: string
  title?: string
}

export function AudioSummary({ audioSrc, title = "Audio Summary" }: AudioSummaryProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle volume
  const toggleMute = () => {
    if (!audioRef.current) return
    
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (!audioRef.current) return
    
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  // Handle playback rate
  const handlePlaybackRateChange = (rate: number) => {
    if (!audioRef.current) return
    
    audioRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="bg-card rounded-lg p-4 mb-6">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">{title}</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              {playbackRate}x <ChevronDown size={14} className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <DropdownMenuItem 
                key={rate} 
                onClick={() => handlePlaybackRateChange(rate)}
                className={playbackRate === rate ? "bg-accent" : ""}
              >
                {rate}x
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        
        <div className="flex-1">
          <Slider 
            value={[currentTime]} 
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        
        <div className="w-20">
          <Slider 
            value={[isMuted ? 0 : volume]} 
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  )
}



