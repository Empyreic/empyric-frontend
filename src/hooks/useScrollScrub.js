import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// How many viewport-heights of scrolling drive the full clip.
// (Roughly mirrors the original 560vh stage minus the 100vh pin.)
const SCRUB_VH = 4.6;

/**
 * Pins the stage and scrubs a timeline against scroll:
 *   - the video playhead follows scroll position (Apple-style)
 *   - the hero copy dissolves as the clip takes over
 *   - phase captions cross-fade in sequence
 *   - a progress rail tracks how far you've travelled
 *
 * Under reduced motion the timeline is skipped and the clip simply
 * loops behind the (statically laid-out) content.
 *
 * @param {object} refs   refs into the Stage DOM
 * @param {Array}  captions  caption phase definitions (start/end in 0..1)
 * @param {boolean} reduced
 */
export function useScrollScrub(refs, captions, reduced) {
  const {
    stageRef,
    pinRef,
    videoRef,
    heroRef,
    scrimRef,
    railRef,
    cueRef,
    capsRef,
  } = refs;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduced motion: no scrubbing — let the clip loop quietly.
    if (reduced) {
      video.loop = true;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      return;
    }

    let ctx;

    const build = () => {
      const duration = video.duration || 10;

      ctx = gsap.context(() => {
        const playhead = { t: 0 };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * SCRUB_VH,
            scrub: 1,
            pin: pinRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Drive the video playhead across the whole timeline. We tween a
        // proxy and seek in onUpdate so a seek in flight never backlogs.
        tl.to(
          playhead,
          {
            t: duration,
            duration: 1,
            onUpdate: () => {
              if (
                video.readyState >= 1 &&
                Math.abs(video.currentTime - playhead.t) > 0.01
              ) {
                try {
                  video.currentTime = playhead.t;
                } catch (e) {
                  /* seek not ready yet */
                }
              }
            },
          },
          0
        );

        // Progress rail.
        tl.fromTo(railRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

        // Scroll cue fades out almost immediately.
        tl.to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0);

        // Hero dissolves between ~6% and ~16%.
        tl.to(
          heroRef.current,
          { autoAlpha: 0, y: -34, ease: "sine.inOut", duration: 0.1 },
          0.06
        );
        tl.to(
          scrimRef.current,
          { opacity: 0, ease: "sine.inOut", duration: 0.1 },
          0.06
        );

        // Captions cross-fade across their windows.
        capsRef.current.forEach((el, i) => {
          if (!el) return;
          const { start, end } = captions[i];
          const fade = (end - start) * 0.24;
          gsap.set(el, { opacity: 0, y: 28 });
          tl.to(el, { opacity: 1, y: 0, ease: "sine.inOut", duration: fade }, start);
          tl.to(
            el,
            { opacity: 0, y: -8, ease: "sine.inOut", duration: fade },
            end - fade
          );
        });
      }, stageRef);

      // The pin adds ~SCRUB_VH viewports of scroll height. Recalculate every
      // other ScrollTrigger (section reveals, count-ups, draw-ins) against the
      // new page height — otherwise they fire against the short, un-pinned
      // layout and play before their element is on screen.
      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) build();
    else video.addEventListener("loadedmetadata", build, { once: true });

    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", build);
      if (ctx) ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}
