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

/*
 * Multiple components call useWedding() and mount at the same tick.
 * We use `inflight` to deduplicate concurrent requests.
 */
let inflight: Promise<void> | null = null

function getGuestCode(): string {
  if (typeof window === 'undefined') return ''
  const searchParams = new URLSearchParams(window.location.search)
  return (
    searchParams.get('to') ||
    searchParams.get('k') ||
    searchParams.get('code') ||
    searchParams.get('guest') ||
    ''
  ).trim()
}

const slug = ref(resolveSlug())
const guestCode = ref(getGuestCode())

async function fetchWeddingData() {
  slug.value = resolveSlug()
  guestCode.value = getGuestCode()
  state.value.loading = true
  state.value.error = null
  try {
    const data = await getHome(slug.value, guestCode.value)
    if (!data || !data.wedding) {
      throw new Error('Undangan tidak ditemukan atau tautan tidak valid.')
    }

    // Only restrict access if the wedding owner explicitly enabled restrict_to_guests
    // and the guest is not in the authorized guest list
    if (data.wedding?.restrict_to_guests && !data.guest) {
      throw new Error('Undangan ini bersifat privat dan hanya dapat diakses melalui link resmi tamu yang terdaftar.')
    }

    // Preserve and merge any preview overrides if present
    const currentWedding = state.value.data?.wedding
    let currentOverride = currentWedding?.theme_override
    if (typeof currentOverride === 'string') {
      try { currentOverride = JSON.parse(currentOverride) } catch { currentOverride = {} }
    }
    let dataOverride = data?.wedding?.theme_override
    if (typeof dataOverride === 'string') {
      try { dataOverride = JSON.parse(dataOverride) } catch { dataOverride = {} }
    }

    state.value.data = {
      ...data,
      wedding: {
        ...(data?.wedding || {}),
        ...(currentWedding || {}),
        theme_override: {
          ...(dataOverride || {}),
          ...(currentOverride || {}),
        },
      },
      theme: state.value.data?.theme || data?.theme,
    }

    if (state.value.data?.theme || state.value.data?.wedding) {
      applyTheme(state.value.data.theme, state.value.data.wedding)
    }
    if (state.value.data?.wedding?.title) {
      document.title = `${state.value.data.wedding.title} - Undangan Pernikahan`
    }
  } catch (err: any) {
    console.error('Failed to load wedding data:', err)
    state.value.error = err instanceof Error ? err.message : 'Gagal memuat data undangan.'
  } finally {
    state.value.loading = false
  }
}

// Listen for live preview messages from the admin dashboard ("Mode Imajinasi")
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'QINVI_PREVIEW_UPDATE') {
      const { wedding: previewWedding, theme: previewTheme, refetch } = event.data

      if (previewWedding) {
        let resolvedWedding = { ...previewWedding }
        if (typeof resolvedWedding.theme_override === 'string') {
          try {
            resolvedWedding.theme_override = JSON.parse(resolvedWedding.theme_override)
          } catch (e) {
            console.error('Failed to parse theme_override:', e)
          }
        }

        const existingOverride = state.value.data?.wedding?.theme_override || {}
        const mergedOverride = {
          ...existingOverride,
          ...(resolvedWedding.theme_override || {}),
        }

        state.value.data = {
          ...(state.value.data || {}),
          wedding: {
            ...(state.value.data?.wedding || {}),
            ...resolvedWedding,
            theme_override: mergedOverride,
          },
        }
      }

      if (previewTheme) {
        state.value.data = {
          ...(state.value.data || {}),
          theme: previewTheme,
        }
      }

      if (state.value.data?.theme || state.value.data?.wedding) {
        applyTheme(state.value.data.theme, state.value.data.wedding)
      }

      if (refetch || !state.value.data?.content) {
        inflight = null
        fetchWeddingData()
      }
    }
  })
}

