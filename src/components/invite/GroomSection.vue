<script setup lang="ts">
import { computed } from "vue";
// Every element is its own asset — nothing baked into a flat bg.
import bg from "../../assets/invite/groom/parts/bg.webp";
import florL from "../../assets/invite/groom/parts/florL.webp";
import florR from "../../assets/invite/groom/parts/florR.webp";
import portrait from "../../assets/invite/groom/parts/portrait.webp";
import florC from "../../assets/invite/groom/parts/florC.webp";
import divider from "../../assets/invite/groom/parts/divider.webp";
import amp from "../../assets/invite/bride/parts/amp.webp";
import { useReveal } from "../../composables/useReveal";
import { useWedding } from "../../composables/useWedding";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const props = withDefaults(
  defineProps<{
    isFirst?: boolean;
    nickname?: string;
    fullName?: string;
    fatherName?: string;
    motherName?: string;
  }>(),
  { isFirst: true }
);

const { groom, wedding, coupleNickname, isGroomFirst, parsedOverride } = useWedding();

const headerTitle = computed(() => {
  const title = coupleNickname.value || wedding.value?.title?.trim() || (isGroomFirst.value ? 'Antonio & Allysa' : 'Allysa & Antonio');
  if (title.includes(' & ')) {
    const parts = title.split(' & ');
    return `${parts[0]} &<br />${parts.slice(1).join(' & ')}`;
  }
  if (title.includes(' and ')) {
    const parts = title.split(' and ');
    return `${parts[0]} &<br />${parts.slice(1).join(' and ')}`;
  }
  return title;
});

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
    return `Putra dari  ${g.father_name}\n&  ${g.mother_name}`;
  }
  if (g?.father_name) return `Putra dari  ${g.father_name}`;
  if (g?.mother_name) return `Putra dari  ${g.mother_name}`;
  if (g?.child_of) return g.child_of;
  const f = props.fatherName || 'Tono';
  const m = props.motherName || 'Ratna';
  return `Putra dari  ${f}\n&  ${m}`;
});

const customPhoto = computed(() => {
  return (
    groom.value?.photo_url ||
    parsedOverride.value?.images?.foto_mempelai_pria ||
    parsedOverride.value?.images?.foto_pria ||
    parsedOverride.value?.images?.groom ||
    ''
  );
});

const isCustomPhoto = computed(() => Boolean(customPhoto.value));

const customImageStyle = computed(() => {
  const t = parsedOverride.value?.foto_pria_transform || parsedOverride.value?.foto_mempelai_transform;
  const x = typeof t?.x === 'number' ? t.x : (t?.x !== undefined ? parseFloat(t.x) : 50);
  const y = typeof t?.y === 'number' ? t.y : (t?.y !== undefined ? parseFloat(t.y) : 50);
  const scale = typeof t?.scale === 'number' ? t.scale : (t?.scale !== undefined ? parseFloat(t.scale) : 1);

  const shiftX = (x - 50) * 1.5;
  const shiftY = (y - 50) * 1.5;

  return {
    transform: `translate(${shiftX}%, ${shiftY}%) scale(${scale})`,
    transformOrigin: 'left bottom',
  };
});

// background layers (band 375×730) — placed at inset:0
const backgroundLayers = [
  { src: bg, cls: "g-bg" },
  { src: florL, cls: "g-florL" },
  { src: florR, cls: "g-florR" },
];
</script>

<template>
  <section
    ref="el"
    class="groom"
    :class="{ shown, 'is-second': !props.isFirst }"
    :aria-label="'Mempelai pria — ' + nickname"
  >
    <!-- Background & base floral layers -->
    <img
      v-for="l in backgroundLayers"
      :key="l.cls"
      class="groom__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <!-- Fallback default sample portrait (full-bleed band) -->
    <img
      v-if="!isCustomPhoto"
      class="groom__layer g-portrait"
      :src="portrait"
      alt=""
      aria-hidden="true"
    />

    <!-- Custom Uploaded Photo with Hardcoded Architecture Slot -->
    <div
      v-else
      class="g-portrait-slot"
      aria-label="Foto Mempelai Pria"
    >
      <img
        class="g-custom-img"
        :src="customPhoto"
        :style="customImageStyle"
        alt="Mempelai Pria"
      />
    </div>

    <!-- florL clipped to rose cluster on jacket -->
    <img class="groom__layer g-florL2" :src="florL" alt="" aria-hidden="true" />

    <!-- Foreground floral (layer di atas potret) -->
    <img class="groom__layer g-florC" :src="florC" alt="" aria-hidden="true" />

    <!-- Header title shown when Groom is first -->
    <h2 v-if="props.isFirst" class="g-header" v-html="headerTitle"></h2>

    <!-- Ampersand divider shown when Groom is second -->
    <div v-else class="groom__amp">
      <img class="g-amp" :src="amp" alt="dan" />
    </div>

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

.groom.is-second {
  background: linear-gradient(180deg, #e8e1cd 0%, #ddd5c1 42%, #e1dac7 100%);
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

/* Hardcoded slot for uploaded custom photo (flush to left edge, no crop, no background box) */
.g-portrait-slot {
  position: absolute;
  z-index: 3;
  left: 0;
  top: 18%;
  width: 58%;
  height: 54%;
  border-radius: 0;
  overflow: visible;
  border: none;
  box-shadow: none;
  background-color: transparent;
  opacity: 0;
  will-change: transform, opacity;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.g-custom-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: left bottom;
  display: block;
  transform-origin: left bottom;
  mix-blend-mode: multiply;
  background-color: transparent;
}

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

.groom__amp {
  position: absolute;
  z-index: 5;
  top: 6.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 22%;
}
.g-amp {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
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
.groom.shown .g-florL,
.groom.shown .g-florL2 { transform-origin: 0 45%; animation: gFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.groom.shown .g-florR { transform-origin: 100% 45%; animation: gFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
.groom.shown .g-portrait,
.groom.shown .g-portrait-slot { transform-origin: 50% 100%; animation: gRisePortrait 0.99s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.groom.shown .g-florC { transform-origin: 50% 100%; animation: gBloom 1.25s cubic-bezier(0.16,1,0.3,1) 0.52s both; }

.groom.shown .g-header { animation: gRiseHeader 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.groom.shown .g-amp { animation: gAmp 1.2s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
.groom.shown .g-script { animation: gRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
.groom.shown .g-div { animation: gDiv 0.7s ease 0.6s both; }
.groom.shown .g-full { animation: gRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
.groom.shown .g-parents { animation: gRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.85s both; }
.groom__name > :not(.g-div) { opacity: 0; }

@keyframes gRiseHeader { 0% { opacity: 0; transform: translate(-50%, 24px); filter: blur(8px); } 100% { opacity: 1; transform: translate(-50%, 0); filter: blur(0); } }
@keyframes gAmp { 0% { opacity: 0; filter: blur(4px); transform: scale(0.88); } 100% { opacity: 1; filter: blur(0); transform: scale(1); } }
@keyframes gRisePortrait { 0% { opacity: 0; transform: translateY(20px) scale(0.96); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes gFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-8%) rotate(-3deg) scale(1.02); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0) scale(1); } }
@keyframes gFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(8%) rotate(3deg) scale(1.02); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0) scale(1); } }
@keyframes gBloom { 0% { opacity: 0; filter: blur(3px); transform: translateY(6%) scale(0.96); } 100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); } }
@keyframes gDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes gRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
@media (prefers-reduced-motion: reduce) {
  .groom__layer, .g-portrait-slot, .g-header, .g-amp, .groom__name > *, .groom__name > :not(.g-div) {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
