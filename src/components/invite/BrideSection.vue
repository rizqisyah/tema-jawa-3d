<script setup lang="ts">
// Per-asset bride section (Allysa). Every element its own layer — nothing baked.
import bg from "../../assets/invite/bride/parts/bg.png";
import flor from "../../assets/invite/bride/parts/flor.png";
import florFront from "../../assets/invite/bride/parts/florFront.png";
import front from "../../assets/invite/bride/parts/front.png";
import portrait from "../../assets/invite/bride/parts/portrait.png";
import amp from "../../assets/invite/bride/parts/amp.png";
import divider from "../../assets/invite/bride/parts/divider.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×925) — placed inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "b-bg" },
  { src: flor, cls: "b-flor" },
  { src: portrait, cls: "b-portrait" },
  { src: florFront, cls: "b-florFront" },
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
    <!-- florFront's export baked the front roses down to ~40% alpha (and left junk RGB in the
         faded band), so over the black kebaya they read washed out. This is the same rose
         cluster lifted opaque from the design, dropped straight in front by z-index — no mask,
         no opacity trick. Its edges land on the kebaya and foliage, so the join is invisible. -->
    <img class="bride__layer b-front" :src="front" alt="" aria-hidden="true" />

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

/* z-order back → front — the wreath sits OVER the kebaya in the original; behind the
   portrait it got clipped at her shoulder and left a visible rectangular seam */
.b-bg { z-index: 0; }
.b-flor { z-index: 1; }
.b-portrait { z-index: 2; }
.b-florFront { z-index: 3; }
/* opaque front rose cluster, placed by its design bounds (not full-frame like the others) */
.b-front {
  z-index: 4;
  inset: auto;
  left: 42%;
  top: 53.3%;
  width: 44%;
  height: auto;
  object-fit: fill;
}

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
.b-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.bride.shown .b-flor,
.bride.shown .b-front,
.bride.shown .b-florFront { transform-origin: 50% 100%; animation: bBloom 1.12s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.bride.shown .b-portrait { transform-origin: 50% 100%; animation: bRisePortrait 0.99s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

.bride.shown .b-amp { animation: bAmp 0.74s cubic-bezier(0.16,1,0.3,1) 0.12s both; }

.bride.shown .b-script { animation: bName 0.81s cubic-bezier(0.16,1,0.3,1) 0.64s both; }
.bride.shown .b-div { animation: bDiv 0.56s ease 0.78s both; }
.bride.shown .b-full { animation: bRise 0.74s ease 0.84s both; }
.bride.shown .b-parents { animation: bRise 0.81s ease 0.92s both; }
.bride__name > :not(.b-div) { opacity: 0; }

@keyframes bRisePortrait { 0% { opacity: 0; transform: translateY(12%) scale(0.94); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bBloom { 0% { opacity: 0; transform: translateY(6%) scale(1.06); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes bAmp { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
@keyframes bName { 0% { opacity: 0; transform: translateY(30%) scale(0.85); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes bRise { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .bride__layer, .b-amp, .bride__name > *, .bride__name > :not(.b-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
  .bride__name { transform: translateX(-50%); }
}
</style>
