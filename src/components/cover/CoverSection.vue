<script setup lang="ts">
// Corner-split layers from Figma ("Cover depan", 375×725) as full-frame transparent
// PNGs. Each is placed at inset:0 (pixel-exact) and flies in from its own edge.
import scenery from "../../assets/cover/scenery.webp";
import mist from "../../assets/cover/cl/mist.webp";
import tl from "../../assets/cover/cl/tl.webp";
import tr from "../../assets/cover/cl/tr.webp";
import ml from "../../assets/cover/cl/ml.webp";
import mr from "../../assets/cover/cl/mr.webp";
import bl from "../../assets/cover/cl/bl.webp";
import br from "../../assets/cover/cl/br.webp";
import bc from "../../assets/cover/cl/bc.webp";

import { computed, ref, onMounted } from "vue";
import { useWedding } from "../../composables/useWedding";

const props = withDefaults(
  defineProps<{
    bride?: string;
    groom?: string;
    guestName?: string;
  }>(),
  { guestName: "Nama Tamu" }
);

const { bride: brideData, groom: groomData } = useWedding();

const brideName = computed(() => props.bride || brideData.value?.name?.split(' ')[0] || "Allysa");
const groomName = computed(() => props.groom || groomData.value?.name?.split(' ')[0] || "Antonio");

defineEmits<{ open: [] }>();

const isReady = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isReady.value = true;
    });
  });
});

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
    <section class="cover" :class="{ 'is-ready': isReady }" aria-label="Undangan pernikahan">
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
      <h1 class="cover__names">{{ brideName }}<br />&amp; {{ groomName }}</h1>

      <span class="cover__plate" aria-hidden="true" />
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
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: #c6d6da;
}

.cover {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 480px;
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
  transform: translateZ(0);
  will-change: transform, opacity;
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
}
.cover.is-ready .cover__scenery {
  animation: sceneIn 0.8s ease both, kenBurns 26s ease-in-out 0.8s infinite alternate;
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
}
.tl {
  z-index: 2;
  transform-origin: 0% 0%;
}
.tr {
  z-index: 3;
  transform-origin: 100% 0%;
}
.ml {
  z-index: 4;
  transform-origin: 0% 50%;
}
.mr {
  z-index: 5;
  transform-origin: 100% 50%;
}
.bl {
  z-index: 6;
  transform-origin: 0% 100%;
}
.br {
  z-index: 7;
  transform-origin: 100% 100%;
}
.bc {
  z-index: 8;
  transform-origin: 50% 100%;
}

.cover.is-ready .mist {
  animation-name: inMist, ambMist;
  animation-duration: 1.2s, 22s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 0.2s, 1.4s;
}
.cover.is-ready .tl {
  animation-name: inTL, ambTL;
  animation-duration: 0.9s, 18s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 0.45s, 1.4s;
}
.cover.is-ready .tr {
  animation-name: inTR, ambTR;
  animation-duration: 0.9s, 19s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 0.7s, 1.6s;
}
.cover.is-ready .ml {
  animation-name: inML, ambML;
  animation-duration: 0.9s, 20s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 0.95s, 1.85s;
}
.cover.is-ready .mr {
  animation-name: inMR, ambMR;
  animation-duration: 0.9s, 21s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 1.2s, 2.1s;
}
.cover.is-ready .bl {
  animation-name: inBL, ambBL;
  animation-duration: 0.9s, 22s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 1.45s, 2.35s;
}
.cover.is-ready .br {
  animation-name: inBR, ambBR;
  animation-duration: 0.9s, 23s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 1.7s, 2.6s;
}
.cover.is-ready .bc {
  animation-name: inBC, ambBC;
  animation-duration: 0.9s, 24s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1), cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
  animation-delay: 1.95s, 2.85s;
}

@keyframes sceneIn { to { opacity: 1; } }
@keyframes kenBurns {
  from { transform: scale(1); }
  to { transform: scale(1.07) translateY(-1%); }
}

