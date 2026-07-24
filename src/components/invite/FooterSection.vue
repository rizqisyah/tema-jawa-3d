<script setup lang="ts">
// Per-asset closing footer: thank-you note, credits, socials and the bottom nav bar.
import bg from "../../assets/invite/footer/parts/bg.png";
import panel from "../../assets/invite/footer/parts/panel.png";
import florL from "../../assets/invite/footer/parts/florL.png";
import florR from "../../assets/invite/footer/parts/florR.png";
import divider from "../../assets/invite/footer/parts/divider.png";
import ig from "../../assets/invite/footer/parts/ig.png";
import wa from "../../assets/invite/footer/parts/wa.png";
import menu from "../../assets/invite/footer/parts/menu.png";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×566, Figma rel 9010–9576) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "f-bg" },
  { src: florL, cls: "f-florL" },
  { src: florR, cls: "f-florR" },
  // the crimson panel lifted out of bg.png: it curves OVER the shrubs in the original,
  // while the olive field below them stays behind — one flat bg can't be on both sides
  { src: panel, cls: "f-panel" },
];

// the nav art is one exported pill; transparent hit areas sit over its four slots
const navItems = [
  { label: "Home", target: ".hero" },
  { label: "Mempelai", target: ".groom" },
  { label: "Acara", target: ".event" },
  { label: "Gallery", target: ".gallery" },
];

function goTo(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <footer ref="el" class="foot" :class="{ shown }">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="foot__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />

    <img class="f-div" :src="divider" alt="" aria-hidden="true" />
    <p class="f-thanks">
      We sincerely thank you for your presence, prayers, and blessings on our special day.
    </p>

    <p class="f-credit">Created with Love by,</p>
    <p class="f-by"><span>@25ribuaja</span><span class="f-x">x</span><span>Qinvi</span></p>

    <img class="f-ig" :src="ig" alt="Instagram" />
    <img class="f-wa" :src="wa" alt="WhatsApp" />

    <span class="f-rule" aria-hidden="true" />

    <nav class="f-nav" aria-label="Navigasi undangan">
      <img class="f-nav__art" :src="menu" alt="" aria-hidden="true" />
      <button
        v-for="n in navItems"
        :key="n.label"
        class="f-nav__hit"
        type="button"
        @click="goTo(n.target)"
      >
        <span class="sr-only">{{ n.label }}</span>
      </button>
    </nav>
  </footer>
</template>

<style scoped>
.foot {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 566;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #8f0f0f 0%, #c9bb54 30%, #cbbd5a 100%);
}

.foot__layer {
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
.f-bg { z-index: 0; }
.f-florL, .f-florR { z-index: 1; }
/* panel.png is only the top 420px of the 1132px band — anchor it, don't stretch it */
.f-panel {
  z-index: 2;
  height: auto;
  bottom: auto;
  object-fit: fill;
  /* corners cut out: the coral sprays there belong in FRONT of the crimson, and bg.png
     still paints the same red underneath them, so nothing is lost */
  clip-path: polygon(21% 0, 79% 0, 79% 60%, 100% 60%, 100% 100%, 0 100%, 0 60%, 21% 60%);
}

/* --- live content, placed by Figma bounds within the 375×566 band --- */
.f-div,
.f-thanks,
.f-credit,
.f-by,
.f-ig,
.f-wa,
.f-rule,
.f-nav {
  position: absolute;
  z-index: 3;
  margin: 0;
  opacity: 0;
}
.f-div { left: 34.67%; top: 39.05%; width: 30.67%; height: auto; max-width: none; }
.f-thanks {
  left: 14.93%;
  top: 43.5%;
  width: 72.53%;
  text-align: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 4.6cqw;
  line-height: 1.35;
  color: #7c4a15;
}
.f-credit {
  left: 20.8%;
  top: 62%;
  width: 59.73%;
  text-align: center;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 6.4cqw;
  line-height: 1;
  color: #742e2e;
}
.f-by {
  left: 10%;
  top: 67.6%;
  width: 80%;
  display: flex;
  justify-content: center;
  gap: 6cqw;
  font-family: "Pinyon Script", cursive;
  font-size: 6.4cqw;
  line-height: 1;
  color: #742e2e;
}
.f-x { opacity: 0.75; }

.f-ig,
.f-wa { top: 76.33%; width: 12%; height: auto; max-width: none; }
.f-ig { left: 38.13%; }
.f-wa { left: 53.07%; }

.f-rule {
  left: 9.87%;
  top: 83.75%;
  width: 81.6%;
  height: 1px;
  background: rgba(116, 46, 46, 0.35);
}

.f-nav { left: 4.27%; top: 86.22%; width: 91.47%; display: flex; }
.f-nav__art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: auto;
  max-width: none;
  pointer-events: none;
}
.f-nav__hit {
  position: relative;
  flex: 1;
  aspect-ratio: 86 / 60;
  padding: 0;
  border: 0;
  border-radius: 4cqw;
  background: transparent;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.f-nav__hit:hover,
.f-nav__hit:focus-visible { background: rgba(124, 74, 21, 0.12); transform: translateY(-4%); }
.f-nav__hit:active { transform: translateY(0) scale(0.97); }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* ===== per-asset entrances, gated on scroll-in ===== */
.f-bg,
.f-panel { opacity: 1; } /* base stays painted — no rectangle pop */
.foot.shown .f-florL { transform-origin: 0 0; animation: ftDropL 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.14s both; }
.foot.shown .f-florR { transform-origin: 100% 0; animation: ftDropR 0.99s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
.foot.shown .f-div { transform-origin: 50% 50%; animation: ftDiv 0.62s ease 0.32s both; }
.foot.shown .f-thanks { animation: ftRise 0.81s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
.foot.shown .f-credit { animation: ftRise 0.74s ease 0.54s both; }
.foot.shown .f-by { animation: ftRise 0.74s ease 0.6s both; }
.foot.shown .f-ig { animation: ftPop 0.56s cubic-bezier(0.34,1.56,0.64,1) 0.68s both; }
.foot.shown .f-wa { animation: ftPop 0.56s cubic-bezier(0.34,1.56,0.64,1) 0.72s both; }
.foot.shown .f-rule { animation: ftDiv 0.56s ease 0.76s both; }
.foot.shown .f-nav { animation: ftRise 0.74s cubic-bezier(0.16,1,0.3,1) 0.8s both; }

@keyframes ftDropL { 0% { opacity: 0; transform: translate(-14%,-26%) rotate(-6deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes ftDropR { 0% { opacity: 0; transform: translate(14%,-26%) rotate(6deg); } 100% { opacity: 1; transform: translate(0,0) rotate(0); } }
@keyframes ftDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes ftRise { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: translateY(0); } }
@keyframes ftPop { 0% { opacity: 0; transform: scale(0.4); } 60% { opacity: 1; transform: scale(1.16); } 100% { opacity: 1; transform: scale(1); } }

@media (prefers-reduced-motion: reduce) {
  .foot__layer, .f-div, .f-thanks, .f-credit, .f-by, .f-ig, .f-wa, .f-rule, .f-nav {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
