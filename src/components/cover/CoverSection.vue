<script setup lang="ts">
// Corner-split layers from Figma ("Cover depan", 375×725) as full-frame transparent
// PNGs. Each is placed at inset:0 (pixel-exact) and flies in from its own edge.
import scenery from "../../assets/cover/scenery.png";
import mist from "../../assets/cover/cl/mist.png";
import tl from "../../assets/cover/cl/tl.png";
import tr from "../../assets/cover/cl/tr.png";
import ml from "../../assets/cover/cl/ml.png";
import mr from "../../assets/cover/cl/mr.png";
import bl from "../../assets/cover/cl/bl.png";
import br from "../../assets/cover/cl/br.png";
import bc from "../../assets/cover/cl/bc.png";

withDefaults(
  defineProps<{
    bride?: string;
    groom?: string;
    guestName?: string;
  }>(),
  { bride: "Anna", groom: "Tono", guestName: "Nama Tamu" }
);

defineEmits<{ open: [] }>();

// each floral layer: image, css class, entrance delay (s)
const layers = [
  { src: mist, cls: "mist", delay: 0.2 },
  { src: tl, cls: "tl", delay: 0.5 },
  { src: tr, cls: "tr", delay: 0.68 },
  { src: ml, cls: "ml", delay: 0.9 },
  { src: mr, cls: "mr", delay: 1.08 },
  { src: bl, cls: "bl", delay: 1.32 },
  { src: br, cls: "br", delay: 1.5 },
  { src: bc, cls: "bc", delay: 1.72 },
];

const sparkles = [
  { x: 22, y: 30, d: 2.6 },
  { x: 74, y: 26, d: 3.4 },
  { x: 15, y: 55, d: 3.0 },
  { x: 86, y: 52, d: 2.2 },
  { x: 50, y: 20, d: 3.8 },
  { x: 66, y: 62, d: 2.9 },
];
</script>

<template>
  <div class="cover-viewport">
    <section class="cover" aria-label="Undangan pernikahan">
      <img class="cover__scenery" :src="scenery" alt="" />

      <img
        v-for="l in layers"
        :key="l.cls"
        class="cover__layer"
        :class="l.cls"
        :src="l.src"
        alt=""
      />

      <span
        v-for="(s, i) in sparkles"
        :key="i"
        class="cover__sparkle"
        :style="{
          left: s.x + '%',
          top: s.y + '%',
          '--sd': s.d + 's',
          '--sdelay': 1.8 + i * 0.4 + 's',
        }"
      />

      <p class="cover__prefix">The Wedding Of</p>
      <h1 class="cover__names">{{ bride }}<br />&amp; {{ groom }}</h1>

      <p class="cover__dear">Dear Mr / Mrs / Ms</p>
      <p class="cover__guest">{{ guestName }}</p>

      <button class="cover__open" type="button" @click="$emit('open')">
        Open Invitation
      </button>
    </section>
  </div>
</template>

<style scoped>
.cover-viewport {
  width: 100vw;
  min-height: 100dvh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: #c6d6da;
}

.cover {
  position: relative;
  height: 100dvh;
  aspect-ratio: 375 / 725;
  container-type: inline-size;
  color: var(--maroon-title);
  text-align: center;
  overflow: hidden;
  background: #c6d6da;
}

.cover__scenery,
.cover__layer {
  position: absolute;
  max-width: none;
}

/* scenery: fade + perpetual ken-burns */
.cover__scenery {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
  z-index: 0;
  transform-origin: 50% 30%;
  opacity: 0;
  animation: sceneIn 2s ease both, kenBurns 26s ease-in-out 2s infinite alternate;
}

.cover__layer {
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity, filter;
  animation-fill-mode: both;
}

/* Each corner flies in from its own edge, then settles into a gentle ambient sway.
   entrance uses a bespoke keyframe; ambient is a second animation starting after it. */
