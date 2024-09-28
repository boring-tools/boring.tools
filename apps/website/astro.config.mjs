import starlight from '@astrojs/starlight'
// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  outDir: '../../build/website',
  integrations: [
    starlight({
      title: 'boring.tools',
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
