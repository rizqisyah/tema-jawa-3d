<script setup lang="ts">
// Every element is its own asset — nothing baked into a flat bg.
import landscape1 from "../../assets/invite/hero/parts/landscape1.png";
import landscape2 from "../../assets/invite/hero/parts/landscape2.png";
import joglo from "../../assets/invite/hero/parts/joglo.png";
import frame from "../../assets/invite/hero/parts/frame.png";
import divider from "../../assets/invite/hero/parts/divider.png";
import tasselL from "../../assets/invite/hero/parts/tasselL.png";
import tasselR from "../../assets/invite/hero/parts/tasselR.png";
import couple from "../../assets/invite/hero/parts/couple.png";
import sealTop from "../../assets/invite/hero/parts/seal_top.png";
import tl from "../../assets/invite/hero/tl.png";
import tr from "../../assets/invite/hero/tr.png";
import bl from "../../assets/invite/hero/bl.png";
import br from "../../assets/invite/hero/br.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.05);
defineExpose({ el });

// hero band reference = 375 × 780 (Figma render units). Each asset placed by its bounds.
type Part = { src: string; cls: string; l: number; t: number; w: number };
const parts: Part[] = [
  { src: landscape1, cls: "p-land", l: -5.07, t: 2.18, w: 110.4 },
  { src: landscape2, cls: "p-land", l: -5.07, t: 84.1, w: 110.4 },
  // 157.3% blew the pavilion up until only its roof cleared the foliage; 108% still spilled
  // past the band and cropped the right wing. 100% (fit against the design) frames the whole
  // symmetric pavilion — both wings, chairs and the fountain in front
  { src: joglo, cls: "p-joglo", l: 0.4, t: 61.15, w: 100.0 },
  { src: frame, cls: "p-frame", l: 9.07, t: 10.0, w: 82.1 },
  { src: divider, cls: "p-div", l: 4.0, t: 83.7, w: 96.0 },
  { src: couple, cls: "p-couple", l: 15.2, t: 24.6, w: 69.6 },
  { src: sealTop, cls: "p-seal", l: 43.7, t: 22.1, w: 12.5 },
];

// tassels are rotated in Figma, so they ship as full-frame layers (exact placement)
const tassels = [
  { src: tasselL, cls: "t-l" },
  { src: tasselR, cls: "t-r" },
];

const florals = [
  { src: tl, cls: "f-tl" },
  { src: tr, cls: "f-tr" },
  { src: bl, cls: "f-bl" },
  { src: br, cls: "f-br" },
];
</script>

<template>
  <section ref="el" class="hero" :class="{ shown }" aria-label="Pembuka undangan">
    <img
      v-for="(p, i) in parts"
      :key="'p' + i"
      class="hero__part"
      :class="p.cls"
      :src="p.src"
      alt=""
      :style="{ left: p.l + '%', top: p.t + '%', width: p.w + '%' }"
    />

    <img
      v-for="t in tassels"
      :key="t.cls"
      class="hero__fl"
      :class="t.cls"
      :src="t.src"
      alt=""
      aria-hidden="true"
    />

    <img
      v-for="f in florals"
      :key="f.cls"
      class="hero__fl"
      :class="f.cls"
      :src="f.src"
      alt=""
      aria-hidden="true"
    />

  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 780;
  overflow: hidden;
  background: #e8e1ce;
  isolation: isolate;
}
/* fade the joglo/landscape tail into the pale backdrop the quote painting continues,
   so the hero→quote seam reads as one canvas (the original overlaps here) */
.hero::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 16%;
  z-index: 3;
  background: linear-gradient(180deg, rgba(222, 215, 194, 0) 0%, #ded7c2 82%);
  pointer-events: none;
}

.hero__part,
.hero__fl {
  position: absolute;
  max-width: none;
  height: auto;
  opacity: 0;
  will-change: transform, opacity;
}
.hero__fl {
  inset: 0;
  width: 100%;
  pointer-events: none;
}

/* z-order back → front */
.p-land { z-index: 0; }
.p-joglo { z-index: 1; }
.p-frame { z-index: 2; }
.p-div { z-index: 2; }
.t-l, .t-r { z-index: 3; }
.p-couple { z-index: 4; }
.p-seal { z-index: 5; }
.f-tl, .f-tr { z-index: 6; }
.f-bl, .f-br { z-index: 7; }

/* --- per-asset entrances, gated on scroll-in --- */
.p-land { opacity: 1; } /* base stays painted — no rectangle pop */
.hero.shown .p-joglo { animation: riseIn 0.93s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.hero.shown .p-frame { transform-origin: 50% 40%; animation: growIn 0.87s cubic-bezier(0.34,1.56,0.64,1) 0.32s both; }
.hero.shown .p-div { animation: fadeIn 0.74s ease 0.4s both; }
.hero.shown .t-l { transform-origin: 42% 13%; animation: swingL 0.87s cubic-bezier(0.34,1.56,0.64,1) 0.46s both; }
.hero.shown .t-r { transform-origin: 58% 13%; animation: swingR 0.87s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
.hero.shown .p-couple { transform-origin: 50% 45%; animation: bloomIn 0.93s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
.hero.shown .p-seal { transform-origin: 50% 50%; animation: popIn 0.62s cubic-bezier(0.34,1.56,0.64,1) 0.6s both; }

.hero.shown .f-tl { transform-origin: 0% 0%; animation: flTL 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.68s both; }
.hero.shown .f-tr { transform-origin: 100% 0%; animation: flTR 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.76s both; }
.hero.shown .f-bl { transform-origin: 0% 100%; animation: flBL 1.05s cubic-bezier(0.34,1.56,0.64,1) 0.86s both; }
.hero.shown .f-br { transform-origin: 100% 100%; animation: flBR 1.05s cubic-bezier(0.34,1.56,0.64,1) 0.94s both; }

@keyframes fadeIn { to { opacity: 1; } }
@keyframes riseIn { from { opacity: 0; transform: translateY(10%); } to { opacity: 1; transform: translateY(0); } }
@keyframes growIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes bloomIn { from { opacity: 0; transform: scale(0.8) translateY(4%); filter: blur(3px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
/* opacity MUST be restated at 100% — otherwise it interpolates back to the base opacity:0 */
@keyframes popIn { 0% { opacity: 0; transform: scale(0.3); } 60% { opacity: 1; transform: scale(1.35); } 100% { opacity: 1; transform: scale(1); } }
@keyframes swingL { from { opacity: 0; transform: translateY(-14%) rotate(-14deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
@keyframes swingR { from { opacity: 0; transform: translateY(-14%) rotate(14deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
@keyframes flTL { from { opacity: 0; transform: translate(-26%,-22%) rotate(-8deg) scale(1.06); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@keyframes flTR { from { opacity: 0; transform: translate(26%,-22%) rotate(8deg) scale(1.06); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@keyframes flBL { from { opacity: 0; transform: translate(-24%,26%) rotate(7deg) scale(1.05); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@keyframes flBR { from { opacity: 0; transform: translate(24%,26%) rotate(-7deg) scale(1.05); } to { opacity: 1; transform: translate(0,0) rotate(0) scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .hero__part, .hero__fl { animation: none !important; opacity: 1; transform: none; filter: none; }
}
</style>