@keyframes inMist {
  from { opacity: 0; filter: blur(10px); transform: scale(1.04); }
  to { opacity: 0.62; filter: blur(0); transform: scale(1); }
}
@keyframes inTL {
  from { opacity: 0; filter: blur(4px); transform: translate(-8%, -8%) rotate(-3deg) scale(1.02); }
  to { opacity: 1; filter: blur(0); transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes inTR {
  from { opacity: 0; filter: blur(4px); transform: translate(8%, -8%) rotate(3deg) scale(1.02); }
  to { opacity: 1; filter: blur(0); transform: translate(0, 0) rotate(0) scale(1); }
}
@keyframes inML {
  from { opacity: 0; filter: blur(4px); transform: translateX(-10%) rotate(-2deg); }
  to { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); }
}
@keyframes inMR {
  from { opacity: 0; filter: blur(4px); transform: translateX(10%) rotate(2deg); }
  to { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); }
}
@keyframes inBL {
  from { opacity: 0; filter: blur(4px); transform: translate(-8%, 10%) rotate(2deg); }
  to { opacity: 1; filter: blur(0); transform: translate(0, 0) rotate(0); }
}
@keyframes inBR {
  from { opacity: 0; filter: blur(4px); transform: translate(8%, 10%) rotate(-2deg); }
  to { opacity: 1; filter: blur(0); transform: translate(0, 0) rotate(0); }
}
@keyframes inBC {
  from { opacity: 0; filter: blur(4px); transform: translateY(12%) scale(1.02); }
  to { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
}

/* ambient wind floating */
@keyframes ambMist {
  from { transform: translateX(-1%) scale(1.01); opacity: 0.55; }
  to { transform: translateX(1%) scale(1.03); opacity: 0.65; }
}
@keyframes ambTL {
  from { transform: rotate(-0.5deg) translate(0, 0); }
  to { transform: rotate(0.4deg) translate(1px, -1px); }
}
@keyframes ambTR {
  from { transform: rotate(0.5deg) translate(0, 0); }
  to { transform: rotate(-0.4deg) translate(-1px, -1px); }
}
@keyframes ambML {
  from { transform: translateX(-0.4%) rotate(-0.3deg); }
  to { transform: translateX(0.4%) rotate(0.3deg); }
}
@keyframes ambMR {
  from { transform: translateX(0.4%) rotate(0.3deg); }
  to { transform: translateX(-0.4%) rotate(-0.3deg); }
}
@keyframes ambBL {
  from { transform: rotate(0.4deg) translateY(0.2%); }
  to { transform: rotate(-0.3deg) translateY(-0.2%); }
}
@keyframes ambBR {
  from { transform: rotate(-0.4deg) translateY(0.2%); }
  to { transform: rotate(0.3deg) translateY(-0.2%); }
}
@keyframes ambBC {
  from { transform: translateY(0.3%) scale(1); }
  to { transform: translateY(-0.3%) scale(1.01); }
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
}
.cover.is-ready .cover__sparkle {
  animation: twinkle var(--sd) ease-in-out calc(2.4s + var(--sdelay)) infinite;
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
}
.cover.is-ready .cover__prefix {
  animation: swoopUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 2.25s both;
}

.cover__names {
  top: 22.9%;
  font-family: var(--font-script);
  font-weight: 400;
  font-size: 17.07cqw;
  line-height: 13.87cqw;
  opacity: 0;
}
.cover.is-ready .cover__names {
  animation:
    nameBloom 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 2.55s both,
    nameGlow 4s ease-in-out 3.5s infinite alternate;
}

/* the drifting mist alone left the greeting sitting on the dark joglo interior; a defined
   light plate behind just this block is what makes the guest name legible */
.cover__plate {
  position: absolute;
  left: 50%;
  top: 65.4%;
  transform: translateX(-50%);
  width: 78%;
  height: 11%;
  z-index: 39;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 252, 244, 0.92) 0%,
    rgba(255, 252, 244, 0.72) 45%,
    rgba(255, 252, 244, 0) 72%
  );
  pointer-events: none;
  opacity: 0;
}
.cover.is-ready .cover__plate {
  animation: fadeUp 0.7s ease 2.9s both;
}

.cover__dear {
  top: 67%;
  font-family: var(--font-hand);
  font-size: 3.73cqw;
  color: var(--maroon-text);
  opacity: 0;
}
.cover.is-ready .cover__dear {
  animation: fadeUp 0.7s ease 3.15s both;
}

.cover__guest {
  top: 70.3%;
  font-family: var(--font-hand);
  font-size: 5.33cqw;
  color: var(--maroon-text);
  opacity: 0;
}
.cover.is-ready .cover__guest {
  animation: fadeUp 0.7s ease 3.4s both;
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
  transition: box-shadow 0.15s ease;
}
.cover.is-ready .cover__open {
  animation: fadeUp 0.7s ease 3.75s both, pulse 2.8s ease-in-out 4.75s infinite;
}
.cover.is-ready .cover__open::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: shimmer 3.4s ease-in-out 4.75s infinite;
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
