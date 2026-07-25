<script setup lang="ts">
// Per-asset quote section (QS Ar-Rum 21). Every element its own layer — nothing baked.
import bg from "../../assets/invite/quote/parts/bg.png";
import seambridge from "../../assets/invite/quote/parts/seambridge.png";
import trees from "../../assets/invite/quote/parts/trees.png";
import oval from "../../assets/invite/quote/parts/oval.png";
import ivyL from "../../assets/invite/quote/parts/ivyL.png";
import ivyR from "../../assets/invite/quote/parts/ivyR.png";
import mumL from "../../assets/invite/quote/parts/mumL.png";
import mumR from "../../assets/invite/quote/parts/mumR.png";
import seal from "../../assets/invite/quote/parts/seal.png";
import divider from "../../assets/invite/quote/parts/divider.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×585) — placed at inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "q-bg" },
  { src: trees, cls: "q-trees" },
  { src: oval, cls: "q-oval" },
  { src: divider, cls: "q-div" },
  { src: ivyL, cls: "q-ivyL" },
  { src: ivyR, cls: "q-ivyR" },
  { src: mumL, cls: "q-mumL" },
  { src: mumR, cls: "q-mumR" },
];

const arabic =
  "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ";
const translation =
  "“Di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda kebesaran Allah bagi kaum yang berpikir.”";
</script>

<template>
  <section ref="el" class="quote" :class="{ shown }" aria-label="Kutipan QS Ar-Rum 21">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="quote__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />
    <!-- Hero is 80px taller than the design's, so the coral trees that flank this oval get
         split across the band edge and their tops read as cut-off branches. This strip carries
         the trees' edge columns down from the hero join (feathered into ours below), closing
         the gap. Edges only — the oval, seal and text stay live. -->
    <img class="q-seam" :src="seambridge" alt="" aria-hidden="true" />
    <!-- hero's flat cream bottom meets this band's cloudier scene at the join, leaving a faint
         horizontal step; this cream fade lifts the cloud back to the cream and melts the line -->
    <span class="q-seamblend" aria-hidden="true" />

    <!-- wax seal exported per-node (the band crop clipped its top) -->
    <img class="q-seal" :src="seal" alt="" aria-hidden="true" />

    <div class="quote__text">
      <h2 class="q-title">QS Ar-Rum 21</h2>
      <p class="q-arabic" dir="rtl" lang="ar">{{ arabic }}</p>
      <p class="q-transl">{{ translation }}</p>
    </div>
  </section>
</template>

