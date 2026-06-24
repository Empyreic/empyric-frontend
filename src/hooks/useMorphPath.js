import { useEffect, useRef, useState } from "react";

/**
 * Springs an SVG path's numbers from whatever is on screen toward a new target.
 *
 * Every mascot face path inside a given layer (the outline, the little mouth)
 * shares the exact same SVG commands and point count, so we can morph simply by
 * lerping the numbers out of the two strings. A single scalar `t` is sprung
 * 0 → 1 and used to interpolate; retargeting mid-flight stays smooth because
 * `from` is re-captured as the current interpolated position.
 *
 * No dependency on a motion library — same spirit as useCountUp / useDrawIn.
 */

const NUM = /-?\d*\.?\d+/g;

const numbers = (d) => (d.match(NUM) || []).map(Number);
// The command scaffold (letters, spaces, commas) is identical across a layer's
// emotions, so the first one we see is reused for every rebuild.
const scaffold = (d) => d.split(NUM);

function build(parts, nums) {
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    out += parts[i];
    if (i < nums.length) out += +nums[i].toFixed(2);
  }
  return out;
}

export function useMorphPath(target, reduced) {
  const [d, setD] = useState(target);
  const s = useRef({
    parts: scaffold(target),
    from: numbers(target),
    to: numbers(target),
    t: 1,
    v: 0,
    raf: 0,
    last: 0,
  });

  useEffect(() => {
    const st = s.current;
    const next = numbers(target);

    // Motion-sensitive users get the shape immediately.
    if (reduced) {
      cancelAnimationFrame(st.raf);
      st.from = next;
      st.to = next;
      st.t = 1;
      st.v = 0;
      setD(build(st.parts, next));
      return;
    }

    // Re-anchor on the current on-screen position, then aim at the new shape.
    st.from = st.from.map((f, i) => f + (st.to[i] - f) * st.t);
    st.to = next;
    st.t = 0;
    st.v = 0;
    st.last = 0;

    const stiffness = 180;
    const damping = 20;

    const tick = (now) => {
      if (!st.last) st.last = now;
      const dt = Math.min((now - st.last) / 1000, 1 / 30);
      st.last = now;

      const a = stiffness * (1 - st.t) - damping * st.v;
      st.v += a * dt;
      st.t += st.v * dt;

      if (Math.abs(1 - st.t) < 0.0008 && Math.abs(st.v) < 0.0008) {
        st.t = 1;
        st.v = 0;
        setD(build(st.parts, st.to));
        return;
      }

      const cur = st.from.map((f, i) => f + (st.to[i] - f) * st.t);
      setD(build(st.parts, cur));
      st.raf = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(st.raf);
  }, [target, reduced]);

  return d;
}
