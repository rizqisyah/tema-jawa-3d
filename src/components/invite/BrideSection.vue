<script setup lang="ts">
// Per-asset bride section (Allysa). Every element its own layer — nothing baked.
import bg from "../../assets/invite/bride/parts/bg.png";
import florL from "../../assets/invite/bride/parts/florL.png";
import florR from "../../assets/invite/bride/parts/florR.png";
import portrait from "../../assets/invite/bride/parts/portrait.png";
import amp from "../../assets/invite/bride/parts/amp.png";
import divider from "../../assets/invite/bride/parts/divider.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×925) — placed inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "b-bg" },
  { src: florL, cls: "b-florL" },
  { src: florR, cls: "b-florR" },
  { src: portrait, cls: "b-portrait" },
];
</script>

<template>
  <section ref="el" class="bride" :class="{ shown }" aria-label="Mempelai wanita — Allysa">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="bride__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <div class="bride__amp">
      <img class="b-amp" :src="amp" alt="dan" />
    </div>

    <div class="bride__name">
      <p class="b-script">Allysa</p>
      <img class="b-div" :src="divider" alt="" aria-hidden="true" />
      <p class="b-full">Ayu Shella Pratni</p>
      <p class="b-parents">Putri Pertama dari Bapak Heri<br />&amp; Ibu Sofie</p>
    </div>
  </section>
</template>

<style scoped>
.bride {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 925;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  /* pale cream — top matches the groom section's cream bottom for a seamless join */
  background: linear-gradient(180deg, #e8e1cd 0%, #ddd5c1 42%, #e1dac7 100%);
}

.bride__layer {
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

/* z-order back → front — florals behind the portrait so the palm never covers her face */
.b-bg { z-index: 0; }
.b-florL { z-index: 1; }
.b-florR { z-index: 2; }
.b-portrait { z-index: 3; }

/* --- ornate "&" ampersand, top-center (the design's calligraphic glyph, no frame) --- */
.bride__amp {
  position: absolute;
  z-index: 5;
  top: 6.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 22%;
}
.b-amp {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
}

/* --- live name block --- */
.bride__name {
  position: absolute;
  z-index: 6;
  top: 70.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  text-align: center;
  color: #905d2a;
}
.b-script {
  margin: 0;
  font-family: "Pinyon Script", cursive;
  font-size: 11cqw;
  line-height: 1;
  color: #8a5a28;
}
.b-div {
  display: block;
  width: 32%;
  margin: 0.6cqw auto 1.4cqw;
  opacity: 0;
}
.b-full {
  margin: 0 0 1.6cqw;
  font-family: Georgia, "Times New Roman", serif;
  font-variant: small-caps;
  letter-spacing: 0.06em;
  font-size: 5.4cqw;
  line-height: 1;
  color: #8a5a28;
}
.b-parents {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 4cqw;
  line-height: 1.45;
  color: #96693a;
}

/* ===== lebay, varied per-asset entrances, gated on scroll-in ===== */
.bride.shown .b-bg { animation: bFade 1.7s ease 0.05s both, bDrift 26s ease-in-out 2s infinite alternate; }
.bride.shown .b-florL { transform-origin: 0 45%; animation: bFlyL 1.7s cubic-bezier(0.34,1.56,0.64,1) 0.9s both, bSwayA 8s ease-in-out 3.2s infinite alternate; }
.bride.shown .b-florR { transform-origin: 100% 45%; animation: bFlyR 1.7s cubic-bezier(0.34,1.56,0.64,1) 1.05s both, bSwayB 8.6s ease-in-out 3.5s infinite alternate; }
.bride.shown .b-portrait { transform-origin: 50% 100%; animation: bRisePortrait 1.6s cubic-bezier(0.16,1,0.3,1) 0.5s both, bFloat 11s ease-in-out 3s infinite alternate; }

.bride.shown .b-amp { animation: bAmp 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

.bride.shown .b-script { animation: bName 1.3s cubic-bezier(0.16,1,0.3,1) 1.6s both; }
.bride.shown .b-div { animation: bDiv 0.9s ease 1.95s both; }
.bride.shown .b-full { animation: bRise 1.2s ease 2.1s both; }
.bride.shown .b-parents { animation: bRise 1.3s ease 2.3s both; }
.bride__name > :not(.b-div) { opacity: 0; }

@keyframes bFade { to { opacity: 1; } }
@keyframes bDrift { from { transform: scale(1) translateY(0); } to { transform: scale(1.04) translateY(-1%); } }
@keyframes bRisePortrait { 0% { opacity: 0; transform: translateY(12%) scale(0.94); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bFloat { from { transform: translateY(0); } to { transform: translateY(-1.2%); } }
@keyframes bFlyL { 0% { opacity: 0; transform: translateX(-55%) rotate(-12deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes bFlyR { 0% { opacity: 0; transform: translateX(55%) rotate(12deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes bAmp { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
@keyframes bName { 0% { opacity: 0; transform: translateY(30%) scale(0.85); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes bRise { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: translateY(0); } }
@keyframes bSwayA { from { transform: rotate(-0.7deg); } to { transform: rotate(0.7deg); } }
@keyframes bSwayB { from { transform: rotate(0.7deg); } to { transform: rotate(-0.7deg); } }

@media (prefers-reduced-motion: reduce) {
  .bride__layer, .b-amp, .bride__name > *, .bride__name > :not(.b-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
  .bride__name { transform: translateX(-50%); }
}
</style>