<style scoped>
.quote {
  position: relative;
  width: 100%;
  /* bg + trees are re-exported at the taller 375/665 band (rel700-1365) so the
     top breathing room after hero is filled with real scenery/foliage, not a flat band */
  aspect-ratio: 375 / 665;
  overflow: hidden;
  background: linear-gradient(180deg, #ded7c2 0%, #cdb98f 16%, #b0975f 64%, #b5a279 100%);
  isolation: isolate;
  container-type: inline-size;
}

.quote__layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto; /* 375×585 art keeps aspect, anchored to bottom; top 63u is spacer */
  max-width: none;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

/* z-order back → front */
/* bg + trees are the taller 375/665 crops → fill the whole section (spacer included);
   every other layer is the 375/585 art anchored to the bottom */
.q-bg, .q-trees { top: 0; bottom: 0; height: 100%; z-index: 0; }
.q-trees { z-index: 1; }
/* cream fade over the band-top cloud, melts the horizontal tone step at the hero join */
.q-seamblend {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 7%;
  pointer-events: none;
  background: linear-gradient(180deg, #ded7c2 0%, rgba(222, 215, 194, 0.5) 35%, transparent 100%);
}
/* coral-tree seam bridge — edge columns only, at the hero join (band-local top) */
.q-seam {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 6.02%;
  max-width: none;
  object-fit: fill;
  opacity: 1;
  pointer-events: none;
}
/* foliage sits BEHIND the oval — it reads through the frame's translucent fill,
   as in the original. In front it crops the gold ring and looks pasted on. */
.q-ivyL, .q-ivyR { z-index: 2; }
.q-mumL, .q-mumR { z-index: 3; }
.q-oval { z-index: 4; }
.q-div { z-index: 5; }
/* per-node export, placed by its Figma bounds (x164 y772 47×47 in the rel700–1365 band) */
.q-seal {
  position: absolute;
  z-index: 7;
  left: 43.733%;
  top: 10.827%;
  width: 12.533%;
  height: auto;
  max-width: none;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

/* --- live text overlay, sits inside the oval --- */
.quote__text {
  position: absolute;
  z-index: 6;
  top: 24.8%;
  left: 50%;
  transform: translateX(-50%);
  width: 46%;
  text-align: center;
  color: #905d2a;
}
.q-title {
  margin: 0 0 2.4cqw;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 8cqw;
  line-height: 1;
  color: #8a5a28;
}
.q-arabic {
  margin: 0 0 2.8cqw;
  font-family: "Amiri", "Scheherazade New", "Traditional Arabic", serif;
  font-size: 3cqw;
  line-height: 1.8;
}
.q-transl {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2.5cqw;
  line-height: 1.45;
}

/* ===== lebay, varied per-asset entrances, gated on scroll-in ===== */
.q-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.quote.shown .q-trees { transform-origin: 50% 0; animation: qDropTop 0.93s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
.quote.shown .q-oval { transform-origin: 50% 50%; animation: qOval 1.05s cubic-bezier(0.34,1.56,0.64,1) 0.14s both; }
.quote.shown .q-seal { transform-origin: 50% 0; animation: qSeal 0.81s cubic-bezier(0.34,1.7,0.5,1) 0.6s both; }
.quote.shown .q-div { transform-origin: 50% 50%; animation: qDiv 0.62s ease 0.76s both; }

.quote.shown .q-ivyL { transform-origin: 0 40%; animation: qFlyL 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.36s both; }
.quote.shown .q-ivyR { transform-origin: 100% 40%; animation: qFlyR 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.42s both; }
.quote.shown .q-mumL { transform-origin: 20% 100%; animation: qMumL 1.05s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
.quote.shown .q-mumR { transform-origin: 80% 100%; animation: qMumR 1.05s cubic-bezier(0.34,1.56,0.64,1) 0.56s both; }

.quote.shown .q-title { animation: qTitle 0.81s cubic-bezier(0.16,1,0.3,1) 0.64s both; }
.quote.shown .q-arabic { animation: qRise 0.81s ease 0.8s both; }
.quote.shown .q-transl { animation: qRise 0.87s ease 0.92s both; }
.quote__text > * { opacity: 0; }
.quote.shown .quote__text > * { will-change: transform, opacity; }

@keyframes qDropTop { from { opacity: 0; transform: translateY(-30%) scale(1.04); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes qOval { 0% { opacity: 0; transform: scale(0.72) rotate(-6deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes qSeal { 0% { opacity: 0; transform: translateY(-140%) rotate(-18deg) scale(0.7); } 60% { opacity: 1; transform: translateY(8%) rotate(4deg) scale(1.08); } 100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); } }
@keyframes qDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes qFlyL { 0% { opacity: 0; transform: translateX(-18%) rotate(-5deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes qFlyR { 0% { opacity: 0; transform: translateX(18%) rotate(5deg) scale(1.05); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes qMumL { 0% { opacity: 0; transform: translate(-30%,40%) scale(0.35) rotate(-16deg); } 55% { opacity: 1; transform: translate(0,0) scale(1.16) rotate(4deg); } 100% { opacity: 1; transform: translate(0,0) scale(1) rotate(0); } }
@keyframes qMumR { 0% { opacity: 0; transform: translate(30%,40%) scale(0.35) rotate(16deg); } 55% { opacity: 1; transform: translate(0,0) scale(1.16) rotate(-4deg); } 100% { opacity: 1; transform: translate(0,0) scale(1) rotate(0); } }
@keyframes qTitle { 0% { opacity: 0; transform: translateY(24%) scale(0.9); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes qRise { from { opacity: 0; transform: translateY(14%); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .quote__layer, .q-seal, .quote__text > * { animation: none !important; opacity: 1; transform: none; filter: none; }
}
</style>
