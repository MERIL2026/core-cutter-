import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AC Core Cutting & Concrete Drilling Services',
    short_name: 'AC Core Cutting',
    description: 'Professional diamond core cutting and concrete drilling services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F3557',
    theme_color: '#0F3557',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
