<script setup lang="ts">
import { computed } from "vue";
// Every element is its own asset — nothing baked into a flat bg.
import bg from "../../assets/invite/groom/parts/bg.webp";
import florL from "../../assets/invite/groom/parts/florL.webp";
import florR from "../../assets/invite/groom/parts/florR.webp";
import portrait from "../../assets/invite/groom/parts/portrait.webp";
import florC from "../../assets/invite/groom/parts/florC.webp";
import divider from "../../assets/invite/groom/parts/divider.webp";
import { useReveal } from "../../composables/useReveal";
import { useWedding } from "../../composables/useWedding";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const props = defineProps<{
  nickname?: string;
  fullName?: string;
  fatherName?: string;
  motherName?: string;
}>();

const { groom } = useWedding();

const nickname = computed(() => {
  if (props.nickname) return props.nickname;
  if (groom.value?.nickname) return groom.value.nickname;
  if (groom.value?.name) return groom.value.name.split(' ')[0];
  return 'Antonio';
});

const fullName = computed(() => {
  if (props.fullName) return props.fullName;
  return groom.value?.name || 'Antonio Josua Setiyadi';
});

const parentText = computed(() => {
  const g = groom.value;
  if (g?.father_name && g?.mother_name) {
    return `Putra dari Bapak ${g.father_name}\n& Ibu ${g.mother_name}`;
  }
  if (g?.father_name) return `Putra dari Bapak ${g.father_name}`;
  if (g?.mother_name) return `Putra dari Ibu ${g.mother_name}`;
  if (g?.child_of) return g.child_of;
  const f = props.fatherName || 'Tono';
  const m = props.motherName || 'Ratna';
  return `Putra dari Bapak ${f}\n& Ibu ${m}`;
});

// full-frame layers (band 375×730) — placed at inset:0, pixel-exact by construction
const layers = computed(() => [
  { src: bg, cls: "g-bg" },
  { src: florL, cls: "g-florL" },
  { src: florR, cls: "g-florR" },
  { src: groom.value?.photo_url || portrait, cls: "g-portrait" },
  { src: florC, cls: "g-florC" },
]);
</script>

<template>
  <section ref="el" class="groom" :class="{ shown }" :aria-label="'Mempelai pria — ' + nickname">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="groom__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 class="g-header">The Bride &amp;<br />The Groom</h2>

    <div class="groom__name">
      <p class="g-script">{{ nickname }}</p>
      <img class="g-div" :src="divider" alt="" aria-hidden="true" />
      <p class="g-full">{{ fullName }}</p>
      <p class="g-parents" style="white-space: pre-line;">{{ parentText }}</p>
    </div>
  </section>
</template>

<style scoped>
.groom {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 730;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(
    180deg,
    #b5a279 0%,
    #c1b183 16%,
    #d3c79c 34%,
    #e5ddc8 56%,
    #e8e1cd 100%
  );
}

.groom__layer {
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

.g-bg { z-index: 0; }
.g-florL { z-index: 1; }
.g-florR { z-index: 2; }
.g-portrait { z-index: 3; }
.g-florL2 {
  z-index: 4;
  -webkit-mask-image: radial-gradient(ellipse 14% 12% at 10% 68.5%, #000 62%, transparent 100%);
  mask-image: radial-gradient(ellipse 14% 12% at 10% 68.5%, #000 62%, transparent 100%);
}
.g-florC { z-index: 5; }

.g-header {
  position: absolute;
  z-index: 6;
  top: 3.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 82%;
  margin: 0;
  text-align: center;
  font-family: var(--font-script, "Pinyon Script"), cursive;
  font-weight: 400;
  font-size: 11cqw;
  line-height: 0.95;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

.groom__name {
  position: absolute;
  z-index: 6;
  top: 75.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  text-align: center;
  color: #905d2a;
}
.g-script {
  margin: 0;
  font-family: var(--font-script, "Pinyon Script"), cursive;
  font-size: 11cqw;
  line-height: 1;
  color: #8a5a28;
}
.g-div {
  display: block;
  width: 32%;
  margin: 0.6cqw auto 1.4cqw;
  opacity: 0;
}
.g-full {
  margin: 0 0 1.6cqw;
  font-family: Georgia, "Times New Roman", serif;
  font-variant: small-caps;
  letter-spacing: 0.06em;
  font-size: 5.4cqw;
  line-height: 1;
  color: #8a5a28;
}
.g-parents {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 4cqw;
  line-height: 1.45;
  color: #96693a;
}

.g-bg { opacity: 1; }
.groom.shown .g-florL { transform-origin: 0 45%; animation: gFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.groom.shown .g-florR { transform-origin: 100% 45%; animation: gFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
.groom.shown .g-portrait { transform-origin: 50% 100%; animation: gRisePortrait 0.99s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.groom.shown .g-florC { transform-origin: 50% 100%; animation: gBloom 1.25s cubic-bezier(0.16,1,0.3,1) 0.52s both; }

.groom.shown .g-header { animation: gRiseHeader 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.groom.shown .g-script { animation: gRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
.groom.shown .g-div { animation: gDiv 0.7s ease 0.6s both; }
.groom.shown .g-full { animation: gRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
.groom.shown .g-parents { animation: gRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.85s both; }
.groom__name > :not(.g-div) { opacity: 0; }

@keyframes gRiseHeader { 0% { opacity: 0; transform: translate(-50%, 24px); filter: blur(8px); } 100% { opacity: 1; transform: translate(-50%, 0); filter: blur(0); } }
@keyframes gRisePortrait { 0% { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes gFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-8%) rotate(-3deg) scale(1.02); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0) scale(1); } }
@keyframes gFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(8%) rotate(3deg) scale(1.02); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0) scale(1); } }
@keyframes gBloom { 0% { opacity: 0; filter: blur(3px); transform: translateY(6%) scale(0.96); } 100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); } }
@keyframes gDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes gRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
@media (prefers-reduced-motion: reduce) {
  .groom__layer, .g-header, .groom__name > *, .groom__name > :not(.g-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