export function useWedding() {
  onMounted(() => {
    if (state.value.data?.wedding || state.value.data?.content) return
    inflight ??= fetchWeddingData().finally(() => {
      inflight = null
    })
  })

  const wedding = computed(() => state.value.data?.wedding ?? null)
  const theme = computed(() => state.value.data?.theme ?? null)
  const guest = computed(() => state.value.data?.guest ?? null)
  const content = computed(() => state.value.data?.content ?? state.value.data ?? null)

  const pengantin = computed(() => content.value?.pengantin ?? state.value.data?.pengantin ?? [])
  const acara = computed(() => content.value?.acara ?? state.value.data?.acara ?? [])
  const gift = computed(() => content.value?.gift ?? content.value?.rekening ?? state.value.data?.gift ?? state.value.data?.rekening ?? [])
  const hasGift = computed(() => {
    if (!Array.isArray(gift.value)) return false
    return gift.value.some((g: any) => Boolean(
      (g?.account_number || g?.no_rekening || g?.number || '').toString().trim() ||
      (g?.account_name || g?.nama_rekening || g?.holder || '').toString().trim()
    ))
  })
  const wishes = computed(() => content.value?.wishes ?? content.value?.ucapan ?? state.value.data?.wishes ?? state.value.data?.ucapan ?? [])

  const isGroomFirst = computed(() => {
    if (!wedding.value) return true
    if (parsedOverride.value?.order_groom_first !== undefined) {
      return Boolean(parsedOverride.value.order_groom_first)
    }
    return wedding.value.order_groom_first !== false
  })

  const groom = computed(() => {
    return pengantin.value.find((p: any) => 
      p.type?.toLowerCase() === 'groom' || p.type?.toLowerCase() === 'pria'
    ) ?? (isGroomFirst.value ? pengantin.value[0] : pengantin.value[1]) ?? null
  })

  const bride = computed(() => {
    return pengantin.value.find((p: any) => 
      p.type?.toLowerCase() === 'bride' || p.type?.toLowerCase() === 'wanita'
    ) ?? (isGroomFirst.value ? pengantin.value[1] : pengantin.value[0]) ?? null
  })

  const coupleNickname = computed(() => {
    const groomNick = groom.value?.nickname?.trim() || (groom.value?.name ? groom.value.name.split(' ')[0] : '')
    const brideNick = bride.value?.nickname?.trim() || (bride.value?.name ? bride.value.name.split(' ')[0] : '')
    if (groomNick && brideNick) {
      return isGroomFirst.value ? `${groomNick} & ${brideNick}` : `${brideNick} & ${groomNick}`
    }
    if (wedding.value?.title) return wedding.value.title
    return isGroomFirst.value ? 'Antonio & Allysa' : 'Allysa & Antonio'
  })

  const parsedOverride = computed(() => {
    let ov = wedding.value?.theme_override
    if (typeof ov === 'string') {
      try { ov = JSON.parse(ov) } catch { ov = {} }
    }
    return ov || {}
  })

  const gallery = computed(() => {
    const list = content.value?.gallery ?? state.value.data?.gallery ?? parsedOverride.value?.gallery ?? []
    return Array.isArray(list) ? list : []
  })

  const couplePhoto = computed(() => {
    let ov = parsedOverride.value
    return (
      wedding.value?.image_spouse ||
      wedding.value?.['image-spouse'] ||
      content.value?.image_spouse ||
      ov?.images?.image_spouse ||
      ov?.images?.['image-spouse'] ||
      ov?.images?.foto_pasangan ||
      ov?.images?.foto_mempelai_setelah_buka ||
      theme.value?.theme_config?.images?.image_spouse ||
      wedding.value?.image_cover ||
      wedding.value?.image_bg1 ||
      ''
    )
  })

  const quoteText = computed(() => 
    parsedOverride.value?.quote?.text || 
    wedding.value?.theme_override?.quote?.text || 
    'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.'
  )
  const quoteVerse = computed(() => 
    parsedOverride.value?.quote?.verse || 
    wedding.value?.theme_override?.quote?.verse || 
    'QS. Ar-Rum: 21'
  )

  const countdownDate = computed(() => {
    if (wedding.value?.countdown_date) return wedding.value.countdown_date
    const ov = parsedOverride.value as any
    const overrideDate =
      ov?.TanggalCountdown ||
      ov?.words?.TanggalCountdown ||
      ov?.countdown_date ||
      ov?.words?.countdown_date ||
      wedding.value?.TanggalCountdown
    if (overrideDate) return overrideDate
    const firstEvent = acara.value?.[0]
    if (firstEvent?.event_date) return firstEvent.event_date
    return null
  })

  return {
    slug,
    guestCode,
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),
    wedding,
    theme,
    guest,
    content,
    pengantin,
    acara,
    gallery,
    gift,
    hasGift,
    wishes,
    groom,
    bride,
    isGroomFirst,
    coupleNickname,
    couplePhoto,
    parsedOverride,
    quoteText,
    quoteVerse,
    countdownDate,
    refetch: async () => {
      inflight = null
      return fetchWeddingData()
    },
  }
}

