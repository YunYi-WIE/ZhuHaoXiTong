import { defineStore } from 'pinia'

import { ref, computed } from 'vue'

import { getSiteBranding } from '@/api/site'

import defaultLogo from '@/assets/logo.png'



export const useSiteBrandingStore = defineStore('siteBranding', () => {

  const siteName = ref('云骁游戏')

  const logoUrl = ref('')

  const customerWechat = ref('')

  const customerQrUrl = ref('')

  const detailDisclaimer = ref('')

  const payChannelHint = ref('')

  const paySuccessNotice = ref('')

  const paySuccessPopupEnabled = ref(true)

  const loaded = ref(false)



  const effectiveLogo = computed(() => (logoUrl.value ? logoUrl.value : defaultLogo))



  async function fetchBranding() {

    try {

      const data = await getSiteBranding()

      if (data && typeof data.siteName === 'string' && data.siteName.trim()) {

        siteName.value = data.siteName.trim()

      }

      if (data && typeof data.logoUrl === 'string' && data.logoUrl.trim()) {

        logoUrl.value = data.logoUrl.trim()

      } else {

        logoUrl.value = ''

      }

      customerWechat.value =

        data && typeof data.customerWechat === 'string' ? data.customerWechat.trim() : ''

      customerQrUrl.value =

        data && typeof data.customerQrUrl === 'string' ? data.customerQrUrl.trim() : ''

      detailDisclaimer.value =

        data && typeof data.detailDisclaimer === 'string' ? data.detailDisclaimer.trim() : ''

      payChannelHint.value =

        data && typeof data.payChannelHint === 'string' ? data.payChannelHint.trim() : ''

      paySuccessNotice.value =

        data && typeof data.paySuccessNotice === 'string' ? data.paySuccessNotice.trim() : ''

      if (data && typeof data.paySuccessPopupEnabled === 'boolean') {

        paySuccessPopupEnabled.value = data.paySuccessPopupEnabled

      } else {

        paySuccessPopupEnabled.value = true

      }

    } catch {

      /* 保持默认 */

    } finally {

      loaded.value = true

    }

  }



  return {

    siteName,

    logoUrl,

    customerWechat,

    customerQrUrl,

    detailDisclaimer,

    payChannelHint,

    paySuccessNotice,

    paySuccessPopupEnabled,

    loaded,

    effectiveLogo,

    fetchBranding,

  }

})

