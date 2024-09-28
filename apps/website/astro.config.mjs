import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  outDir: '../../build/website',
  integrations: [
    starlight({
      title: 'boring.tools',
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://umami.hashdot.co/script.js',
            'data-website-id': '78b1d598-5783-4bc5-a414-4319fea1876a',
            defer: true,
          },
        },
      ],
      social: {
        github: 'https://github.com/boring-tools/boring.tools',
      },
      favicon: '/public/favicon.svg',
      sidebar: [
        {
          label: 'Guides',
          items: [{ label: 'Getting started', slug: 'guides/getting-started' }],
        },
        // {
        // 	label: 'Reference',
        // 	autogenerate: { directory: 'reference' },
        // },
      ],
    }),
  ],
})
