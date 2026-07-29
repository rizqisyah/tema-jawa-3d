import { ref, computed, onMounted } from 'vue'
import { resolveSlug, getHome } from '../lib/api'

const state = ref<{
  loading: boolean
  error: string | null
  data: any | null
}>({
  loading: true,
  error: null,
  data: null,
})

function applyTheme(themeData: any, weddingData: any) {
  const cfg = themeData?.theme_config
  let override = weddingData?.theme_override
  if (typeof override === 'string') {
    try {
      override = JSON.parse(override)
    } catch {
      override = {}
    }
  }
  override = override || {}

  const root = document.documentElement
  const colors = { ...(cfg?.colors || {}), ...(override?.colors || {}) }
  const fonts = { ...(cfg?.fonts || {}), ...(override?.fonts || {}) }

  if (colors.primary) root.style.setProperty('--maroon-title', colors.primary)
  if (colors.secondary) root.style.setProperty('--maroon-text', colors.secondary)
  if (colors.accent) root.style.setProperty('--gold', colors.accent)
  if (colors.bg_body) root.style.setProperty('--bg-body', colors.bg_body)

  if (fonts.script) root.style.setProperty('--font-script', fonts.script)
  if (fonts.hand) root.style.setProperty('--font-hand', fonts.hand)
}

export function useWedding() {
  const slug = ref(resolveSlug())
  const guestCode = ref(new URLSearchParams(window.location.search).get('to') || '')

  async function fetchWeddingData() {
    state.value.loading = true
    state.value.error = null
    try {
      const data = await getHome(slug.value, guestCode.value)
      if (!data || !data.wedding) {
        throw new Error('Undangan ini bersifat privat dan hanya dapat diakses melalui link resmi.')
      }
      if (guestCode.value && !data.guest) {
        throw new Error('Undangan ini bersifat privat dan hanya dapat diakses melalui link resmi.')
      }
      state.value.data = data
      if (data?.theme || data?.wedding) {
        applyTheme(data.theme, data.wedding)
      }
      if (data?.wedding?.title) {
        document.title = `${data.wedding.title} - Undangan Pernikahan`
      }
    } catch (err: any) {
      console.error('Failed to load wedding data:', err)
      let msg = err instanceof Error ? err.message : 'Undangan ini bersifat privat dan hanya dapat diakses melalui link resmi.'
      if (msg.includes('404') || msg.includes('not found') || msg.includes('Request failed')) {
        msg = 'Undangan ini bersifat privat dan hanya dapat diakses melalui link resmi.'
      }
      state.value.error = msg
    } finally {
      state.value.loading = false
    }
  }

  onMounted(() => {
    if (!state.value.data && state.value.loading) {
      fetchWeddingData()
    }
  })

  const wedding = computed(() => state.value.data?.wedding ?? null)
  const theme = computed(() => state.value.data?.theme ?? null)
  const guest = computed(() => state.value.data?.guest ?? null)
  const content = computed(() => state.value.data?.content ?? null)

  const pengantin = computed(() => content.value?.pengantin ?? state.value.data?.pengantin ?? [])
  const acara = computed(() => content.value?.acara ?? state.value.data?.acara ?? [])
  const gallery = computed(() => content.value?.gallery ?? state.value.data?.gallery ?? [])
  const gift = computed(() => content.value?.gift ?? content.value?.rekening ?? state.value.data?.gift ?? state.value.data?.rekening ?? [])
  const wishes = computed(() => content.value?.wishes ?? content.value?.ucapan ?? state.value.data?.wishes ?? state.value.data?.ucapan ?? [])

  const groom = computed(() => {
    return pengantin.value.find((p: any) => 
      p.type?.toLowerCase() === 'groom' || p.type?.toLowerCase() === 'pria'
    ) ?? pengantin.value[0] ?? null
  })

  const bride = computed(() => {
    return pengantin.value.find((p: any) => 
      p.type?.toLowerCase() === 'bride' || p.type?.toLowerCase() === 'wanita'
    ) ?? pengantin.value[1] ?? null
  })

  const coupleNickname = computed(() => {
    const groomNick = groom.value?.nickname?.trim() || (groom.value?.name ? groom.value.name.split(' ')[0] : '')
    const brideNick = bride.value?.nickname?.trim() || (bride.value?.name ? bride.value.name.split(' ')[0] : '')
    if (groomNick && brideNick) {
      return `${groomNick} & ${brideNick}`
    }
    if (wedding.value?.title) return wedding.value.title
    return 'Pengantin'
  })

  const quoteText = computed(() => wedding.value?.theme_override?.quote?.text || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.')
  const quoteVerse = computed(() => wedding.value?.theme_override?.quote?.verse || 'QS. Ar-Rum: 21')

  return {
    slug,
    guestCode,
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),
    wedding,
    theme,
    guest,
    pengantin,
    acara,
    gallery,
    gift,
    wishes,
    groom,
    bride,
    coupleNickname,
    quoteText,
    quoteVerse,
    refetch: fetchWeddingData,
  }
}
