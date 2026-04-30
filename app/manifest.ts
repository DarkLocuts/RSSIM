import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name              :  'RS SEWA IPHONE MADIUN',
    short_name        :  'RSSIM',
    description       :  'Rental System Sewa IPhone Madiun',
    start_url         :  '/',
    scope             :  '/',
    id                :  '/',
    display           :  'standalone',
    orientation       :  'portrait',
    background_color  :  '#FAFDFF',
    theme_color       :  '#FAFDFF',
    dir               :  'ltr',
    lang              :  'id-ID',
    icons             :  [
      {
        src      :  '/logo.png',
        sizes    :  '192x192',
        type     :  'image/png',
        purpose  :  'any',
      },
      {
        src      :  '/logo.png',
        sizes    :  '512x512',
        type     :  'image/png',
        purpose  :  'maskable',
      },
    ],
  }
}
