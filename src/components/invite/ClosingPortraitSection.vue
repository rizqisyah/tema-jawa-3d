<script setup lang="ts">
// Per-asset closing portrait band: oval couple frame, wax seal, wayang figures, flower bed.
import bg from "../../assets/invite/closing/parts/bg.webp";
import portrait from "../../assets/invite/closing/parts/portrait.webp";
import florL from "../../assets/invite/closing/parts/florL.webp";
import florR from "../../assets/invite/closing/parts/florR.webp";
import seal from "../../assets/invite/closing/parts/seal.webp";
import { computed } from "vue";
import { useReveal } from "../../composables/useReveal";
import { useWedding } from "../../composables/useWedding";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const { wedding, content, parsedOverride, theme, couplePhoto: apiCouplePhoto } = useWedding();

const spousePhoto = computed(() => {
  const w = wedding.value;
  const c = content.value;
  const ov = parsedOverride.value;
  const t = theme.value;
  return (
    w?.image_spouse ||
    w?.['image-spouse'] ||
    c?.image_spouse ||
    c?.['image-spouse'] ||
    ov?.images?.image_spouse ||
    ov?.images?.['image-spouse'] ||
    ov?.images?.spouse ||
    ov?.images?.foto_pasangan ||
    ov?.images?.foto_mempelai_setelah_buka ||
    ov?.images?.couple ||
    t?.theme_config?.images?.image_spouse ||
    apiCouplePhoto.value ||
    ''
  );
});

const hasSpousePhoto = computed(() => Boolean(spousePhoto.value));

const customImageStyle = computed(() => {
  const ov = parsedOverride.value;
  const t =
    ov?.spouse_photo_transform ||
    ov?.foto_pasangan_transform ||
    ov?.image_spouse_transform ||
    ov?.couple_photo_transform;

  if (!t) {
    return {
      objectPosition: 'center top',
    };
  }

  const x = typeof t?.x === 'number' ? t.x : (t?.x !== undefined ? parseFloat(t.x) : 50);
  const y = typeof t?.y === 'number' ? t.y : (t?.y !== undefined ? parseFloat(t.y) : 50);
  const scale = typeof t?.scale === 'number' ? t.scale : (t?.scale !== undefined ? parseFloat(t.scale) : 1);

  const shiftX = (x - 50) * 1.5;
  const shiftY = (y - 50) * 1.5;

  return {
    objectPosition: `${x}% ${y}%`,
    transform: `translate(${shiftX}%, ${shiftY}%) scale(${scale})`,
    transformOrigin: 'center center',
  };
});
</script>

<template>
  <section ref="el" class="closing" :class="{ shown }" aria-label="Potret mempelai">
    <!-- Background layer: oval emas & wayang (selalu ada) -->
    <img class="closing__layer c-bg" :src="bg" alt="" aria-hidden="true" />

    <!-- Foto kustom di dalam oval c-bg jika ada data spouse image -->
    <div v-if="hasSpousePhoto" class="c-portrait-slot">
      <img
        class="closing__layer c-portrait is-custom"
        :src="spousePhoto"
        :style="customImageStyle"
        alt="Potret Mempelai"
      />
    </div>

    <!-- Fallback default sample portrait jika tidak ada spouse image -->
    <img
      v-else
      class="closing__layer c-portrait"
      :src="portrait"
      alt="Potret Mempelai"
      aria-hidden="true"
    />

    <!-- Florals -->
    <img class="closing__layer c-florL" :src="florL" alt="" aria-hidden="true" />
    <img class="closing__layer c-florR" :src="florR" alt="" aria-hidden="true" />

    <!-- Wax Seal per-node export -->
    <img class="c-seal" :src="seal" alt="" aria-hidden="true" />
  </section>
</template>

<style scoped>
.closing {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 640;
  overflow: visible;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #e3ddc6 0%, #e7e1cb 55%, #cfc9a8 100%);
}

.closing__layer {
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
.c-bg { z-index: 0; opacity: 1; }
.c-portrait { z-index: 1; }

/* Slot oval untuk custom spouse image berada pas di dalam oval emas c-bg */
.c-portrait-slot {
  position: absolute;
  z-index: 1;
  top: 1.4%;
  left: 50%;
  transform: translateX(-50%);
  width: 68.8%;
  aspect-ratio: 516 / 786;
  border-radius: 50%;
  overflow: hidden;
  clip-path: ellipse(50% 50% at 50% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}

.c-portrait.is-custom {
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 0;
  display: block;
}

.c-seal { z-index: 2; }
.c-florL, .c-florR { z-index: 10; }

.c-seal {
  position: absolute;
  z-index: 2;
  left: 39.2%;
  top: 57.97%;
  width: 21.07%;
  height: auto;
  max-width: none;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

/* ===== Sequential 1-by-1 Slow Elegant Entrance Animations ===== */
.closing.shown .c-portrait {
  animation: clPortraitSlow 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.closing.shown .c-portrait-slot {
  animation: clPortraitSlotSlow 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.closing.shown .c-seal {
  animation: clSealSlow 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.closing.shown .c-florL {
  animation: clFlyLSlow 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both;
}

.closing.shown .c-florR {
  animation: clFlyRSlow 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1.15s both;
}

@keyframes clPortraitSlow {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes clPortraitSlotSlow {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(24px) scale(0.96);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes clSealSlow {
  0% {
    opacity: 0;
    transform: translateY(-28px) scale(0.7) rotate(-10deg);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes clFlyLSlow {
  0% {
    opacity: 0;
    transform: translateX(-15%) translateY(12px) rotate(-3deg);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
    filter: blur(0);
  }
}

@keyframes clFlyRSlow {
  0% {
    opacity: 0;
    transform: translateX(15%) translateY(12px) rotate(3deg);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .closing__layer, .c-seal {
    animation: none !important;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
