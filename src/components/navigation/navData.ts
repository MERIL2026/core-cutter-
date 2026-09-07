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
      { label: 'AC Core Cutting', href: '/services/ac-core-cutting' },
      { label: 'RCC Core Cutting', href: '/services/rcc-core-cutting' },
      { label: 'AC Drain Hole', href: '/services/ac-drain-hole' },
      { label: 'Concrete Wall Drilling', href: '/services/concrete-wall-drilling' },
      { label: 'Pipe & Cable Passage', href: '/services/pipe-cable-passage' },
      { label: 'Other Services', href: '/services/other' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
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

