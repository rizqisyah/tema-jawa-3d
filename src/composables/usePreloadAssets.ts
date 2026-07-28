import { ref } from 'vue'

// Import cover images
import scenery from '../assets/cover/scenery.png'
import mist from '../assets/cover/cl/mist.png'
import tl from '../assets/cover/cl/tl.png'
import tr from '../assets/cover/cl/tr.png'
import ml from '../assets/cover/cl/ml.png'
import mr from '../assets/cover/cl/mr.png'
import bl from '../assets/cover/cl/bl.png'
import br from '../assets/cover/cl/br.png'
import bc from '../assets/cover/cl/bc.png'

// Import critical invite images for background preloading
import heroBg1 from '../assets/invite/hero/parts/landscape1.png'
import heroBg2 from '../assets/invite/hero/parts/landscape2.png'
import heroJoglo from '../assets/invite/hero/parts/joglo.png'
import heroCouple from '../assets/invite/hero/parts/couple.png'
import quoteBg from '../assets/invite/quote/parts/bg.png'
import groomBg from '../assets/invite/groom/parts/bg.png'
import brideBg from '../assets/invite/bride/parts/bg.png'
import saveDateBg from '../assets/invite/savedate/parts/bg.png'
import akadBg from '../assets/invite/akad/parts/bg.png'
import akadFrame from '../assets/invite/akad/parts/frame.png'
import resBg from '../assets/invite/resepsi/parts/bg.png'
import resFrame from '../assets/invite/resepsi/parts/frame.png'
import galleryBase from '../assets/invite/gallery/parts/base.png'

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
    // Preload invite body images asynchronously without blocking
    Promise.all(bodyImages.map(preloadImage)).then(() => {
      bodyLoaded.value = true
    })
  }

  return {
    coverLoaded,
    bodyLoaded,
    preloadCover,
    preloadInviteBody,
  }
}
