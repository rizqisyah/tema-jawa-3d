import { ref } from 'vue'

// Import cover images
import scenery from '../assets/cover/scenery.webp'
import mist from '../assets/cover/cl/mist.webp'
import tl from '../assets/cover/cl/tl.webp'
import tr from '../assets/cover/cl/tr.webp'
import ml from '../assets/cover/cl/ml.webp'
import mr from '../assets/cover/cl/mr.webp'
import bl from '../assets/cover/cl/bl.webp'
import br from '../assets/cover/cl/br.webp'
import bc from '../assets/cover/cl/bc.webp'

// Import critical invite images for background preloading
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

const coverImages = [scenery, mist, tl, tr, ml, mr, bl, br, bc]
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
      img.onerror = () => resolve() // resolve even on error so app won't stall
    }
  })
}

export function usePreloadAssets() {
  async function preloadCover() {
    if (coverLoaded.value) return
    await Promise.all(coverImages.map(preloadImage))
    coverLoaded.value = true
  }

  function preloadInviteBody() {
    if (bodyLoaded.value) return
    // Preload invite body images asynchronously during idle time
    const loadBody = () => {
      Promise.all(bodyImages.map(preloadImage)).then(() => {
        bodyLoaded.value = true
      })
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadBody, { timeout: 2000 })
    } else {
      setTimeout(loadBody, 200)
    }
  }

  return {
    coverLoaded,
    bodyLoaded,
    preloadCover,
    preloadInviteBody,
  }
}
