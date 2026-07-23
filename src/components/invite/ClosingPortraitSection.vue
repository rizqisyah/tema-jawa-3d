<script setup lang="ts">
// Per-asset closing portrait band: oval couple frame, wax seal, wayang figures, flower bed.
import bg from "../../assets/invite/closing/parts/bg.png";
import portrait from "../../assets/invite/closing/parts/portrait.png";
import florL from "../../assets/invite/closing/parts/florL.png";
import florR from "../../assets/invite/closing/parts/florR.png";
import seal from "../../assets/invite/closing/parts/seal.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×640, Figma rel 7470–8110) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "c-bg" },
  { src: portrait, cls: "c-portrait" },
  { src: florL, cls: "c-florL" },
  { src: florR, cls: "c-florR" },
];
</script>

<template>
  <section ref="el" class="closing" :class="{ shown }" aria-label="Potret mempelai">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="closing__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />
    <!-- per-node export, placed by its Figma bounds (x147 y7841 79×79) -->
    <img class="c-seal" :src="seal" alt="" aria-hidden="true" />
  </section>
</template>

<style scoped>
.closing {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 640;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #e3ddc6 0%, #e7e1cb 55%, #cfc9a8 100%);
}

.closing__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: none;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

/* z-order back → front */
.c-bg { z-index: 0; }
.c-portrait { z-index: 1; }
.c-florL, .c-florR { z-index: 3; }

.c-seal {
  position: absolute;
  z-index: 2;
  left: 39.2%;
  top: 57.97%;
  width: 21.07%;
  height: auto;
  max-width: none;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

/* ===== per-asset entrances, gated on scroll-in ===== */
.c-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.closing.shown .c-portrait { transform-origin: 50% 40%; animation: clPortrait 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.16s both; }
.closing.shown .c-florL { transform-origin: 0 60%; animation: clFlyL 1.12s cubic-bezier(0.34,1.56,0.64,1) 0.34s both; }
.closing.shown .c-florR { transform-origin: 100% 60%; animation: clFlyR 1.12s cubic-bezier(0.34,1.56,0.64,1) 0.4s both; }
.closing.shown .c-seal { transform-origin: 50% 0; animation: clSeal 0.74s cubic-bezier(0.34,1.7,0.5,1) 0.56s both; }

@keyframes clPortrait { 0% { opacity: 0; transform: scale(0.8) rotate(-2deg); filter: blur(4px); } 100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); } }
@keyframes clFlyL { 0% { opacity: 0; transform: translateX(-18%) rotate(-5deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes clFlyR { 0% { opacity: 0; transform: translateX(18%) rotate(5deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes clSeal { 0% { opacity: 0; transform: translateY(-150%) rotate(-16deg) scale(0.6); } 62% { opacity: 1; transform: translateY(8%) rotate(4deg) scale(1.1); } 100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .closing__layer, .c-seal { animation: none !important; opacity: 1; transform: none; filter: none; }
}
</style>
