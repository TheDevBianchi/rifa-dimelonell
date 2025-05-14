// hooks/useDollarPrice.js
import { useSettingsStore } from '@/store/use-settings-store'

export function useDollarPrice () {
  const { dollarPrice, getDollarPrice, updateDollarPrice } = useSettingsStore()

  return {
    dollarPrice,
    getDollarPrice,
    updateDollarPrice
  }
}
