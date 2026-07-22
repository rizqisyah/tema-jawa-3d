<script setup lang="ts">
// Per-asset gallery section. Backdrop/florals are art; the photo carousel is live DOM.
import { computed, ref } from "vue";
import bg from "../../assets/invite/gallery/parts/bg.png";
import florL from "../../assets/invite/gallery/parts/florL.png";
import florR from "../../assets/invite/gallery/parts/florR.png";
import main from "../../assets/invite/gallery/parts/main.png";
import t1 from "../../assets/invite/gallery/parts/t1.png";
import t2 from "../../assets/invite/gallery/parts/t2.png";
import t3 from "../../assets/invite/gallery/parts/t3.png";
import t4 from "../../assets/invite/gallery/parts/t4.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×835, Figma rel 6070–6905) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "gl-bg" },
  { src: florL, cls: "gl-florL" },
  { src: florR, cls: "gl-florR" },
];

// the template ships the same shot in every slot; swap these for the real set
const photos = [main, t1, t2, t3, t4];
const active = ref(0);
const current = computed(() => photos[active.value]);

const step = (delta: number) => {
  active.value = (active.value + delta + photos.length) % photos.length;
};
</script>

<template>
  <section ref="el" class="gallery" :class="{ shown }" aria-labelledby="gallery-title">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="gallery__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 id="gallery-title" class="gl-title">Gallery</h2>

    <img class="gl-main" :src="current" alt="Foto mempelai" />

    <button class="gl-nav gl-prev" type="button" aria-label="Foto sebelumnya" @click="step(-1)">
      <span aria-hidden="true">‹</span>
    </button>
    <button class="gl-nav gl-next" type="button" aria-label="Foto berikutnya" @click="step(1)">
      <span aria-hidden="true">›</span>
    </button>

    <div class="gl-thumbs">
      <button
        v-for="(p, i) in photos.slice(1)"
        :key="i"
        class="gl-thumb"
        :class="{ on: active === i + 1 }"
        type="button"
        :aria-label="`Lihat foto ${i + 2}`"
        :aria-pressed="active === i + 1"
        @click="active = i + 1"
      >
        <img :src="p" alt="" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 835;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #d6c9a4 0%, #ded4b4 46%, #b6bf8e 100%);
}

.gallery__layer {
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
.gl-bg { z-index: 0; }
.gl-florL, .gl-florR { z-index: 4; }

/* --- live content, placed by Figma bounds within the 375×835 band --- */
.gl-title,
.gl-main,
.gl-nav,
.gl-thumbs {
  position: absolute;
  z-index: 2;
  opacity: 0;
}
.gl-title {
  left: 17%;
  top: 33.2%;
  width: 66%;
  margin: 0;
  text-align: center;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 11cqw;
  line-height: 1;
  color: #9a6a22;
}

.gl-main {
  left: 7.73%;
  top: 41.08%;
  width: 82.13%;
  height: 34.61%;
  object-fit: cover;
  max-width: none;
  border-radius: 4.3cqw;
  box-shadow: 0 1.6cqw 4cqw rgba(80, 55, 20, 0.28);
}

/* the design's two gold discs at the band edges double as the carousel controls */
.gl-nav {
  top: 55.75%;
  width: 10.67%;
  aspect-ratio: 1;
  z-index: 3;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #d9c666;
  color: #7a5514;
  font-size: 6cqw;
  line-height: 1;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease;
}
.gl-prev { left: 2.13%; }
.gl-next { left: 85.87%; }
.gl-nav:hover,
.gl-nav:focus-visible { background: #ecdc86; transform: scale(1.12); }
.gl-nav:active { transform: scale(0.95); }

.gl-thumbs {
  left: 10.13%;
  top: 76.65%;
  width: 77.07%;
  display: flex;
  justify-content: space-between;
}
.gl-thumb {
  width: 23.9%; /* 69/288 of the strip */
  aspect-ratio: 69 / 71;
  padding: 0;
  border: 0;
  border-radius: 50%;
  overflow: hidden;
  background: none;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
}
.gl-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gl-thumb:hover,
.gl-thumb:focus-visible { transform: translateY(-8%) scale(1.08); }
.gl-thumb.on { box-shadow: 0 0 0 0.8cqw #d9c666; }

/* ===== per-asset entrances, gated on scroll-in ===== */
.gallery.shown .gl-bg { animation: glFade 1.7s ease 0.05s both; }
.gallery.shown .gl-florL { transform-origin: 0 20%; animation: glFlyL 1.8s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
.gallery.shown .gl-florR { transform-origin: 100% 20%; animation: glFlyR 1.8s cubic-bezier(0.34,1.56,0.64,1) 0.65s both; }

.gallery.shown .gl-title { animation: glTitle 1.4s cubic-bezier(0.16,1,0.3,1) 0.95s both; }
.gallery.shown .gl-main { transform-origin: 50% 50%; animation: glFrame 1.5s cubic-bezier(0.34,1.56,0.64,1) 1.2s both; }
.gallery.shown .gl-prev { animation: glDiscL 1.1s cubic-bezier(0.34,1.7,0.5,1) 1.75s both; }
.gallery.shown .gl-next { animation: glDiscR 1.1s cubic-bezier(0.34,1.7,0.5,1) 1.85s both; }
.gallery.shown .gl-thumbs { animation: glRise 1.2s cubic-bezier(0.16,1,0.3,1) 1.65s both; }

@keyframes glFade { to { opacity: 1; } }
@keyframes glFlyL { 0% { opacity: 0; transform: translate(-40%,-16%) rotate(-8deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes glFlyR { 0% { opacity: 0; transform: translate(40%,-16%) rotate(8deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes glTitle { 0% { opacity: 0; transform: translateY(28%) scale(0.9); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes glFrame { 0% { opacity: 0; transform: scale(0.82) rotate(-2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes glDiscL { 0% { opacity: 0; transform: translateX(-140%) scale(0.5); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes glDiscR { 0% { opacity: 0; transform: translateX(140%) scale(0.5); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes glRise { from { opacity: 0; transform: translateY(30%); } to { opacity: 1; transform: translateY(0); } }

@media (prefers-reduced-motion: reduce) {
  .gallery__layer, .gl-title, .gl-main, .gl-nav, .gl-thumbs {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
