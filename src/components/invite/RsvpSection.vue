<script setup lang="ts">
// Per-asset RSVP section. Arch + landscape are art; the reservation form is live DOM.
import { computed, ref } from "vue";
import bg from "../../assets/invite/rsvp/parts/bg.png";
import florL from "../../assets/invite/rsvp/parts/florL.png";
import florR from "../../assets/invite/rsvp/parts/florR.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×565, Figma rel 6905–7470) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "r-bg" },
  { src: florL, cls: "r-florL" },
  { src: florR, cls: "r-florR" },
];

const name = ref("");
const phone = ref("");
const attendance = ref("");
const guests = ref(1);
const sent = ref(false);
const attending = computed(() => attendance.value === "hadir");

function submit() {
  // no backend yet — confirm locally so the form still closes the loop for the guest
  sent.value = true;
}
</script>

<template>
  <section ref="el" class="rsvp" :class="{ shown }" aria-labelledby="rsvp-title">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="rsvp__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 id="rsvp-title" class="r-title">Rsvp</h2>
    <p class="r-intro">
      Kehadiran Bapak/Ibu/Saudara/i akan menjadi kehormatan besar bagi kami dan keluarga. Mohon
      konfirmasi kehadiran Anda melalui formulir reservasi di bawah:
    </p>

    <form class="r-form" @submit.prevent="submit">
      <label class="r-label r-lname" for="rsvp-name">Nama:</label>
      <input id="rsvp-name" v-model="name" class="r-input r-iname" type="text" required />

      <label class="r-label r-lphone" for="rsvp-phone">No Hp:</label>
      <input id="rsvp-phone" v-model="phone" class="r-input r-iphone" type="tel" required />

      <label class="r-label r-latt" for="rsvp-att">Kehadiran</label>
      <select
        id="rsvp-att"
        v-model="attendance"
        class="r-input r-iatt"
        :class="{ 'r-iatt--split': attending }"
        required
      >
        <option value="" disabled>Pilih…</option>
        <option value="hadir">Hadir</option>
        <option value="tidak">Tidak hadir</option>
      </select>

      <template v-if="attending">
        <label class="r-label r-lguest" for="rsvp-guest">Tamu</label>
        <input
          id="rsvp-guest"
          v-model.number="guests"
          class="r-input r-iguest"
          type="number"
          min="1"
          max="10"
          required
        />
      </template>

      <button class="r-send" type="submit">{{ sent ? "Terkirim ✓" : "Send" }}</button>
    </form>
  </section>
</template>

<style scoped>
.rsvp {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 565;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #c9c39e 0%, #b9b183 60%, #8e7f4e 100%);
}

.rsvp__layer {
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
.r-bg { z-index: 0; }
.r-florL, .r-florR { z-index: 3; }

/* --- live content, placed by Figma bounds within the 375×565 band --- */
.r-title,
.r-intro,
.r-form {
  position: absolute;
  z-index: 2;
  margin: 0;
  opacity: 0;
}
.r-title {
  left: 9.33%;
  top: 11.5%;
  width: 81.33%;
  text-align: center;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 9.6cqw;
  line-height: 1;
  color: #fff;
  text-shadow: 0 0.4cqw 1.4cqw rgba(50, 35, 10, 0.5);
}
.r-intro {
  left: 19.2%;
  top: 21.6%;
  width: 61.6%;
  text-align: center;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.5cqw;
  line-height: 1.45;
  color: #fff;
  text-shadow: 0 0.3cqw 1cqw rgba(50, 35, 10, 0.55);
}

.r-form { left: 0; top: 0; width: 100%; height: 100%; }
.r-label {
  position: absolute;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.9cqw;
  line-height: 1;
  color: #fff;
  text-shadow: 0 0.3cqw 1cqw rgba(50, 35, 10, 0.55);
}
.r-lname { left: 14.4%; top: 46.2%; }
.r-lphone { left: 14.4%; top: 57.8%; }
.r-latt { left: 14.93%; top: 68.9%; }
.r-lguest { left: 60.8%; top: 68.9%; }

.r-input {
  position: absolute;
  height: 6.37%;
  padding: 0 2.4cqw;
  border: 0;
  border-radius: 0.8cqw;
  background: #fff;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.6cqw;
  color: #4a3113;
  box-shadow: 0 0.5cqw 1.4cqw rgba(40, 28, 8, 0.28);
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.r-input:focus {
  outline: none;
  transform: translateY(-4%);
  box-shadow: 0 0 0 0.6cqw rgba(255, 255, 255, 0.55), 0 0.9cqw 2cqw rgba(40, 28, 8, 0.34);
}
.r-iname { left: 14.67%; top: 49.38%; width: 69.6%; }
.r-iphone { left: 14.4%; top: 60.88%; width: 69.6%; }
/* restates the shared input transition — a bare `transition: width` here would drop the focus states */
.r-iatt {
  left: 14.67%;
  top: 72.04%;
  width: 68.8%;
  transition: width 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease, transform 200ms ease;
}
/* attending → select yields the right third to the guest-count field, same row, band height unchanged */
.r-iatt--split { width: 44%; }
.r-iguest {
  left: 60.8%;
  top: 72.04%;
  width: 22.67%;
  padding: 0 1.2cqw;
  text-align: center;
  animation: rsGuestIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes rsGuestIn {
  from { opacity: 0; transform: translateX(-18%) scale(0.9); }
  to { opacity: 1; transform: none; }
}

.r-send {
  position: absolute;
  left: 33.6%;
  top: 84.07%;
  width: 30.67%;
  height: 5.66%;
  border: 0;
  border-radius: 0.8cqw;
  background: #fff;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.7cqw;
  color: #4a3113;
  cursor: pointer;
  box-shadow: 0 0.5cqw 1.4cqw rgba(40, 28, 8, 0.3);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease,
    box-shadow 200ms ease;
}
.r-send:hover,
.r-send:focus-visible {
  background: #fff6dd;
  transform: translateY(-9%) scale(1.05);
  box-shadow: 0 1cqw 2.2cqw rgba(40, 28, 8, 0.38);
}
.r-send:active { transform: translateY(0) scale(0.97); }

/* ===== entrances =====
   The band's painted base never animates — a fading bg made each exported band
   read as a separate rectangle popping in. Only ornaments and copy move, and
   they travel short so the composite never visibly comes apart mid-flight. */
.r-bg { opacity: 1; }
.rsvp.shown .r-florL { transform-origin: 0 70%; animation: rsFlyL 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.05s both; }
.rsvp.shown .r-florR { transform-origin: 100% 70%; animation: rsFlyR 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.12s both; }
.rsvp.shown .r-title { animation: rsTitle 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
.rsvp.shown .r-intro { animation: rsRise 0.7s ease 0.28s both; }
.rsvp.shown .r-form { animation: rsRise 0.7s ease 0.4s both; }

@keyframes rsFlyL { 0% { opacity: 0; transform: translateX(-14%) rotate(-3deg); } 100% { opacity: 1; transform: translateX(0) rotate(0); } }
@keyframes rsFlyR { 0% { opacity: 0; transform: translateX(14%) rotate(3deg); } 100% { opacity: 1; transform: translateX(0) rotate(0); } }
@keyframes rsTitle { 0% { opacity: 0; transform: translateY(30%) scale(0.88); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes rsRise { from { opacity: 0; transform: translateY(14%); } to { opacity: 1; transform: translateY(0); } }

@media (prefers-reduced-motion: reduce) {
  .rsvp__layer, .r-title, .r-intro, .r-form, .r-iguest {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
