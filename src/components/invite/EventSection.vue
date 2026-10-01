<script setup lang="ts">
// Shared per-asset event block (akad / resepsi). Both bands are the same layout in Figma,
// 726 units apart — only the assets, copy and a 5u horizontal offset differ.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
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

// The venue column may only grow down to just above the frame's bottom moulding (~73% of
// the band). A long venue/address that would run past it is scaled down until it fits,
// so it never slides under the bottom flowers or out of the frame.
const PLACE_TOP = 0.422;
const PLACE_BOTTOM = 0.71;
const MIN_FIT = 0.62;
const place = ref<HTMLElement | null>(null);
const fit = ref(1);

function fitPlace() {
  const box = place.value;
  const band = el.value;
  if (!box || !band) return;
  const maxH = band.clientHeight * (PLACE_BOTTOM - PLACE_TOP);
  let s = 1;
  box.style.setProperty("--fit", "1");
  while (box.offsetHeight > maxH && s > MIN_FIT) {
    s = Math.max(MIN_FIT, s - 0.04);
    box.style.setProperty("--fit", String(s));
  }
  fit.value = s;
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  fitPlace();
  document.fonts?.ready.then(fitPlace);
  if (el.value && "ResizeObserver" in window) {
    ro = new ResizeObserver(() => fitPlace());
    ro.observe(el.value);
  }
});
onBeforeUnmount(() => ro?.disconnect());
watch(() => [props.venue, props.address], () => nextTick(fitPlace));
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
    <p class="e-date"><template v-if="day">{{ day }}<br /></template>{{ date }}</p>
    <p class="e-time">{{ time }}</p>
    <img class="e-pin" :src="pin" alt="" aria-hidden="true" />
    <!-- one flowing column: a venue that wraps pushes the address and Maps down
         instead of running into them -->
    <div ref="place" class="e-place" :style="{ '--fit': fit }">
      <p class="e-venue">{{ venue }}</p>
      <p class="e-addr">{{ address }}</p>
      <a class="e-maps" :href="computedMapsUrl()" target="_blank" rel="noopener noreferrer">Maps</a>
    </div>
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
/* starts where the venue sits in Figma. Width is held to the gap between the left and
   right flower clusters (they reach ~28.3% / ~74.5% of the band below the pin), so a
   long venue or address wraps inside the frame instead of running under the flowers */
.e-place {
  --fit: 1;
  position: absolute;
  z-index: 2;
  left: calc(29% + var(--dx));
  top: 42.2%;
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.e-place > * {
  margin: 0;
  text-align: center;
  color: #8f1b1b;
  opacity: 0;
}
.e-venue {
  width: 100%;
  overflow-wrap: anywhere;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 700;
  font-size: calc(3.8cqw * var(--fit));
  line-height: 1.2;
}
.e-addr {
  width: 100%;
  margin-top: calc(3.2cqw * var(--fit));
  overflow-wrap: anywhere;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: calc(3.3cqw * var(--fit));
  line-height: 1.55;
}
.e-maps {
  display: block;
  width: 24.27cqw;
  margin-top: calc(2cqw * var(--fit));
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

@keyframes eFrame { 0% { opacity: 0; transform: scale(0.94) rotate(-1deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes eFlyL { 0% { opacity: 0; transform: translateX(-8%) rotate(-3deg); } 100% { opacity: 1; transform: translateX(0) rotate(0); } }
@keyframes eFlyR { 0% { opacity: 0; transform: translateX(8%) rotate(3deg); } 100% { opacity: 1; transform: translateX(0) rotate(0); } }
@keyframes eRiseText { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes eWide { 0% { opacity: 0; letter-spacing: 0.5em; } 100% { opacity: 1; letter-spacing: normal; } }
@keyframes eDrop { 0% { opacity: 0; transform: translateY(-160%) scale(0.6); } 65% { opacity: 1; transform: translateY(9%) scale(1.14); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes ePop { 0% { opacity: 0; transform: scale(0.5) rotate(-5deg); } 60% { opacity: 1; transform: scale(1.12) rotate(2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@media (prefers-reduced-motion: reduce) {
  .event__layer, .event > :where(h2, p, a, .e-pin), .e-place > * {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