.mist {
  z-index: 1;
  transform-origin: 50% 40%;
  animation-name: inMist, ambMist;
  animation-duration: 2.6s, 15s;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.tl {
  z-index: 2;
  transform-origin: 0% 0%;
  animation-name: inTL, ambTL;
  animation-duration: 1.6s, 7s;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1), ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.tr {
  z-index: 3;
  transform-origin: 100% 0%;
  animation-name: inPop, ambTR;
  animation-duration: 1.5s, 7.6s;
  animation-timing-function: ease-out, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.ml {
  z-index: 4;
  transform-origin: 0% 50%;
  animation-name: inML, ambML;
  animation-duration: 1.7s, 8s;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.mr {
  z-index: 5;
  transform-origin: 100% 50%;
  animation-name: inPop, ambMR;
  animation-duration: 1.6s, 8.6s;
  animation-timing-function: ease-out, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.bl {
  z-index: 6;
  transform-origin: 0% 100%;
  animation-name: inBL, ambBL;
  animation-duration: 1.8s, 9s;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.br {
  z-index: 7;
  transform-origin: 100% 100%;
  animation-name: inPop, ambBR;
  animation-duration: 1.7s, 9.6s;
  animation-timing-function: ease-out, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
.bc {
  z-index: 8;
  transform-origin: 50% 100%;
  animation-name: inBC, ambBC;
  animation-duration: 1.9s, 7.4s;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
/* ambient loops start after the entrance settles (delay = entrance delay + duration) */
.mist { animation-delay: 0.2s, 2.8s; }
.tl   { animation-delay: 0.5s, 2.1s; }
.tr   { animation-delay: 0.68s, 2.3s; }
.ml   { animation-delay: 0.9s, 2.6s; }
.mr   { animation-delay: 1.08s, 2.8s; }
.bl   { animation-delay: 1.32s, 3.1s; }
.br   { animation-delay: 1.5s, 3.3s; }
.bc   { animation-delay: 1.72s, 3.6s; }

@keyframes sceneIn { to { opacity: 1; } }
@keyframes kenBurns {
  from { transform: scale(1); }
  to { transform: scale(1.07) translateY(-1%); }
}

@keyframes inMist {
  from { opacity: 0; filter: blur(12px); transform: scale(1.08); }
  to { opacity: 1; filter: blur(0); transform: scale(1); }
}
@keyframes inTL {
  from { opacity: 0; transform: translate(-16%, -14%) rotate(-6deg) scale(1.05); }
  to { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes inTR {
  from { opacity: 0; transform: translate(16%, -14%) rotate(6deg) scale(1.05); }
  to { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes inML {
  from { opacity: 0; transform: translateX(-22%) rotate(-4deg); }
  to { opacity: 1; transform: translateX(0) rotate(0); }
}
@keyframes inMR {
  from { opacity: 0; transform: translateX(22%) rotate(4deg); }
  to { opacity: 1; transform: translateX(0) rotate(0); }
}
@keyframes inBL {
  from { opacity: 0; transform: translate(-14%, 20%) rotate(5deg); }
  to { opacity: 1; transform: translate(0, 0) rotate(0); }
}
@keyframes inBR {
  from { opacity: 0; transform: translate(14%, 20%) rotate(-5deg); }
  to { opacity: 1; transform: translate(0, 0) rotate(0); }
}
@keyframes inBC {
  from { opacity: 0; transform: translateY(24%) scale(1.03); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
/* bounce-scale pop (right side): small → grow big (2.0) + tilt inward → settle to normal.
   origin sits on the right edge so it blooms toward the centre. */
@keyframes inPop {
  0% { opacity: 0; transform: scale(0.3) rotate(0deg); }
  55% { opacity: 1; transform: scale(2) rotate(-10deg); }
  78% { transform: scale(0.92) rotate(3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

/* ambient sways — each slightly different so nothing moves in lockstep */
@keyframes ambMist {
  from { transform: translateX(-1.5%) scale(1.02); opacity: 0.9; }
  to { transform: translateX(2%) scale(1.05); opacity: 1; }
}
@keyframes ambTL {
  from { transform: rotate(-0.9deg); } to { transform: rotate(0.5deg); }
}
@keyframes ambTR {
  from { transform: rotate(0.9deg); } to { transform: rotate(-0.5deg); }
}
@keyframes ambML {
  from { transform: translateX(-0.6%) rotate(-0.5deg); }
  to { transform: translateX(0.6%) rotate(0.5deg); }
}
@keyframes ambMR {
  from { transform: translateX(0.6%) rotate(0.5deg); }
  to { transform: translateX(-0.6%) rotate(-0.5deg); }
}
@keyframes ambBL {
  from { transform: rotate(0.7deg) translateY(0.3%); }
  to { transform: rotate(-0.4deg) translateY(-0.3%); }
}
@keyframes ambBR {
  from { transform: rotate(-0.7deg) translateY(0.3%); }
  to { transform: rotate(0.4deg) translateY(-0.3%); }
}
@keyframes ambBC {
  from { transform: translateY(0.4%) scale(1); }
  to { transform: translateY(-0.4%) scale(1.01); }
}

/* sparkles */
.cover__sparkle {
  position: absolute;
  z-index: 9;
  width: 2.4cqw;
  height: 2.4cqw;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, rgba(255, 245, 210, 0.9) 40%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  animation: twinkle var(--sd) ease-in-out var(--sdelay) infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50% { opacity: 0.95; transform: scale(1.2); }
}

/* text overlay */
.cover__prefix,
.cover__names,
.cover__dear,
.cover__guest,
.cover__open {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  width: 100%;
  z-index: 40;
}

.cover__prefix {
  top: 17.9%;
  font-family: var(--font-script);
  font-size: 5.33cqw;
  line-height: 10.13cqw;
  opacity: 0;
  animation: swoopUp 1.3s cubic-bezier(0.16, 1, 0.3, 1) 2.1s both;
}
.cover__names {
  top: 22.9%;
  font-family: var(--font-script);
  font-weight: 400;
  font-size: 17.07cqw;
  line-height: 13.87cqw;
  opacity: 0;
  animation:
    nameBloom 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) 2.35s both,
    nameGlow 4s ease-in-out 4.2s infinite alternate;
}
.cover__dear {
  top: 67%;
  font-family: var(--font-hand);
  font-size: 3.73cqw;
  color: var(--maroon-text);
  opacity: 0;
  animation: fadeUp 1.2s ease 2.8s both;
}
.cover__guest {
  top: 70.3%;
  font-family: var(--font-hand);
  font-size: 5.33cqw;
  color: var(--maroon-text);
  opacity: 0;
  animation: fadeUp 1.2s ease 3s both;
}

@keyframes swoopUp {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes nameBloom {
  from { opacity: 0; transform: translateX(-50%) scale(0.7); filter: blur(4px); }
  to { opacity: 1; transform: translateX(-50%) scale(1); filter: blur(0); }
}
@keyframes nameGlow {
  from { text-shadow: 0 0 0 rgba(144, 2, 2, 0); }
  to { text-shadow: 0 2px 18px rgba(144, 2, 2, 0.35); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.cover__open {
  top: 75.2%;
  width: 44.27%;
  aspect-ratio: 166 / 44;
  border: 0;
  border-radius: 3.73cqw;
  background: var(--gold);
  color: var(--maroon-text);
  font-family: var(--font-hand);
  font-size: 5.33cqw;
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  animation: fadeUp 1.2s ease 3.25s both, pulse 2.8s ease-in-out 4.6s infinite;
  transition: box-shadow 0.15s ease;
}
.cover__open::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: shimmer 3.4s ease-in-out 4.6s infinite;
}
.cover__open:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28); }
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(144, 2, 2, 0.28); }
  50% { box-shadow: 0 0 0 6px rgba(144, 2, 2, 0); }
}
@keyframes shimmer {
  0% { transform: translateX(-120%); }
  35%, 100% { transform: translateX(120%); }
}

@media (prefers-reduced-motion: reduce) {
  .cover__scenery,
  .cover__layer,
  .cover__sparkle,
  .cover__prefix,
  .cover__names,
  .cover__dear,
  .cover__guest,
  .cover__open,
  .cover__open::after {
    animation: none !important;
    opacity: 1;
    filter: none;
    transform: none;
  }
  .cover__sparkle { opacity: 0; }
  .cover__prefix,
  .cover__names,
  .cover__dear,
  .cover__guest,
  .cover__open {
    transform: translateX(-50%);
  }
}
</style>
