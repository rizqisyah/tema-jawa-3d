<script setup lang="ts">
import { computed } from 'vue';
import bg from "../../assets/invite/bride/parts/bg.webp";
import flor from "../../assets/invite/bride/parts/flor.webp";
import front from "../../assets/invite/bride/parts/front.webp";
import portrait from "../../assets/invite/bride/parts/portrait.webp";
import amp from "../../assets/invite/bride/parts/amp.webp";
import divider from "../../assets/invite/bride/parts/divider.webp";
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

const { bride } = useWedding();

const nickname = computed(() => {
  if (props.nickname) return props.nickname;
  if (bride.value?.nickname) return bride.value.nickname;
  if (bride.value?.name) return bride.value.name.split(' ')[0];
  return 'Allysa';
});

const fullName = computed(() => {
  if (props.fullName) return props.fullName;
  return bride.value?.name || 'Ayu Shella Pratni';
});

const parentText = computed(() => {
  const b = bride.value;
  if (b?.father_name && b?.mother_name) {
    return `Putri dari Bapak ${b.father_name}\n& Ibu ${b.mother_name}`;
  }
  if (b?.father_name) return `Putri dari Bapak ${b.father_name}`;
  if (b?.mother_name) return `Putri dari Ibu ${b.mother_name}`;
  if (b?.child_of) return b.child_of;
  const f = props.fatherName || 'Heri';
  const m = props.motherName || 'Sofie';
  return `Putri dari Bapak ${f}\n& Ibu ${m}`;
});

const layers = computed(() => [
  { src: bg, cls: "b-bg" },
  { src: flor, cls: "b-flor" },
  { src: bride.value?.photo_url || portrait, cls: "b-portrait" },
]);
</script>

<template>
  <section ref="el" class="bride" :class="{ shown }" :aria-label="'Mempelai wanita — ' + nickname">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="bride__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />
    <img class="bride__layer b-front" :src="front" alt="" aria-hidden="true" />

    <div class="bride__amp">
      <img class="b-amp" :src="amp" alt="dan" />
    </div>

    <div class="bride__name">
      <p class="b-script">{{ nickname }}</p>
      <img class="b-div" :src="divider" alt="" aria-hidden="true" />
      <p class="b-full">{{ fullName }}</p>
      <p class="b-parents" style="white-space: pre-line;">{{ parentText }}</p>
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

.b-bg { z-index: 0; }
.b-flor { z-index: 1; }
.b-portrait { z-index: 2; }
.b-front {
  z-index: 3;
  inset: auto;
  left: 0;
  top: 58.05%;
  width: 100%;
  height: 17.08%;
  object-fit: fill;
}

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
  font-family: var(--font-script, "Pinyon Script"), cursive;
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

.b-bg { opacity: 1; }
.bride.shown .b-flor,
.bride.shown .b-front { transform-origin: 50% 100%; animation: bBloom 1.4s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.bride.shown .b-portrait { transform-origin: 50% 100%; animation: bRisePortrait 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

.bride.shown .b-amp { animation: bAmp 1.2s cubic-bezier(0.16,1,0.3,1) 0.12s both; }

.bride.shown .b-script { animation: bName 1.4s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
.bride.shown .b-div { animation: bDiv 0.7s ease 0.6s both; }
.bride.shown .b-full { animation: bRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
.bride.shown .b-parents { animation: bRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.85s both; }
.bride__name > :not(.b-div) { opacity: 0; }

@keyframes bRisePortrait { 0% { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bBloom { 0% { opacity: 0; transform: translateY(4%) scale(1.02); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes bAmp { 0% { opacity: 0; filter: blur(4px); transform: scale(0.88); } 100% { opacity: 1; filter: blur(0); transform: scale(1); } }
@keyframes bName { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes bDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes bRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
@media (prefers-reduced-motion: reduce) {
  .bride__layer, .b-amp, .bride__name > *, .bride__name > :not(.b-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
  .bride__name { transform: translateX(-50%); }
}
</style>
