<script setup lang="ts">
// Save the Date — sliced backdrop (sepia bg, red ornate frame, florals) + live countdown & calendar.
import { ref, onMounted, onBeforeUnmount } from "vue";
import bg from "../../assets/invite/savedate/parts/bg.png";
import florL from "../../assets/invite/savedate/parts/florL.png";
import florR from "../../assets/invite/savedate/parts/florR.png";
import frame from "../../assets/invite/savedate/parts/frame.png";
import divider from "../../assets/invite/savedate/parts/divider.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.12);
defineExpose({ el });

// Akad Nikah — Saturday, 19 April 2029, 10.00 WIB (UTC+7)
const TARGET = new Date("2029-04-19T10:00:00+07:00").getTime();

const days = ref("00");
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");
let timer: number | undefined;

const pad = (n: number) => String(n).padStart(2, "0");
function tick() {
  let diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  days.value = pad(d); hours.value = pad(h); minutes.value = pad(m); seconds.value = pad(s);
}

onMounted(() => { tick(); timer = window.setInterval(tick, 1000); });
onBeforeUnmount(() => { if (timer) clearInterval(timer); });

// Google Calendar — 10.00–12.00 WIB = 03.00–05.00 UTC
const calendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Akad Nikah — Antonio & Allysa") +
  "&dates=20290419T030000Z/20290419T050000Z" +
  "&details=" + encodeURIComponent("Undangan pernikahan Antonio & Allysa") +
  "&location=" + encodeURIComponent("Jakarta");

const units = [
  { key: "days", label: "Days", val: days },
  { key: "hours", label: "Hours", val: hours },
  { key: "minutes", label: "Minutes", val: minutes },
  { key: "seconds", label: "Seconds", val: seconds },
];
</script>

<template>
  <section ref="el" class="sd" :class="{ shown }" aria-label="Save the Date">
    <img class="sd-layer sd-bg" :src="bg" alt="" aria-hidden="true" />
    <img class="sd-layer sd-frame" :src="frame" alt="" aria-hidden="true" />
    <img class="sd-layer sd-florL" :src="florL" alt="" aria-hidden="true" />
    <img class="sd-layer sd-florR" :src="florR" alt="" aria-hidden="true" />

    <div class="sd-card">
      <h2 class="sd-title">Save The Date</h2>
      <img class="sd-div" :src="divider" alt="" aria-hidden="true" />

      <div class="sd-count">
        <div v-for="(u, i) in units" :key="u.key" class="sd-box" :style="{ '--i': i }">
          <span class="sd-num">{{ u.val.value }}</span>
          <span class="sd-lbl">{{ u.label }}</span>
        </div>
      </div>

      <a class="sd-btn" :href="calendarUrl" target="_blank" rel="noopener">Add to Calendar</a>
    </div>
  </section>
</template>

<style scoped>
.sd {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 760;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  /* pale cream — top continues the bride section's cream */
  background: linear-gradient(180deg, #e6dfcb 0%, #e9e2cf 100%);
}

.sd-layer {
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
.sd-bg { z-index: 0; }
.sd-frame { z-index: 1; }
.sd-florL, .sd-florR { z-index: 2; }

/* --- live content inside the red frame --- */
.sd-card {
  position: absolute;
  z-index: 4;
  top: 12.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 62%;
  text-align: center;
  color: #732222;
}
.sd-title {
  margin: 0 auto;
  width: 70%;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 9cqw;
  line-height: 1;
  color: #844711;
}
.sd-div {
  display: block;
  width: 34%;
  margin: 1cqw auto 3cqw;
  opacity: 0;
}
.sd-count {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2cqw;
  margin: 0 auto;
  width: 82%;
}
.sd-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.4cqw 0 1.8cqw;
  border: 1px solid #732222;
  border-radius: 10px;
  background: #ffffff94;
}
.sd-num {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 8.4cqw;
  font-weight: 500;
  line-height: 1;
  color: #732222;
  font-variant-numeric: tabular-nums;
}
.sd-lbl {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-style: italic;
  font-size: 3.4cqw;
  line-height: 1;
  color: #732222;
}
.sd-btn {
  display: inline-block;
  margin-top: 5cqw;
  padding: 2.2cqw 5cqw;
  border-radius: 6px;
  background: #eed891;
  color: #be3a3a;
  font-family: "Overlock SC", Georgia, serif;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  font-size: 3.6cqw;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(115, 34, 34, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sd-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 14px rgba(115, 34, 34, 0.28); }
.sd-btn:active { transform: translateY(0); }

/* ===== lebay, varied entrances, gated on scroll-in ===== */
.sd.shown .sd-bg { animation: sdFade 1.6s ease 0.05s both; }
.sd.shown .sd-frame { transform-origin: 50% 45%; animation: sdFrame 1.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
.sd.shown .sd-florL { transform-origin: 0 45%; animation: sdFlyL 1.7s cubic-bezier(0.34,1.56,0.64,1) 1.1s both; }
.sd.shown .sd-florR { transform-origin: 100% 45%; animation: sdFlyR 1.7s cubic-bezier(0.34,1.56,0.64,1) 1.25s both; }

.sd.shown .sd-title { animation: sdRise 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
.sd.shown .sd-div { animation: sdDiv 0.9s ease 1.2s both; }
.sd.shown .sd-box { animation: sdPop 0.8s cubic-bezier(0.34,1.56,0.64,1) calc(1.4s + var(--i) * 0.14s) both; }
.sd.shown .sd-btn { animation: sdRise 1s ease 2.1s both; }
.sd-title, .sd-btn { opacity: 0; }
.sd-box { opacity: 0; }

@keyframes sdFade { to { opacity: 1; } }
@keyframes sdFrame { 0% { opacity: 0; transform: scale(0.82) translateY(4%); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes sdFlyL { 0% { opacity: 0; transform: translateX(-45%) rotate(-9deg) scale(1.04); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes sdFlyR { 0% { opacity: 0; transform: translateX(45%) rotate(9deg) scale(1.04); } 100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); } }
@keyframes sdRise { from { opacity: 0; transform: translateY(24%); } to { opacity: 1; transform: translateY(0); } }
@keyframes sdDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes sdPop { 0% { opacity: 0; transform: translateY(20%) scale(0.7); } 60% { opacity: 1; transform: translateY(0) scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .sd-layer, .sd-title, .sd-div, .sd-box, .sd-btn {
    animation: none !important; opacity: 1; transform: none;
  }
}
</style>
