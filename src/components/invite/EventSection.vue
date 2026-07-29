<script setup lang="ts">
// Shared per-asset event block (akad / resepsi). Both bands are the same layout in Figma,
// 726 units apart — only the assets, copy and a 5u horizontal offset differ.
import { useReveal } from "../../composables/useReveal";

const props = defineProps<{
  bg: string;
  frame: string;
  florL: string;
  florR: string;
  pin: string;
  title: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
  /** horizontal offset of this band's art vs the akad band, in % of section width */
  offsetX?: string;
  /** negative top margin when the band overlaps the section above */
  overlap?: string;
}>();

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const layers = () => [
  { src: props.bg, cls: "e-bg" },
  { src: props.frame, cls: "e-frame" },
  { src: props.florL, cls: "e-florL" },
  { src: props.florR, cls: "e-florR" },
];

const computedMapsUrl = () =>
  props.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.address)}`;
</script>

<template>
  <section
    ref="el"
    class="event"
    :class="{ shown }"
    :style="{ '--dx': offsetX ?? '0%', '--overlap': overlap ?? '0%' }"
    :aria-label="title"
  >
    <img
      v-for="l in layers()"
      :key="l.cls"
      class="event__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 class="e-title">{{ title }}</h2>
    <p class="e-date">{{ day }}<br />{{ date }}</p>
    <p class="e-time">{{ time }}</p>
    <img class="e-pin" :src="pin" alt="" aria-hidden="true" />
    <p class="e-venue">{{ venue }}</p>
    <p class="e-addr">{{ address }}</p>
    <a class="e-maps" :href="computedMapsUrl()" target="_blank" rel="noopener noreferrer">Maps</a>
  </section>
</template>

<style scoped>
.event {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 726;
  /* a band may start above where the previous section ends (so the frame's top moulding
     isn't clipped) — slide up by exactly that overlap so the backdrop stays continuous */
  margin-top: var(--overlap);
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #e5decb 0%, #d8cfae 46%, #b9ab74 100%);
}

.event__layer {
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
.e-bg { z-index: 0; }
.e-frame { z-index: 1; }
.e-florL, .e-florR { z-index: 3; }

/* --- live text, placed by Figma bounds within the 375×726 band --- */
.event > :where(h2, p, a, .e-pin) {
  position: absolute;
  z-index: 2;
  margin: 0;
  text-align: center;
  color: #8f1b1b;
  opacity: 0;
}
.e-title {
  left: calc(13.07% + var(--dx));
  top: 15.7%;
  width: 73.87%;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 10.4cqw;
  line-height: 1;
  color: #8a1717;
}
.e-date {
  left: calc(15% + var(--dx));
  top: 23.6%;
  width: 70%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 5.1cqw;
  line-height: 1.4;
}
.e-time {
  left: calc(8% + var(--dx));
  top: 33.2%;
  width: 84%;
  white-space: nowrap;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 5.3cqw;
  line-height: 1;
}
.e-pin {
  left: calc(48% + var(--dx));
  top: 38.16%;
  width: 5.87%;
  height: auto;
  max-width: none;
  pointer-events: none;
}
.e-venue {
  left: calc(15.2% + var(--dx));
  top: 42.2%;
  width: 69.87%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 700;
  font-size: 3.8cqw;
  line-height: 1;
}
.e-addr {
  left: calc(17% + var(--dx));
  top: 46.2%;
  width: 66%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 3.3cqw;
  line-height: 1.55;
}
.e-maps {
  left: calc(38.67% + var(--dx));
  top: 54.41%;
  width: 24.27%;
  padding: 1.9cqw 0;
  border-radius: 1.1cqw;
  background: #f6dd95;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.8cqw;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 0.5cqw 1.4cqw rgba(120, 80, 20, 0.22);
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease,
    background 220ms ease;
}
.e-maps:hover,
.e-maps:focus-visible {
  transform: translateY(-6%) scale(1.05);
  background: #ffe9a8;
  box-shadow: 0 1cqw 2.2cqw rgba(120, 80, 20, 0.3);
}
.e-maps:active { transform: translateY(0) scale(0.98); }

/* ===== lebay, varied per-asset entrances, gated on scroll-in ===== */
.e-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.event.shown .e-frame { transform-origin: 50% 50%; animation: eFrame 1.12s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
.event.shown .e-florL { transform-origin: 0 40%; animation: eFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
.event.shown .e-florR { transform-origin: 100% 40%; animation: eFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.36s both; }

.event.shown .e-title { animation: eRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.event.shown .e-date { animation: eRiseText 1.45s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
.event.shown .e-time { animation: eRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
.event.shown .e-pin { transform-origin: 50% 100%; animation: eRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
.event.shown .e-venue { animation: eRiseText 1.55s cubic-bezier(0.16,1,0.3,1) 0.75s both; }
.event.shown .e-addr { animation: eRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.85s both; }
.event.shown .e-maps { animation: eRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.95s both; }

@keyframes eFrame { 0% { opacity: 0; transform: scale(0.94) rotate(-1deg); filter: blur(6px); } 100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); } }
@keyframes eFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-8%) rotate(-3deg); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); } }
@keyframes eFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(8%) rotate(3deg); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); } }
@keyframes eRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes eWide { 0% { opacity: 0; letter-spacing: 0.5em; } 100% { opacity: 1; letter-spacing: normal; } }
@keyframes eDrop { 0% { opacity: 0; transform: translateY(-160%) scale(0.6); } 65% { opacity: 1; transform: translateY(9%) scale(1.14); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes ePop { 0% { opacity: 0; transform: scale(0.5) rotate(-5deg); } 60% { opacity: 1; transform: scale(1.12) rotate(2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@media (prefers-reduced-motion: reduce) {
  .event__layer, .event > :where(h2, p, a, .e-pin) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
