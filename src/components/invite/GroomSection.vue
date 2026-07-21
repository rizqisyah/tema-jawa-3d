<script setup lang="ts">
// Per-asset groom section (Antonio). Every element its own layer — nothing baked.
import bg from "../../assets/invite/groom/parts/bg.png";
import florL from "../../assets/invite/groom/parts/florL.png";
import florR from "../../assets/invite/groom/parts/florR.png";
import portrait from "../../assets/invite/groom/parts/portrait.png";
import florC from "../../assets/invite/groom/parts/florC.png";
import divider from "../../assets/invite/groom/parts/divider.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×730) — placed inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "g-bg" },
  { src: florL, cls: "g-florL" },
  { src: florR, cls: "g-florR" },
  { src: portrait, cls: "g-portrait" },
  { src: florC, cls: "g-florC" },
];
</script>

<template>
  <section ref="el" class="groom" :class="{ shown }" aria-label="Mempelai pria — Antonio">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="groom__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 class="g-header">The Bride &amp;<br />The Groom</h2>

    <div class="groom__name">
      <p class="g-script">Antonio</p>
      <img class="g-div" :src="divider" alt="" aria-hidden="true" />
      <p class="g-full">Antonio Josua Setiyadi</p>
      <p class="g-parents">Putra Pertama dari Bapak Tono<br />&amp; Ibu Ratna</p>
    </div>
  </section>
</template>

<style scoped>
.groom {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 730;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(
    180deg,
    #b5a279 0%,
    #c1b183 16%,
    #d3c79c 34%,
    #e5ddc8 56%,
    #e8e1cd 100%
  );
}

.groom__layer {
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
.g-bg { z-index: 0; }
.g-florL { z-index: 1; }
.g-florR { z-index: 2; }
.g-portrait { z-index: 3; }
.g-florC { z-index: 4; }

/* --- live text --- */
.g-header {
  position: absolute;
  z-index: 5;
  top: 0.6%;
  left: 50%;
  transform: translateX(-50%);
  width: 88%;
  margin: 0;
  text-align: center;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 12.4cqw;
  line-height: 0.92;
  color: #fff;
  text-shadow: 0 1px 6px rgba(90, 60, 20, 0.45);
}

.groom__name {
  position: absolute;
  z-index: 5;
  top: 75.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  text-align: center;
  color: #905d2a;
}
.g-script {
  margin: 0;
  font-family: "Pinyon Script", cursive;
  font-size: 11cqw;
  line-height: 1;
  color: #8a5a28;
}
.g-div {
  display: block;
  width: 32%;
  margin: 0.6cqw auto 1.4cqw;
  opacity: 0;
}
.g-full {
  margin: 0 0 1.6cqw;
  font-family: Georgia, "Times New Roman", serif;
  font-variant: small-caps;
  letter-spacing: 0.06em;
  font-size: 5.4cqw;
  line-height: 1;
  color: #8a5a28;
}
.g-parents {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 4cqw;
  line-height: 1.45;
  color: #96693a;
}

/* ===== lebay, varied per-asset entrances, gated on scroll-in ===== */
.groom.shown .g-bg { animation: gFade 1.7s ease 0.05s both; }
.groom.shown .g-florL { transform-origin: 0 45%; animation: gFlyL 1.7s cubic-bezier(0.34,1.56,0.64,1) 0.9s both; }
.groom.shown .g-florR { transform-origin: 100% 45%; animation: gFlyR 1.7s cubic-bezier(0.34,1.56,0.64,1) 1.05s both; }
.groom.shown .g-portrait { transform-origin: 50% 100%; animation: gRisePortrait 1.6s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
.groom.shown .g-florC { transform-origin: 50% 100%; animation: gBloom 1.8s cubic-bezier(0.34,1.56,0.64,1) 1.3s both; }

.groom.shown .g-header { animation: gHeader 1.5s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
.groom.shown .g-script { animation: gName 1.3s cubic-bezier(0.16,1,0.3,1) 1.5s both; }
.groom.shown .g-div { animation: gDiv 0.9s ease 1.85s both; }
.groom.shown .g-full { animation: gRise 1.2s ease 2s both; }
.groom.shown .g-parents { animation: gRise 1.3s ease 2.2s both; }
.groom__name > :not(.g-div) { opacity: 0; }

@keyframes gFade { to { opacity: 1; } }
@keyframes gRisePortrait { 0% { opacity: 0; transform: translateY(12%) scale(0.94); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes gFlyL { 0% { opacity: 0; transform: translateX(-55%) rotate(-12deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes gFlyR { 0% { opacity: 0; transform: translateX(55%) rotate(12deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes gBloom { 0% { opacity: 0; transform: translateY(26%) scale(0.4) rotate(-8deg); } 55% { opacity: 1; transform: translateY(0) scale(1.12) rotate(3deg); } 100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); } }
@keyframes gHeader { 0% { opacity: 0; transform: translate(-50%, 40%) scale(0.9); filter: blur(7px); } 100% { opacity: 1; transform: translate(-50%, 0) scale(1); filter: blur(0); } }
@keyframes gName { 0% { opacity: 0; transform: translateY(30%) scale(0.85); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes gDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes gRise { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .groom__layer, .g-header, .groom__name > *, .groom__name > :not(.g-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
  .g-header { transform: translateX(-50%); }
  .groom__name { transform: translateX(-50%); }
}
</style>
