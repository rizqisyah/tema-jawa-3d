<script setup lang="ts">
import { ref, computed } from "vue";
import bg from "../../assets/invite/wish/parts/bg.png";
import { useReveal } from "../../composables/useReveal";
import { useWedding } from "../../composables/useWedding";
import { submitUcapan } from "../../lib/api";

const { el, shown } = useReveal(0.08);
defineExpose({ el });

const { slug, wishes: apiWishes, refetch } = useWedding();

const layers = [
  { src: bg, cls: "w-bg" },

];

const name = ref("");
const message = ref("");
const submitting = ref(false);
const errorMsg = ref("");

const wishes = computed(() => {
  if (apiWishes.value && apiWishes.value.length > 0) {
    return apiWishes.value.map((w: any) => ({
      name: w.guest_name || 'Tamu',
      when: w.created_at ? new Date(w.created_at).toLocaleDateString('id-ID') : 'Baru saja',
      text: w.message || '',
    }));
  }
  return [
    {
      name: "Anggun",
      when: "2 hari lalu",
      text: "Happy wedding 🎉 Semoga keluarga kecil kalian senantiasa diberahi kebahagiaan, kecukupan, dan kesehatan✨ Selamat beribadah bersama sampai jannah ya🙏",
    },
    {
      name: "Amri",
      when: "3 hari lalu",
      text: "Happy wedding yaaa, semoga samawa, bahagia dunia akhirat ❤️",
    },
    {
      name: "Amanda",
      when: "3 hari lalu",
      text: "Alhamdulillah, terharu banget, samawa yak",
    },
    {
      name: "Gilang",
      when: "3 hari lalu",
      text: "Happy wedding broo...",
    },
  ];
});

async function submit() {
  if (!name.value.trim() || !message.value.trim()) return;
  submitting.value = true;
  errorMsg.value = "";
  try {
    await submitUcapan(slug.value, {
      guest_name: name.value.trim(),
      message: message.value.trim(),
    });
    name.value = "";
    message.value = "";
    await refetch();
  } catch (err: any) {
    errorMsg.value = err.message || "Gagal mengirim ucapan";
  } finally {
    submitting.value = false;
  }
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

    <div class="w-content">
      <!-- Header Title & Intro -->
      <div class="w-header-block">
        <h2 id="wish-title" class="w-title">Wedding Wish</h2>
        <p class="w-intro">Silakan kirimkan doa dan ucapan yang tulus untuk kami:</p>
      </div>

      <!-- Form Inputs -->
      <form class="w-form" @submit.prevent="submit">
        <input
          v-model="name"
          class="w-input"
          type="text"
          placeholder="Nama"
          required
        />

        <p class="w-form-label">Sampaikan ucapan selamat untuk pernikahan kami:</p>

        <textarea
          v-model="message"
          class="w-textarea"
          rows="4"
          required
        ></textarea>

        <p v-if="errorMsg" class="w-error">{{ errorMsg }}</p>

        <button class="w-submit" type="submit" :disabled="submitting">
          {{ submitting ? 'Mengirim...' : 'Kirim' }}
        </button>
      </form>

      <!-- White Wishes Card List -->
      <div class="w-card">
        <div class="w-list">
          <div v-for="(w, i) in wishes" :key="i" class="w-item">
            <span class="w-author">{{ w.name }}</span>
            <span class="w-when">{{ w.when }}</span>
            <p class="w-text">{{ w.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wish {
  position: relative;
  width: 100%;
  aspect-ratio: 375 / 890;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  background: #880000;
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

.w-bg { z-index: 0; }
.w-florL { z-index: 1; }
.w-florR { z-index: 2; }

.w-content {
  position: absolute;
  z-index: 6;
  top: 21.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.w-header-block {
  text-align: center;
  width: 100%;
}

.w-title {
  margin: 0 0 6px 0;
  font-family: var(--font-script, "Pinyon Script"), cursive;
  font-size: 11cqw;
  line-height: 1;
  color: #ffffff;
  font-weight: normal;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.w-intro {
  margin: 0 auto;
  width: 90%;
  text-align: center;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.8cqw;
  font-weight: bold;
  line-height: 1.35;
  color: #ffffff;
}

.w-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.w-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d4c5b9;
  background: #ffffff;
  color: #333333;
  font-size: 3.6cqw;
  font-family: Georgia, "Times New Roman", serif;
  box-sizing: border-box;
}

.w-input::placeholder {
  color: #a39589;
}

.w-form-label {
  margin: 14px 0 6px 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.8cqw;
  font-weight: bold;
  line-height: 1.35;
  color: #ffffff;
  text-align: left;
}

.w-textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid #d4c5b9;
  background: #ffffff;
  color: #333333;
  font-size: 3.6cqw;
  font-family: Georgia, "Times New Roman", serif;
  box-sizing: border-box;
  resize: vertical;
}

.w-submit {
  margin: 16px auto 0;
  padding: 8px 36px;
  background: #faf4ea;
  color: #880000;
  border: none;
  border-radius: 24px;
  font-weight: bold;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 4cqw;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, background 0.2s;
}

.w-submit:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.w-submit:active {
  transform: translateY(0);
}

.w-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.w-error {
  color: #ff9999;
  font-size: 3cqw;
  margin: 6px 0 0 0;
  text-align: center;
}

/* White Card Container for Wishes */
.w-card {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  margin-top: 4px;
}

.w-list {
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.w-list::-webkit-scrollbar {
  width: 4px;
}
.w-list::-webkit-scrollbar-track {
  background: #f5f0eb;
  border-radius: 4px;
}
.w-list::-webkit-scrollbar-thumb {
  background: #c2b2a3;
  border-radius: 4px;
}

.w-item {
  border-bottom: 1px solid #f0e6df;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.w-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.w-author {
  display: block;
  font-weight: bold;
  color: #222222;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.8cqw;
  line-height: 1.2;
}

.w-when {
  display: block;
  font-size: 3cqw;
  color: #8c827a;
  font-family: Georgia, "Times New Roman", serif;
  margin-top: 2px;
  margin-bottom: 6px;
}

.w-text {
  margin: 0;
  color: #38302a;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 3.4cqw;
  line-height: 1.45;
}

.w-bg { opacity: 1; }
.wish.shown .w-florL { animation: wFlyL 1.25s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.wish.shown .w-florR { animation: wFlyR 1.25s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
.wish.shown .w-header-block { animation: wRiseText 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
.wish.shown .w-form { animation: wRiseText 1.5s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
.wish.shown .w-card { animation: wRiseText 1.6s cubic-bezier(0.16,1,0.3,1) 0.7s both; }

@keyframes wFlyL { 0% { opacity: 0; filter: blur(3px); transform: translateX(-10%); } 100% { opacity: 1; filter: blur(0); transform: translateX(0); } }
@keyframes wFlyR { 0% { opacity: 0; filter: blur(3px); transform: translateX(10%); } 100% { opacity: 1; filter: blur(0); transform: translateX(0); } }
@keyframes wRiseText { 0% { opacity: 0; transform: translateY(24px); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
</style>
