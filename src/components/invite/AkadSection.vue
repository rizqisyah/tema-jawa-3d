<script setup lang="ts">
// Per-asset akad nikah section. Every element its own layer — nothing baked.
import bg from "../../assets/invite/akad/parts/bg.png";
import frame from "../../assets/invite/akad/parts/frame.png";
import florL from "../../assets/invite/akad/parts/florL.png";
import florR from "../../assets/invite/akad/parts/florR.png";
import pin from "../../assets/invite/akad/parts/pin.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×726, Figma rel 3757–4483) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "a-bg" },
  { src: frame, cls: "a-frame" },
  { src: florL, cls: "a-florL" },
  { src: florR, cls: "a-florR" },
];

const address =
  "Jl. Melati Raya No. 27, RT 004/RW 006, Kelurahan Cikini, Kecamatan Menteng, Jakarta Pusat, DKI Jakarta 10330";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
</script>

<template>
  <section ref="el" class="akad" :class="{ shown }" aria-labelledby="akad-title">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="akad__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 id="akad-title" class="a-title">Akad Nikah</h2>
    <p class="a-date">Saturday,<br />19 April 2029</p>
    <p class="a-time">10.00 WIB - 12.00 WIB</p>
    <img class="a-pin" :src="pin" alt="" aria-hidden="true" />
    <p class="a-venue">Rumah mempelai wanita</p>
    <p class="a-addr">{{ address }}</p>
    <a class="a-maps" :href="mapsUrl" target="_blank" rel="noopener noreferrer">Maps</a>
  </section>
</template>

<style scoped>
.akad {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 726;
  /* the band starts 26u above where save-the-date ends (so the frame's top moulding isn't
     clipped) — slide up by exactly that overlap so the backdrop stays continuous, no repeat */
  margin-top: -6.933%;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #e5decb 0%, #d8cfae 46%, #b9ab74 100%);
}

.akad__layer {
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
.a-bg { z-index: 0; }
.a-frame { z-index: 1; }
.a-florL, .a-florR { z-index: 3; }

/* --- live text, placed by Figma bounds within the 375×726 band --- */
.akad > :where(h2, p, a, .a-pin) {
  position: absolute;
  z-index: 2;
  margin: 0;
  text-align: center;
  color: #8f1b1b;
  opacity: 0;
}
.a-title {
  left: 13.07%;
  top: 15.7%;
  width: 73.87%;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 10.4cqw;
  line-height: 1;
  color: #8a1717;
}
.a-date {
  left: 15%;
  top: 23.6%;
  width: 70%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 5.1cqw;
  line-height: 1.4;
}
.a-time {
  left: 8%;
  top: 33.2%;
  width: 84%;
  white-space: nowrap;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 5.3cqw;
  line-height: 1;
}
.a-pin {
  left: 48%;
  top: 38.16%;
  width: 5.87%;
  height: auto;
  max-width: none;
  pointer-events: none;
}
.a-venue {
  left: 15.2%;
  top: 42.2%;
  width: 69.87%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 700;
  font-size: 3.8cqw;
  line-height: 1;
}
.a-addr {
  left: 17%;
  top: 46.2%;
  width: 66%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: 3.3cqw;
  line-height: 1.55;
}
.a-maps {
  left: 38.67%;
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
.a-maps:hover,
.a-maps:focus-visible {
  transform: translateY(-6%) scale(1.05);
  background: #ffe9a8;
  box-shadow: 0 1cqw 2.2cqw rgba(120, 80, 20, 0.3);
}
.a-maps:active { transform: translateY(0) scale(0.98); }

/* ===== lebay, varied per-asset entrances, gated on scroll-in ===== */
.akad.shown .a-bg { animation: aFade 1.7s ease 0.05s both; }
.akad.shown .a-frame { transform-origin: 50% 50%; animation: aFrame 1.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
.akad.shown .a-florL { transform-origin: 0 40%; animation: aFlyL 1.8s cubic-bezier(0.34,1.56,0.64,1) 0.85s both; }
.akad.shown .a-florR { transform-origin: 100% 40%; animation: aFlyR 1.8s cubic-bezier(0.34,1.56,0.64,1) 1s both; }

.akad.shown .a-title { animation: aTitle 1.5s cubic-bezier(0.16,1,0.3,1) 1.15s both; }
.akad.shown .a-date { animation: aRise 1.2s ease 1.5s both; }
.akad.shown .a-time { animation: aWide 1.3s cubic-bezier(0.16,1,0.3,1) 1.7s both; }
.akad.shown .a-pin { transform-origin: 50% 100%; animation: aDrop 1.1s cubic-bezier(0.34,1.7,0.5,1) 1.95s both; }
.akad.shown .a-venue { animation: aRise 1.2s ease 2.1s both; }
.akad.shown .a-addr { animation: aRise 1.3s ease 2.3s both; }
.akad.shown .a-maps { animation: aPop 1s cubic-bezier(0.34,1.56,0.64,1) 2.55s both; }

@keyframes aFade { to { opacity: 1; } }
@keyframes aFrame { 0% { opacity: 0; transform: scale(0.86) rotate(-1.6deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes aFlyL { 0% { opacity: 0; transform: translateX(-52%) rotate(-11deg) scale(1.06); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes aFlyR { 0% { opacity: 0; transform: translateX(52%) rotate(11deg) scale(1.06); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes aTitle { 0% { opacity: 0; transform: translateY(30%) scale(0.88); filter: blur(7px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes aRise { from { opacity: 0; transform: translateY(16%); } to { opacity: 1; transform: translateY(0); } }
@keyframes aWide { 0% { opacity: 0; letter-spacing: 0.5em; } 100% { opacity: 1; letter-spacing: normal; } }
@keyframes aDrop { 0% { opacity: 0; transform: translateY(-160%) scale(0.6); } 65% { opacity: 1; transform: translateY(9%) scale(1.14); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes aPop { 0% { opacity: 0; transform: scale(0.5) rotate(-5deg); } 60% { opacity: 1; transform: scale(1.12) rotate(2deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
@media (prefers-reduced-motion: reduce) {
  .akad__layer, .akad > :where(h2, p, a, .a-pin) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
