import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// How many viewport-heights of scrolling drive the full sequence.
// (Roughly mirrors the original 560vh stage minus the 100vh pin.)
const SCRUB_VH = 4.6;

// Scroll-scrubbed image sequence (Apple-style): instead of seeking a video —
// which streams/decodes per seek and stalls under a scrub — we preload a run
// of stills and paint the right one to a canvas as scroll progresses.
//
// Frame source. Swap FRAME_BASE for the hosted CDN URL when ready; the rest
// is unchanged. Frames are 1-indexed: frame_0001.jpg … frame_0120.jpg.
const FRAME_BASE = "/frames";
const FRAME_COUNT = 120;
const FRAME_W = 1280;
const FRAME_H = 720;
const frameUrl = (i) => `${FRAME_BASE}/frame_${String(i + 1).padStart(4, "0")}.jpg`;

/**
 * Pins the stage and scrubs a timeline against scroll:
 *   - the canvas paints the frame matching scroll position (Apple-style)
 *   - the hero copy dissolves as the sequence takes over
 *   - phase captions cross-fade in sequence
 *   - a progress rail tracks how far you've travelled
 *
 * Under reduced motion the timeline is skipped and a single still frame is
 * held behind the (statically laid-out) content.
 *
 * @param {object} refs   refs into the Stage DOM
 * @param {Array}  captions  caption phase definitions (start/end in 0..1)
 * @param {boolean} reduced
 */
export function useScrollScrub(refs, captions, reduced) {
  const {
    stageRef,
    pinRef,
    canvasRef,
    heroRef,
    scrimRef,
    railRef,
    cueRef,
    capsRef,
  } = refs;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c2d = canvas.getContext("2d");
    canvas.width = FRAME_W;
    canvas.height = FRAME_H;

    let cancelled = false;

    const drawImg = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      c2d.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    // Reduced motion: paint one still frame and stop — no sequence, no scrub.
    if (reduced) {
      const still = new Image();
      still.src = frameUrl(0);
      if (still.complete) drawImg(still);
      else still.addEventListener("load", () => !cancelled && drawImg(still), { once: true });
      return () => {
        cancelled = true;
      };
    }

    // Preload the whole sequence. We track the frame the scrub *wants*
    // (`desired`) separately from the one actually painted (`current`), so a
    // frame that's still loading gets painted the moment it arrives if the
    // playhead is parked on it.
    const frames = new Array(FRAME_COUNT);
    let current = -1;
    let desired = 0;

    const paint = (i) => {
      if (i === current) return;
      const img = frames[i];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      current = i;
      c2d.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(i);
      img.onload = () => {
        if (!cancelled && i === desired) paint(i);
      };
      frames[i] = img;
    }

    const seek = (frame) => {
      desired = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frame)));
      paint(desired);
    };
    seek(0);

    const ctx = gsap.context(() => {
      const playhead = { f: 0 };

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

      // Drive the frame index across the whole timeline.
      tl.to(
        playhead,
        { f: FRAME_COUNT - 1, duration: 1, onUpdate: () => seek(playhead.f) },
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

    return () => {
      cancelled = true;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}
