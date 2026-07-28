<script setup lang="ts">
// Per-asset closing portrait band: oval couple frame, wax seal, wayang figures, flower bed.
import bg from "../../assets/invite/closing/parts/bg.webp";
import portrait from "../../assets/invite/closing/parts/portrait.webp";
import florL from "../../assets/invite/closing/parts/florL.webp";
import florR from "../../assets/invite/closing/parts/florR.webp";
import seal from "../../assets/invite/closing/parts/seal.webp";
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
  overflow: visible;
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
.c-bg { z-index: 0; opacity: 1; }
.c-portrait { z-index: 1; }
.c-seal { z-index: 2; }
.c-florL, .c-florR { z-index: 10; }

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

/* ===== Sequential 1-by-1 Slow Elegant Entrance Animations ===== */
.closing.shown .c-portrait {
  animation: clPortraitSlow 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.closing.shown .c-seal {
  animation: clSealSlow 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.closing.shown .c-florL {
  animation: clFlyLSlow 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both;
}

.closing.shown .c-florR {
  animation: clFlyRSlow 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1.15s both;
}

@keyframes clPortraitSlow {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes clSealSlow {
  0% {
    opacity: 0;
    transform: translateY(-28px) scale(0.7) rotate(-10deg);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes clFlyLSlow {
  0% {
    opacity: 0;
    transform: translateX(-15%) translateY(12px) rotate(-3deg);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes clFlyRSlow {
  0% {
    opacity: 0;
    transform: translateX(15%) translateY(12px) rotate(3deg);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .closing__layer, .c-seal {
    animation: none !important;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
