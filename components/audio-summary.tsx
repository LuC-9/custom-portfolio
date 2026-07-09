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
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

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

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handlePlaybackRateChange = (rate: number) => {
    if (!audioRef.current) return
    
    audioRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="mb-6 rounded-xl border border-border/60 bg-primary/5 p-4 md:p-5">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-sans text-lg font-semibold tracking-tight">{title}</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 rounded-full px-3 text-xs">
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
      
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <Button 
          variant="outline"
          size="sm"
          className="h-10 rounded-full border-primary/40 bg-primary/10 px-4 text-primary hover:bg-primary/15"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        
        <div className="min-w-[200px] flex-1">
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
          className="h-8 w-8 rounded-full border border-border/60"
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



