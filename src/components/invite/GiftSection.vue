<script setup lang="ts">
// Per-asset wedding gift section. Carved frame + gold panel are art; every account row is live DOM.
import { ref } from "vue";
import bg from "../../assets/invite/gift/parts/bg.webp";
import base from "../../assets/invite/gift/parts/base.webp";
import florL from "../../assets/invite/gift/parts/florL.webp";
import florR from "../../assets/invite/gift/parts/florR.webp";
import divider from "../../assets/invite/gift/parts/divider.webp";
import bca from "../../assets/invite/gift/parts/bca.webp";
import { useReveal } from "../../composables/useReveal";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

// full-frame layers (band 375×861, Figma rel 5209–6070) — inset:0, pixel-exact by construction
const layers = [
  { src: bg, cls: "g-bg" },
  { src: florL, cls: "g-florL" },
  { src: florR, cls: "g-florR" },
];

// bg.webp stops at flat olive where the design still carries the carved frame's lower half —
// the mirrored crown, its finial and the fountain's top tier all live below y 5845 and were
// lost when the band was cut. This strip restores that region verbatim from the design.


// the template ships two identical BCA rows; each keeps its own copy state
const accounts = [
  { bank: "BCA", number: "8715154435", holder: "Muhammad Arif" },
  { bank: "BCA", number: "8715154435", holder: "Muhammad Arif" },
];

const copied = ref<number | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy(index: number) {
  const text = accounts[index].number;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard API needs a secure context / permission — fall back to a temp selection
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  copied.value = index;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = null), 1800);
}
</script>

<template>
  <section ref="el" class="gift" :class="{ shown }" aria-labelledby="gift-title">
    <img
      v-for="l in layers"
      :key="l.cls"
      class="gift__layer"
      :class="l.cls"
      :src="l.src"
      alt=""
      aria-hidden="true"
    />
    <img class="g-base" :src="base" alt="" aria-hidden="true" />

    <img class="g-div" :src="divider" alt="" aria-hidden="true" />
    <h2 id="gift-title" class="g-title">Wedding Gift</h2>
    <p class="g-desc">
      Bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui fitur di bawah ini:
    </p>

    <div v-for="(a, i) in accounts" :key="i" class="g-acct" :class="'g-acct' + i">
      <img class="g-bca" :src="bca" :alt="a.bank" />
      <p class="g-no">No. Rekening : {{ a.number }}</p>
      <p class="g-holder">A/n {{ a.holder }}</p>
      <button class="g-copy" type="button" @click="copy(i)">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M9 9V5.25A2.25 2.25 0 0 1 11.25 3h7.5A2.25 2.25 0 0 1 21 5.25v7.5A2.25 2.25 0 0 1 18.75 15H15M5.25 9h7.5A2.25 2.25 0 0 1 15 11.25v7.5A2.25 2.25 0 0 1 12.75 21h-7.5A2.25 2.25 0 0 1 3 18.75v-7.5A2.25 2.25 0 0 1 5.25 9Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ copied === i ? "Copied!" : "Copy text" }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.gift {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 861;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: linear-gradient(180deg, #c8a45f 0%, #d8bd77 40%, #b98f4a 100%);
}

.gift__layer {
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
.g-bg { z-index: 0; }
.g-florL, .g-florR { z-index: 3; }

/* The strip already contains this region's florals, so it rides ABOVE g-florL/R rather than
   under them — that way the fly-in happens behind it and no duplicate blooms show through.
   Its top 20% dissolves into what bg.webp paints there; the two agree to ~6/255 across that
   band, so the join is invisible. */
.g-base {
  position: absolute;
  z-index: 4;
  left: 0;
  top: 73.98%;
  width: 100%;
  height: 26.02%;
  max-width: none;
  object-fit: fill;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 20%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 20%);
}

/* --- live content, placed by Figma bounds within the 375×861 band --- */
.gift > :where(img.g-div, h2, p),
.g-acct {
  position: absolute;
  z-index: 2;
  margin: 0;
  text-align: center;
  opacity: 0;
}
.g-div {
  left: 35.47%;
  top: 22.3%;
  width: 32%;
  height: auto;
  max-width: none;
  pointer-events: none;
}
.g-title {
  left: 17.87%;
  top: 25.4%;
  width: 66.93%;
  font-family: "Pinyon Script", cursive;
  font-weight: 400;
  font-size: 10.6cqw;
  line-height: 1.1;
  color: #844711;
}
.g-desc {
  left: 6.93%;
  top: 34.84%;
  width: 89.07%;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.6cqw;
  line-height: 1.5;
  color: #8d4417;
}

/* one account block = logo + number + holder + copy button, anchored at its Figma y */
.g-acct {
  left: 7.73%;
  width: 84.53%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.g-acct0 { top: 43.09%; }
.g-acct1 { top: 59.35%; }

.g-bca {
  width: 18.93%; /* 60/317 of the block */
  height: auto;
  max-width: none;
}
.g-no,
.g-holder {
  margin: 0;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 2.7cqw;
  line-height: 1.32;
  color: #844711;
}
.g-no { margin-top: 2.9cqw; }

.g-copy {
  margin-top: 2.9cqw;
  display: inline-flex;
  align-items: center;
  gap: 1.6cqw;
  padding: 1.6cqw 3.2cqw;
  border: 0;
  border-radius: 999px;
  background: #a37f25;
  color: #fff;
  font-family: "EB Garamond", Georgia, "Times New Roman", serif;
  font-size: 3.3cqw;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 0.6cqw 1.6cqw rgba(90, 60, 10, 0.28);
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease,
    box-shadow 200ms ease;
}
.g-copy svg { width: 3.7cqw; height: 3.7cqw; }
.g-copy:hover,
.g-copy:focus-visible {
  background: #bb9435;
  transform: translateY(-8%) scale(1.04);
  box-shadow: 0 1.1cqw 2.4cqw rgba(90, 60, 10, 0.34);
}
.g-copy:active { transform: translateY(0) scale(0.97); }

/* ===== per-asset entrances, gated on scroll-in ===== */
.g-bg { opacity: 1; } /* base stays painted — no rectangle pop */
.gift.shown .g-florL { transform-origin: 0 45%; animation: gfFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
.gift.shown .g-florR { transform-origin: 100% 45%; animation: gfFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

.gift.shown .g-div { transform-origin: 50% 50%; animation: gfDiv 0.7s ease 0.2s both; }
.gift.shown .g-title { animation: gfRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.gift.shown .g-desc { animation: gfRiseText 1.45s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
.gift.shown .g-acct0 { animation: gfRiseText 1.55s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
.gift.shown .g-acct1 { animation: gfRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.8s both; }

@keyframes gfFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-8%) rotate(-3deg); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); } }
@keyframes gfFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(8%) rotate(3deg); } 100% { opacity: 1; filter: blur(0); transform: translateX(0) rotate(0); } }
@keyframes gfDiv { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes gfRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }

@media (prefers-reduced-motion: reduce) {
  .gift__layer, .gift > :where(img.g-div, h2, p), .g-acct {
    animation: none !important; opacity: 1; transform: none; filter: none;
  }
}
</style>
