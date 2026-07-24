<script setup lang="ts">
// Per-asset gallery section. Backdrop/florals are art; the photo carousel is live DOM.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import bg from "../../assets/invite/gallery/parts/bg.png";
import base from "../../assets/invite/gallery/parts/base.png";
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

// the band was cut through the carved frame: its top 241px lost the vine sprays and the
// upper wood tone. This strip restores them, continuing the gift band's g-base downward.


// the template ships the same shot in every slot; swap these for the real set
const photos = [main, t1, t2, t3, t4];
const active = ref(0);
const current = computed(() => photos[active.value]);

const step = (delta: number) => {
  active.value = (active.value + delta + photos.length) % photos.length;
};

// --- lightbox: the in-band photo is only a preview, tapping it opens the full-size viewer ---
const zoomed = ref(false);

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") zoomed.value = false;
  else if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
}

watch(zoomed, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (open) window.addEventListener("keydown", onKey);
  else window.removeEventListener("keydown", onKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
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
    <img class="gl-base" :src="base" alt="" aria-hidden="true" />

    <h2 id="gallery-title" class="gl-title">Gallery</h2>

    <button class="gl-main" type="button" aria-label="Perbesar foto" @click="zoomed = true">
      <img :src="current" alt="Foto mempelai" />
      <span class="gl-zoom" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path
            d="M11 8.5v5M8.5 11h5M15.8 15.8 20 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </button>

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

  <!-- teleported: the section clips its own overflow, the viewer must cover the page -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="zoomed"
        class="lb"
        role="dialog"
        aria-modal="true"
        aria-label="Galeri foto"
        @click.self="zoomed = false"
      >
        <img class="lb__img" :key="active" :src="current" alt="Foto mempelai" />

        <button class="lb__btn lb__close" type="button" aria-label="Tutup" @click="zoomed = false">
          ×
        </button>
        <button
          class="lb__btn lb__prev"
          type="button"
          aria-label="Foto sebelumnya"
          @click="step(-1)"
        >
          ‹
        </button>
        <button class="lb__btn lb__next" type="button" aria-label="Foto berikutnya" @click="step(1)">
          ›
        </button>

        <p class="lb__count">{{ active + 1 }} / {{ photos.length }}</p>
      </div>
    </Transition>
  </Teleport>
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

/* rides above gl-florL/R for the same reason g-base does: it already contains this
   region's blooms, so covering the fly-in avoids doubling them */
.gl-base {
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 28.86%;
  max-width: none;
  object-fit: fill;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 80%, transparent 100%);
}

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
  padding: 0;
  border: 0;
  border-radius: 4.3cqw;
  overflow: hidden;
  background: none;
  cursor: zoom-in;
  box-shadow: 0 1.6cqw 4cqw rgba(80, 55, 20, 0.28);
  transition: transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 240ms ease;
}
.gl-main img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gl-main:hover,
.gl-main:focus-visible {
  transform: scale(1.02);
  box-shadow: 0 2.4cqw 5.4cqw rgba(80, 55, 20, 0.36);
}
/* magnifier affordance, only asserts itself on hover/focus */
.gl-zoom {
  position: absolute;
  right: 3.2cqw;
  bottom: 3.2cqw;
  display: grid;
  place-items: center;
  width: 9cqw;
  height: 9cqw;
  border-radius: 50%;
  background: rgba(30, 20, 6, 0.5);
  color: #f3e6b8;
  opacity: 0.75;
  transition: opacity 200ms ease, transform 200ms ease;
}
.gl-zoom svg { width: 5.4cqw; height: 5.4cqw; }
.gl-main:hover .gl-zoom,
.gl-main:focus-visible .gl-zoom { opacity: 1; transform: scale(1.1); }

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
.gl-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.gallery.shown .gl-florL { transform-origin: 0 20%; animation: glFlyL 1.12s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
.gallery.shown .gl-florR { transform-origin: 100% 20%; animation: glFlyR 1.12s cubic-bezier(0.34,1.56,0.64,1) 0.26s both; }

.gallery.shown .gl-title { animation: glTitle 0.87s cubic-bezier(0.16,1,0.3,1) 0.38s both; }
.gallery.shown .gl-main { transform-origin: 50% 50%; animation: glFrame 0.93s cubic-bezier(0.34,1.56,0.64,1) 0.48s both; }
.gallery.shown .gl-prev { animation: glDiscL 0.68s cubic-bezier(0.34,1.7,0.5,1) 0.7s both; }
.gallery.shown .gl-next { animation: glDiscR 0.68s cubic-bezier(0.34,1.7,0.5,1) 0.74s both; }
.gallery.shown .gl-thumbs { animation: glRise 0.74s cubic-bezier(0.16,1,0.3,1) 0.66s both; }

@keyframes glFlyL { 0% { opacity: 0; transform: translate(-18%,-16%) rotate(-5deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes glFlyR { 0% { opacity: 0; transform: translate(18%,-16%) rotate(5deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes glTitle { 0% { opacity: 0; transform: translateY(28%) scale(0.9); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes glFrame { 0% { opacity: 0; transform: scale(0.82) rotate(-2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes glDiscL { 0% { opacity: 0; transform: translateX(-140%) scale(0.5); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes glDiscR { 0% { opacity: 0; transform: translateX(140%) scale(0.5); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes glRise { from { opacity: 0; transform: translateY(30%); } to { opacity: 1; transform: translateY(0); } }

/* ===== lightbox ===== */
.lb {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 4vmin;
  background: rgba(24, 16, 6, 0.92);
  backdrop-filter: blur(6px);
  cursor: zoom-out;
}
.lb__img {
  max-width: min(100%, 900px);
  max-height: 86vh;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: lbPop 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.lb__btn {
  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(243, 230, 184, 0.14);
  color: #f3e6b8;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.lb__btn:hover,
.lb__btn:focus-visible { background: rgba(243, 230, 184, 0.3); transform: scale(1.1); }
.lb__btn:active { transform: scale(0.94); }
.lb__close { top: 3vmin; right: 3vmin; font-size: 26px; }
.lb__prev { left: 3vmin; top: 50%; margin-top: -22px; }
.lb__next { right: 3vmin; top: 50%; margin-top: -22px; }
.lb__count {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3vmin;
  margin: 0;
  text-align: center;
  color: #d8c9a0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 14px;
  letter-spacing: 0.14em;
}

@keyframes lbPop { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
.lb-enter-active, .lb-leave-active { transition: opacity 220ms ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .gallery__layer, .gl-title, .gl-main, .gl-nav, .gl-thumbs {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
  .lb__img { animation: none; }
}
</style>
