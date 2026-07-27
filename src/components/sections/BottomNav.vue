<template>
  <nav class="bottom-nav" aria-label="Navigasi bagian undangan">
    <ul class="bottom-nav-list">
      <li v-for="item in ITEMS" :key="item.section" class="bottom-nav-item">
        <button
          class="bottom-nav-link"
          :class="{ 'is-active': active === item.section }"
          type="button"
          @click="goTo(item.target)"
        >
          <svg
            class="bottom-nav-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <template v-if="item.section === 'hero'">
              <path d="M1.3 13.3 12 2.7l10.7 10.6" />
              <path d="M4 12.5v7.5a1.3 1.3 0 0 0 1.3 1.3h13.4a1.3 1.3 0 0 0 1.3-1.3v-7.5" />
            </template>
            <template v-else-if="item.section === 'couple'">
              <circle cx="5.5" cy="5" r="2.8" />
              <circle cx="18.5" cy="5" r="2.8" />
              <rect x="1.7" y="11.6" width="7.6" height="10.2" rx="2" />
              <rect x="14.7" y="11.6" width="7.6" height="10.2" rx="2" />
            </template>
            <template v-else-if="item.section === 'events'">
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <path d="M8 2v3M16 2v3" />
            </template>
            <template v-else>
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="m3 15 3.1-3.1a2 2 0 0 1 2.8 0L18 21" />
            </template>
          </svg>
          <span class="bottom-nav-label">{{ item.label }}</span>
        </button>
      </li>

      <!-- Music Toggle -->
      <li v-if="musicUrl" class="bottom-nav-item">
        <button class="bottom-nav-link" type="button" @click="toggleMusic">
          <svg
            v-if="!playing"
            class="bottom-nav-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <svg
            v-else
            class="bottom-nav-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
          <span class="bottom-nav-label">{{ playing ? 'Pause' : 'Play' }}</span>
        </button>
      </li>
    </ul>

    <audio
      ref="audioEl"
      :src="musicUrl"
      loop
      preload="auto"
      @play="playing = true"
      @pause="playing = false"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWedding } from '../../composables/useWedding'

const { wedding } = useWedding()

const musicUrl = computed(() => wedding.value?.music_url || 'https://qinvi-worker.kesone01.workers.dev/Music/Brian McKnight - Back At One (Lyrics) (mp3cut.net).mp3')

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const active = ref('hero')

const ITEMS = [
  { section: 'hero', target: '#invite', label: 'Home' },
  { section: 'couple', target: '.groom', label: 'Mempelai' },
  { section: 'events', target: '.event', label: 'Acara' },
  { section: 'wish', target: '.wish', label: 'Ucapan' },
]

function goTo(target: string) {
  const el = document.querySelector(target)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function playMusic() {
  if (!audioEl.value) return
  try {
    await audioEl.value.play()
    playing.value = true
  } catch {
    playing.value = false
  }
}

function toggleMusic() {
  if (!audioEl.value) return
  if (playing.value) {
    audioEl.value.pause()
  } else {
    playMusic()
  }
}

onMounted(() => {
  playMusic()
})

onBeforeUnmount(() => {
  audioEl.value?.pause()
})
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 70;
  width: 360px;
  max-width: calc(100vw - 32px);
  transform: translateX(-50%);
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
}

@media (min-width: 768px) {
  .bottom-nav {
    left: auto !important;
    right: 240px !important;
    transform: translateX(50%) !important;
  }
}

.bottom-nav-list {
  display: flex;
  height: 56px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.bottom-nav-item {
  flex: 1;
  min-width: 0;
}

.bottom-nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 30px;
  background: none;
  color: #905d2a;
  cursor: pointer;
  transition: color 0.2s, transform 0.1s;
}

.bottom-nav-link:active {
  transform: scale(0.95);
}

.bottom-nav-link.is-active {
  color: #900202;
  font-weight: bold;
}

.bottom-nav-label {
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
}
</style>
