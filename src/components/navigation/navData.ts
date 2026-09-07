export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'AC Core Cutting (2″-5″)', href: '/services/ac-core-cutting' },
      { label: 'RCC Beam & Slab Coring', href: '/services/rcc-core-cutting' },
      { label: 'AC Drain Hole Drilling', href: '/services/ac-drain-hole' },
      { label: 'Concrete Wall Penetration', href: '/services/concrete-wall-drilling' },
      { label: 'Pipe & Cable Passage', href: '/services/pipe-cable-passage' },
      { label: 'Other Custom Coring', href: '/services/other' },
    ],
  },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export const footerQuickLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'All Services', href: '/services' },
  { label: 'Project Gallery', href: '/gallery' },
  { label: 'Customer Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Contact Us', href: '/contact' },
];

