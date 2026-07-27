<script setup lang="ts">
import { computed, ref } from "vue";
import bg from "../../assets/invite/rsvp/parts/bg.png";
import base from "../../assets/invite/rsvp/parts/base.png";
import florL from "../../assets/invite/rsvp/parts/florL.png";
import florR from "../../assets/invite/rsvp/parts/florR.png";
import { useReveal } from "../../composables/useReveal";
import { useWedding } from "../../composables/useWedding";
import { submitRsvp } from "../../lib/api";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const { slug } = useWedding();

const layers = [
  { src: bg, cls: "r-bg" },
  { src: florL, cls: "r-florL" },
  { src: florR, cls: "r-florR" },
];

const name = ref("");
const phone = ref("");
const attendance = ref("hadir");
const guests = ref(1);
const sent = ref(false);
const submitting = ref(false);
const errorMsg = ref("");

const attending = computed(() => attendance.value === "hadir");

async function submit() {
  if (!name.value.trim()) return;
  submitting.value = true;
  errorMsg.value = "";
  try {
    await submitRsvp(slug.value, {
      guest_name: name.value.trim(),
      phone: phone.value.trim(),
      attendance_status: attendance.value,
      guest_count: Number(guests.value),
    });
    sent.value = true;
  } catch (err: any) {
    errorMsg.value = err.message || "Gagal mengirim RSVP";
  } finally {
    submitting.value = false;
  }
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
    <img class="r-base" :src="base" alt="" aria-hidden="true" />

    <div class="r-content">
      <div class="r-header-block">
        <h2 id="rsvp-title" class="r-title">Rsvp</h2>
        <p class="r-intro">
          Kehadiran Bapak/Ibu/Saudara/i akan menjadi kehormatan besar bagi kami dan keluarga. Mohon
          konfirmasi kehadiran Anda melalui formulir reservasi di bawah:
        </p>
      </div>

      <form class="r-form" @submit.prevent="submit">
        <div class="r-field">
          <label class="r-label" for="rsvp-name">Nama:</label>
          <input
            id="rsvp-name"
            v-model="name"
            class="r-input"
            type="text"
            placeholder="Nama lengkap Anda"
            required
          />
        </div>

        <div class="r-field">
          <label class="r-label" for="rsvp-phone">No HP / WhatsApp:</label>
          <input
            id="rsvp-phone"
            v-model="phone"
            class="r-input"
            type="tel"
            placeholder="0812xxxxxxx"
          />
        </div>

        <div class="r-field">
          <label class="r-label" for="rsvp-attend">Konfirmasi Kehadiran:</label>
          <select id="rsvp-attend" v-model="attendance" class="r-input r-select">
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Maaf Tidak Bisa Hadir</option>
          </select>
        </div>

        <div v-if="attending" class="r-field">
          <label class="r-label" for="rsvp-guests">Jumlah Tamu:</label>
          <select id="rsvp-guests" v-model="guests" class="r-input r-select">
            <option :value="1">1 Orang</option>
            <option :value="2">2 Orang</option>
            <option :value="3">3 Orang</option>
            <option :value="4">4 Orang</option>
          </select>
        </div>

        <p v-if="errorMsg" class="r-error">{{ errorMsg }}</p>

        <button class="r-submit" type="submit" :disabled="submitting || sent">
          {{ sent ? 'Konfirmasi Terkirim ✓' : submitting ? 'Mengirim...' : 'Kirim Reservasi' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.rsvp {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 610;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: #2b1810;
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

.r-bg { z-index: 0; }
.r-florL { z-index: 1; }
.r-florR { z-index: 2; }
.r-base {
  position: absolute;
  z-index: 3;
  inset: auto 0 0 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.r-content {
  position: absolute;
  z-index: 6;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 84%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.r-header-block {
  text-align: center;
  width: 100%;
}

.r-title {
  margin: 0 0 4px 0;
  font-family: var(--font-script, "Pinyon Script"), cursive;
  font-size: 11cqw;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.r-intro {
  margin: 0 auto;
  width: 96%;
  text-align: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.3cqw;
  line-height: 1.4;
  color: #ffffff;
}

.r-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.r-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
}

.r-label {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.2cqw;
  color: #ffffff;
  font-weight: 600;
}

.r-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(217, 191, 157, 0.35);
  background: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  font-size: 3.4cqw;
  font-family: Georgia, "Times New Roman", serif;
  box-sizing: border-box;
  backdrop-filter: blur(4px);
  transition: border-color 0.2s, background 0.2s;
}

.r-input::placeholder {
  color: rgba(238, 216, 197, 0.5);
}

.r-input:focus {
  outline: none;
  border-color: var(--gold, #d9bf9d);
  background: rgba(0, 0, 0, 0.65);
}

.r-select option {
  background: #2b1810;
  color: #ffffff;
}

.r-submit {
  margin-top: 8px;
  padding: 10px 16px;
  background: var(--gold, #d9bf9d);
  color: #2b1810;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.6cqw;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s, background 0.2s, opacity 0.2s;
}

.r-submit:hover {
  background: #e6cead;
  transform: translateY(-1px);
}

.r-submit:active {
  transform: translateY(0);
}

.r-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.r-error {
  color: #ff8888;
  font-size: 3cqw;
  margin: 0;
  text-align: center;
}

.r-bg { opacity: 1; }
.rsvp.shown .r-florL { transform-origin: 0 0; animation: rFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.rsvp.shown .r-florR { transform-origin: 100% 0; animation: rFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
.rsvp.shown .r-header-block { animation: rRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.rsvp.shown .r-form { animation: rRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.45s both; }

@keyframes rFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-10%); } 100% { opacity: 1; filter: blur(0); transform: translateX(0); } }
@keyframes rFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(10%); } 100% { opacity: 1; filter: blur(0); transform: translateX(0); } }
@keyframes rRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
</style>
