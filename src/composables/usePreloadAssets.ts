import { ref } from 'vue'

// Import cover scenery for fast, lightweight first render
import scenery from '../assets/cover/scenery.webp'

// Import critical invite images for sequential preloading
import heroBg1 from '../assets/invite/hero/parts/landscape1.webp'
import heroBg2 from '../assets/invite/hero/parts/landscape2.webp'
import heroJoglo from '../assets/invite/hero/parts/joglo.webp'
import heroCouple from '../assets/invite/hero/parts/couple.webp'
import quoteBg from '../assets/invite/quote/parts/bg.webp'
import groomBg from '../assets/invite/groom/parts/bg.webp'
import brideBg from '../assets/invite/bride/parts/bg.webp'
import saveDateBg from '../assets/invite/savedate/parts/bg.webp'
import akadBg from '../assets/invite/akad/parts/bg.webp'
import akadFrame from '../assets/invite/akad/parts/frame.webp'
import resBg from '../assets/invite/resepsi/parts/bg.webp'
import resFrame from '../assets/invite/resepsi/parts/frame.webp'
import galleryBase from '../assets/invite/gallery/parts/base.webp'

const bodyImages = [
  heroBg1,
  heroBg2,
  heroJoglo,
  heroCouple,
  quoteBg,
  groomBg,
  brideBg,
  saveDateBg,
  akadBg,
  akadFrame,
  resBg,
  resFrame,
  galleryBase,
]

const coverLoaded = ref(false)
const bodyLoaded = ref(false)

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    if (img.complete) {
      resolve()
    } else {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    }
  })
}

export function usePreloadAssets() {
  async function preloadCover() {
    if (coverLoaded.value) return
    // Only preload the base scenery; cover layers will stream naturally without memory spike
    await preloadImage(scenery)
    coverLoaded.value = true
  }

  function preloadInviteBody() {
    if (bodyLoaded.value) return
    const loadBody = async () => {
      // Preload sequentially to avoid memory spikes on iOS WebKit
      for (const img of bodyImages) {
        await preloadImage(img)
      }
      bodyLoaded.value = true
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => { loadBody() }, { timeout: 3000 })
    } else {
      setTimeout(loadBody, 1000)
    }
  }

  return {
    coverLoaded,
    bodyLoaded,
    preloadCover,
    preloadInviteBody,
  }
}
