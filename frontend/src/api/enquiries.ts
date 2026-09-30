import type { EnquiryPayload } from '../types/enquiry'
import { apiFetch } from './client'

export const enquiryApi = {
  create(payload: EnquiryPayload) {
    return apiFetch<{ message: string }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
