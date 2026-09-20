import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { highlightsSlides } from "../constants/index.js";
import { playImg, pauseImg, replayImg } from "../utils";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (idx, evt) =>
    setLoadedData((prev) => [...prev, evt]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animate the progress bar of the current video
      let animation = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(animation.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                    ? "10vw" // tablet
                    : "4vw", // laptop
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });

            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        animation.restart();
      }

      const animationUpdate = () => {
        animation.progress(
          videoRef.current[videoId].currentTime /
            highlightsSlides[videoId].videoDuration,
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animationUpdate);
      } else {
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, idx) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: idx + 1 }));
        break;
      case "video-last":
        setVideo((prev) => ({ ...prev, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((prev) => ({ ...prev, isLastVideo: false, videoId: 0 }));
        break;
      case "video-play":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      case "video-pause":
        setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {highlightsSlides.map((list, idx) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}
                  ref={(el) => (videoRef.current[idx] = el)}
                  onEnded={() =>
                    idx !== 3
                      ? handleProcess("video-end", idx)
                      : handleProcess("video-last")
                  }
                  onPlay={() => {
                    setVideo((prev) => ({ ...prev, isPlaying: true }));
                  }}
                  onLoadedMetadata={(evt) => handleLoadedMetadata(idx, evt)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full ">
          {videoRef.current.map((_, idx) => (
            <span
              key={idx}
              ref={(el) => (videoDivRef.current[idx] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[idx] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("video-play")
                  : () => handleProcess("video-pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
