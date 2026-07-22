<script setup lang="ts">
// Per-asset wedding wish section. Red panel + trailing florals are art; the guestbook is live DOM.
import { ref } from "vue";
import bg from "../../assets/invite/wish/parts/bg.png";
import florL from "../../assets/invite/wish/parts/florL.png";
import florR from "../../assets/invite/wish/parts/florR.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×900, Figma rel 8110–9010) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "w-bg" },
  { src: florL, cls: "w-florL" },
  { src: florR, cls: "w-florR" },
];

type Wish = { name: string; when: string; text: string };

// seeded from the template's mock guestbook; new entries land on top
const wishes = ref<Wish[]>([
  {
    name: "Anggun",
    when: "2 hari lalu",
    text: "Happy wedding 🎉 Semoga keluarga kecil kalian senantiasa diberahi kebahagiaan, kecukupan, dan kesehatan✨ Selamat beribadah bersama sampai jannah ya🙏",
  },
  { name: "Amri", when: "3 hari lalu", text: "Happy wedding yaaa, semoga samawa, bahagia dunia akhirat ❤️" },
  { name: "Amanda", when: "3 hari lalu", text: "Alhamdulillah, terharu banget, samawa yak" },
  { name: "Gilang", when: "3 hari lalu", text: "Happy wedding broo..." },
]);

const name = ref("");
const message = ref("");

function submit() {
  if (!name.value.trim() || !message.value.trim()) return;
  wishes.value = [
    { name: name.value.trim(), when: "Baru saja", text: message.value.trim() },
    ...wishes.value,
  ];
  name.value = "";
  message.value = "";
}
</script>

<template>
  <section ref="el" class="wish" :class="{ shown }" aria-labelledby="wish-title">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="wish__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <h2 id="wish-title" class="w-title">Wedding Wish</h2>
    <p class="w-intro">Silakan kirimkan doa dan ucapan yang tulus untuk kami:</p>

    <form class="w-form" @submit.prevent="submit">
      <input
        v-model="name"
        class="w-name"
        type="text"
        required
        aria-label="Nama"
        placeholder="Nama"
      />
      <label class="w-label" for="wish-msg">Sampaikan ucapan selamat untuk<br />pernikahan kami:</label>
      <textarea id="wish-msg" v-model="message" class="w-msg" required></textarea>
      <button class="w-send" type="submit">Kirim</button>
    </form>

    <ul class="w-list">
      <li v-for="(w, i) in wishes" :key="i" class="w-item">
        <p class="w-name-out">{{ w.name }}</p>
        <p class="w-when">{{ w.when }}</p>
        <p class="w-text">{{ w.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wish {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 900;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: #8f0f0f;
}

.wish__layer {
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

/* z-order back → front — the red panel sits OVER the trailing greenery, exactly as in the
   original: only the sliver above the ellipse's curved top stays visible */
.w-florL, .w-florR { z-index: 0; }
.w-bg { z-index: 1; }

/* --- live content, placed by Figma bounds within the 375×900 band --- */
.w-title,
.w-intro,
.w-form,
.w-list {
  position: absolute;
  z-index: 2;
  margin: 0;
  opacity: 0;
}
.w-title {
  left: 18.13%;
  top: 5.4%;
  width: 63.6%;
  text-align: center;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 9.6cqw;
  line-height: 1.1;
  color: #fff7ee;
}
.w-intro {
  left: 9.33%;
  top: 11.33%;
  width: 80.72%;
  text-align: center;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-weight: 600;
  font-size: 3.9cqw;
  line-height: 1.4;
  color: #e8eced;
}

.w-form { left: 0; top: 0; width: 100%; height: 100%; }
.w-name,
.w-msg {
  position: absolute;
  padding: 2.2cqw 3cqw;
  border: 0;
  border-radius: 2.7cqw;
  background: #fff;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.6cqw;
  color: #4a1d1d;
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.w-name::placeholder { color: #b09a9a; }
.w-name:focus,
.w-msg:focus {
  outline: none;
  transform: translateY(-3%);
  box-shadow: 0 0 0 0.6cqw rgba(255, 255, 255, 0.42);
}
.w-name { left: 10.19%; top: 24.44%; width: 76.08%; height: 4%; }
.w-msg {
  left: 9.91%;
  top: 36.33%;
  width: 76.3%;
  height: 9.33%;
  resize: none;
  line-height: 1.4;
}
.w-label {
  position: absolute;
  left: 9.91%;
  top: 30.67%;
  width: 62%;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-weight: 700;
  font-size: 3.5cqw;
  line-height: 1.4;
  color: #e8eced;
}
/* the design has no submit control — the guestbook needs one to work */
.w-send {
  position: absolute;
  left: 35%;
  top: 47.2%;
  width: 30%;
  height: 4%;
  border: 0;
  border-radius: 999px;
  background: #fff7ee;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.6cqw;
  color: #8f0f0f;
  cursor: pointer;
  box-shadow: 0 0.5cqw 1.4cqw rgba(40, 4, 4, 0.35);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease;
}
.w-send:hover,
.w-send:focus-visible { background: #fff; transform: translateY(-9%) scale(1.05); }
.w-send:active { transform: translateY(0) scale(0.97); }

.w-list {
  left: 8.53%;
  top: 52.33%;
  width: 82.67%;
  height: 47.56%;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  border-radius: 2.7cqw;
  background: #fff;
  box-shadow: 0 1.2cqw 3cqw rgba(40, 4, 4, 0.35);
}
.w-item { padding: 3.2cqw 4cqw; border-bottom: 1px solid #ecdcdc; }
.w-item:last-child { border-bottom: 0; }
.w-name-out {
  margin: 0 0 1cqw;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-weight: 700;
  font-size: 3.9cqw;
  line-height: 1;
  color: #2f2320;
}
.w-when {
  margin: 0 0 1.6cqw;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.2cqw;
  line-height: 1;
  color: #a89b98;
}
.w-text {
  margin: 0;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.4cqw;
  line-height: 1.5;
  color: #4a3a36;
}

/* ===== per-asset entrances, gated on scroll-in ===== */
.wish.shown .w-bg { animation: wFade 1.6s ease 0.05s both; }
.wish.shown .w-florL { transform-origin: 0 0; animation: wDropL 1.6s cubic-bezier(0.34,1.56,0.64,1) 0.4s both; }
.wish.shown .w-florR { transform-origin: 100% 0; animation: wDropR 1.6s cubic-bezier(0.34,1.56,0.64,1) 0.55s both; }
.wish.shown .w-title { animation: wTitle 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
.wish.shown .w-intro { animation: wRise 1.2s ease 1.1s both; }
.wish.shown .w-form { animation: wRise 1.3s ease 1.35s both; }
.wish.shown .w-list { animation: wCard 1.3s cubic-bezier(0.16,1,0.3,1) 1.6s both; }

@keyframes wFade { to { opacity: 1; } }
@keyframes wDropL { 0% { opacity: 0; transform: translate(-12%,-30%) rotate(-6deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes wDropR { 0% { opacity: 0; transform: translate(12%,-30%) rotate(6deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes wTitle { 0% { opacity: 0; transform: translateY(30%) scale(0.88); filter: blur(6px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes wRise { from { opacity: 0; transform: translateY(14%); } to { opacity: 1; transform: translateY(0); } }
@keyframes wCard { 0% { opacity: 0; transform: translateY(22%) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .wish__layer, .w-title, .w-intro, .w-form, .w-list {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
