// Everything search engines read about the business lives here: the facts (name, phone,
// authority numbers), the keyword map, and the copy for the service and area landing pages.
// The homepage design never reads this file except through <head> metadata and JSON-LD.

export const SITE_URL = 'https://www.bigmacktrucking.com';

export const BUSINESS = {
  name: 'Big Mack Trucking LLC',
  shortName: 'Big Mack Trucking',
  owner: 'Omari Headley',
  phone: '+1-516-508-8078',
  phoneDisplay: '(516) 508-8078',
  phoneHref: 'tel:5165088078',
  email: 'Bigmacklogisticsa1@gmail.com',
  usdot: '3843409',
  mc: '1398475',
  // Leave null to stay a service-area business (no public street address). If you want
  // map-pack rankings tied to a yard or office, fill this in AND use the exact same address
  // on your Google Business Profile.
  address: null,
};

// Keyword map, grouped by search intent. The root layout publishes the whole list in the
// keywords meta tag; each landing page targets its own cluster in its title, H1 and copy,
// which is what actually moves rankings.
export const KEYWORDS = {
  brand: [
    'Big Mack Trucking',
    'Big Mack Trucking LLC',
    'Big Mack Logistics',
    'USDOT 3843409',
    'MC 1398475',
    'Omari Headley trucking',
  ],
  equipment: [
    '26 ft box truck',
    '26 foot box truck for hire',
    'dock high box truck',
    'straight truck freight',
    'box truck with liftgate',
    'box truck with pallet jack',
    '12 pallet box truck',
    'box truck carrier',
    'box truck owner operator',
    'non-CDL box truck freight',
  ],
  service: [
    'expedited freight',
    'expedited trucking company',
    'expedited shipping',
    'hot shot box truck',
    'same day freight delivery',
    'next day freight delivery',
    'dedicated box truck',
    'direct freight delivery',
    'liftgate delivery service',
    'residential liftgate delivery',
    'pallet delivery service',
    'pallet shipping',
    'partial truckload',
    'LTL alternative',
    'final mile delivery',
    'last mile freight delivery',
    'construction site delivery',
    'trade show freight',
    'freight hauling',
    '24/7 trucking dispatch',
    'box truck carrier for freight brokers',
  ],
  portAndAir: [
    'TWIC certified carrier',
    'TWIC trucking',
    'Port Newark trucking',
    'Port Elizabeth trucking',
    'marine terminal pickup',
    'container freight station pickup',
    'bonded freight carrier',
    'air cargo recovery',
    'JFK air cargo trucking',
    'Newark airport cargo trucking',
    'Red Hook terminal trucking',
  ],
  location: [
    'box truck service NYC',
    'trucking company New York',
    'freight delivery Brooklyn',
    'freight delivery Queens',
    'Manhattan freight delivery',
    'trucking company Long Island',
    'box truck Long Island',
    'Nassau County trucking',
    'Suffolk County freight delivery',
    'New Jersey box truck',
    'NJ liftgate delivery',
    'New York to New Jersey freight',
    'Northeast expedited freight',
    'nationwide box truck carrier',
    'interstate trucking',
  ],
};

export const ALL_KEYWORDS = Object.values(KEYWORDS).flat();

// ---------------------------------------------------------------------------------------------
// Landing pages. Each one answers a different search with facts specific to that search, so
// none of them read as a copy of another with the city name swapped (Google treats those as
// doorway pages and drops them).
// ---------------------------------------------------------------------------------------------

export const SERVICES = [
  {
    slug: 'expedited-freight',
    name: 'Expedited Freight',
    title: 'Expedited Box Truck Freight, 24/7 Dispatch',
    description:
      'Expedited box truck freight from New York to anywhere in the lower 48. One truck, one driver, no terminal transfers. Hot loads dispatched 24/7: (516) 508-8078.',
    h1: 'Expedited box truck freight, direct and on time.',
    lede:
      'When a load cannot wait for an LTL network, it goes on one truck and stays on it. Big Mack Trucking runs time-critical freight direct from pickup to delivery, out of the New York metro and nationwide.',
    keywords: ['expedited freight', 'expedited trucking company', 'hot shot box truck', 'same day freight delivery', 'next day freight delivery', 'dedicated box truck'],
    sections: [
      {
        heading: 'Why direct beats the network',
        body: [
          'LTL freight is sorted through terminals, rehandled and often re-trucked. Every touch adds hours and risk. An expedited box truck loads your freight once, drives it straight to the consignee, and unloads it once.',
          'A direct run avoids terminal transfers and rehandling. Dispatch can confirm the expected transit time for your lane.',
        ],
      },
      {
        heading: 'What we haul',
        list: [
          'Hot loads and production-down parts',
          'Retail replenishment and store openings',
          'Trade show and event freight with a hard move-in time',
          'Air freight recovered from JFK or Newark that has to keep moving',
          'Freight brokers’ expedited loads that need a reliable carrier tonight',
        ],
      },
      {
        heading: 'One number, one driver',
        body: [
          'The owner, Omari Headley, drives the truck. The person who answers dispatch at 2 a.m. is the person hauling your freight, so status updates are first-hand, not relayed.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How fast can you pick up an expedited load?',
        a: 'Dispatch answers 24/7. Same-day pickup depends on truck availability and the lane. Call (516) 508-8078 with pickup, delivery, pallet count and weight for an answer.',
      },
      {
        q: 'Do you run expedited freight outside New York?',
        a: 'Yes. The truck is based in the New York metro and runs interstate under USDOT 3843409 and MC 1398475, so loads can deliver anywhere in the lower 48.',
      },
      {
        q: 'Can I book the whole truck?',
        a: 'Yes. Ask for a dedicated run and your freight is the only freight on the truck from pickup to delivery.',
      },
    ],
  },
  {
    slug: 'liftgate-delivery',
    name: 'Liftgate Delivery',
    title: 'Liftgate Delivery Service, 3,500-lb Liftgate + Pallet Jack',
    description:
      'Liftgate delivery to storefronts, homes, job sites and anywhere without a loading dock. 3,500-lb hydraulic liftgate and onboard pallet jack. NYC, Long Island, NJ and nationwide.',
    h1: 'Liftgate delivery when there is no loading dock.',
    lede:
      'A 3,500-lb hydraulic liftgate lowers pallets to street level and the onboard pallet jack rolls them inside. No forklift needed at either end.',
    keywords: ['liftgate delivery service', 'box truck with liftgate', 'residential liftgate delivery', 'construction site delivery', 'NJ liftgate delivery'],
    sections: [
      {
        heading: 'Where a liftgate earns its keep',
        list: [
          'Storefronts and restaurants on city streets',
          'Residential deliveries of appliances, furniture and equipment',
          'Construction and renovation job sites',
          'Offices, schools and churches without a dock',
          'Small warehouses and garages with a roll-up door only',
        ],
      },
      {
        heading: 'Equipment on every run',
        body: [
          'The truck carries a liftgate, pallet jack, ratchet straps and E-track. Confirm any delivery requirements and charges with dispatch when you book.',
        ],
      },
      {
        heading: 'Dock at one end, street at the other',
        body: [
          'The 26-ft box is dock-high, so pickup from a warehouse dock is as fast as any trailer. At a ground-level delivery the liftgate takes over. One truck covers both.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much weight can the liftgate lift?',
        a: 'The hydraulic liftgate is rated at 3,500 lb per lift, which covers most single pallets of freight.',
      },
      {
        q: 'Will the driver bring freight inside?',
        a: 'The onboard pallet jack moves pallets across a sidewalk or through a ground-level door. Tell dispatch about steps, elevators or long carries when you book so we can plan for them.',
      },
      {
        q: 'Do you deliver liftgate freight to residential addresses?',
        a: 'Yes. Residential liftgate deliveries are welcome. Provide the street, any parking restrictions and a contact who will be on site.',
      },
    ],
  },
  {
    slug: '26ft-dock-high-box-truck',
    name: '26 ft Dock-High Box Truck',
    title: '26 ft Dock-High Box Truck for Hire, Up to 12 Pallets',
    description:
      '26 ft dock-high straight box truck with driver, up to 12 standard 48x40 pallets, 26,000-lb GVWR, liftgate and pallet jack. Book a box truck carrier: (516) 508-8078.',
    h1: 'A 26-ft dock-high box truck, with the driver.',
    lede:
      'Twelve pallet positions, a floor at standard dock height, and a liftgate for everywhere else. Book the truck and the driver together, by the load or by the day.',
    keywords: ['26 ft box truck', '26 foot box truck for hire', 'dock high box truck', '12 pallet box truck', 'straight truck freight', 'non-CDL box truck freight'],
    sections: [
      {
        heading: 'Truck specs',
        specs: [
          ['Box', '26-ft straight box, dock-high floor'],
          ['Capacity', 'Up to 12 pallets, 48 × 40, two across'],
          ['Rating', '26,000-lb GVWR, non-CDL'],
          ['Liftgate', '3,500-lb hydraulic'],
          ['Onboard', 'Pallet jack, ratchet straps, E-track'],
          ['Access', 'TWIC-certified driver'],
        ],
      },
      {
        heading: 'Why dock-high matters',
        body: [
          'Most rental box trucks sit lower than a warehouse dock, so pallets have to be lifted or ramped on. A dock-high box lines up with the dock plate and a forklift drives straight in. Loading takes minutes, not an hour.',
        ],
      },
      {
        heading: 'Good fit for',
        list: [
          'Partial truckloads too big for LTL and too small for a 53-ft trailer',
          'Freight brokers who need a reliable straight-truck carrier',
          'Shippers who want a dedicated truck for a day of multi-stop deliveries',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many pallets fit in a 26-ft box truck?',
        a: 'Twelve standard 48 × 40 pallets, loaded two across. Oversized pallets or crates reduce that count; send dimensions with your quote request.',
      },
      {
        q: 'Do I need to rent the truck and find a driver?',
        a: 'No. You book a carrier, not a rental. The truck comes with an experienced, TWIC-certified driver and full operating authority.',
      },
      {
        q: 'Can you take a load from a broker?',
        a: 'Yes. Big Mack Trucking holds MC 1398475 and USDOT 3843409 and works directly with freight brokers. Send rate confirmations to Bigmacklogisticsa1@gmail.com.',
      },
    ],
  },
  {
    slug: 'twic-port-trucking',
    name: 'TWIC Port Trucking',
    title: 'TWIC Certified Carrier for Port Newark, Elizabeth & Red Hook',
    description:
      'TWIC-certified box truck carrier for Port Newark, Port Elizabeth, Red Hook and bonded warehouses. Contact dispatch about terminal access requirements. Dispatch 24/7.',
    h1: 'TWIC-certified box truck for port and terminal freight.',
    lede:
      'The driver has an active TWIC card for secure port and cargo-area access. Check with the specific terminal about its entry and escort requirements.',
    keywords: ['TWIC certified carrier', 'TWIC trucking', 'Port Newark trucking', 'Port Elizabeth trucking', 'marine terminal pickup', 'container freight station pickup', 'Red Hook terminal trucking'],
    sections: [
      {
        heading: 'Terminals we run',
        list: [
          'Port Newark and Port Elizabeth (Port Newark–Elizabeth Marine Terminal)',
          'Red Hook Container Terminal, Brooklyn',
          'Container freight stations and bonded warehouses around the port',
          'JFK and Newark Liberty air cargo buildings',
        ],
      },
      {
        heading: 'Loose freight, not containers',
        body: [
          'A box truck is the right tool for palletized cargo that has been devanned at a CFS or bonded warehouse: the portion of an import that has to keep moving to a store, a 3PL or a job site. For full containers you need a drayage chassis; for the pallets that come out of them, call us.',
        ],
      },
      {
        heading: 'What TWIC saves you',
        body: [
          'A TWIC card is one part of secure maritime access. The terminal also controls entry permissions, registration, appointments and cargo release. Confirm these requirements before sending a truck.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a TWIC card?',
        a: 'The Transportation Worker Identification Credential is issued by the TSA. It lets a vetted worker enter secure areas of ports and vessels without an escort.',
      },
      {
        q: 'Do you pull containers?',
        a: 'No. The 26-ft box truck carries palletized and loose freight. We pick up cargo released from CFS facilities, bonded warehouses and air cargo terminals.',
      },
    ],
  },
  {
    slug: 'air-cargo-recovery',
    name: 'Air Cargo Recovery',
    title: 'Air Cargo Recovery at JFK & Newark Airport',
    description:
      'Air freight recovery and delivery from JFK and Newark Liberty cargo terminals. TWIC-certified driver, dock-high box truck, liftgate for final delivery. 24/7 dispatch.',
    h1: 'Air cargo recovery from JFK and Newark.',
    lede:
      'Your shipment landed. Now it needs a truck for pickup at the cargo dock and delivery to its next destination. The homepage 3D route illustrates one such run.',
    keywords: ['air cargo recovery', 'JFK air cargo trucking', 'Newark airport cargo trucking', 'bonded freight carrier'],
    sections: [
      {
        heading: 'How a recovery runs',
        list: [
          'You send the airway bill number, the terminal and the delivery address',
          'Dispatch confirms the rate and the pickup window',
          'The truck backs onto the cargo building dock and loads at dock height',
          'Freight is delivered direct, by dock or by liftgate, with updates along the way',
        ],
      },
      {
        heading: 'Airports and cargo areas',
        body: [
          'JFK Air Cargo, Newark Liberty International cargo terminals, and the forwarder warehouses around both airports in Jamaica, Springfield Gardens, Elizabeth and Secaucus.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can you recover freight at night?',
        a: 'Yes. Dispatch answers 24/7, and recoveries are scheduled around the cargo handler’s release time.',
      },
      {
        q: 'Do you handle bonded freight?',
        a: 'A TWIC credential does not establish customs-bonded carrier authority. Tell dispatch and your customs broker if the shipment is in bond; confirm the required carrier authorization before booking.',
      },
    ],
  },
  {
    slug: 'pallet-delivery',
    name: 'Pallet Delivery',
    title: 'Pallet Delivery & Partial Truckload, 1 to 12 Pallets',
    description:
      'Direct pallet delivery and partial truckload service for 1 to 12 pallets. A faster, lower-damage LTL alternative with liftgate and pallet jack. Get a quote 24/7.',
    h1: 'Pallet delivery without the LTL terminal.',
    lede:
      'From a single pallet to twelve, your freight rides one truck from your dock to the consignee. No cross-dock, no rehandling, no guessing which day it shows up.',
    keywords: ['pallet delivery service', 'pallet shipping', 'partial truckload', 'LTL alternative', 'final mile delivery', 'last mile freight delivery'],
    sections: [
      {
        heading: 'LTL vs. a direct box truck',
        specs: [
          ['Handling', 'LTL: several terminals • Box truck: loaded once'],
          ['Transit', 'LTL: terminal network • Box truck: direct trip'],
          ['Delivery', 'Box truck: liftgate and pallet jack carried onboard'],
          ['Contact', 'LTL: call center • Box truck: the driver'],
        ],
      },
      {
        heading: 'Common loads',
        list: [
          'Distributor to retailer replenishment',
          'Manufacturer samples and launch inventory',
          'E-commerce pallets into a 3PL or Amazon-prep warehouse',
          'Final-mile delivery of pallets that arrived by LTL or air',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is a box truck more expensive than LTL?',
        a: 'Rates depend on the lane, shipment size and timing. Request a direct box truck quote and compare it with your LTL options.',
      },
      {
        q: 'What do I need to get a pallet quote?',
        a: 'Pickup and delivery addresses or ZIP codes, pallet count, total weight, and whether either end lacks a dock.',
      },
    ],
  },
];

export const AREAS = [
  {
    slug: 'new-york-city',
    name: 'New York City',
    title: 'Box Truck Freight Delivery in NYC: Brooklyn, Queens, Manhattan',
    description:
      'NYC box truck freight and liftgate delivery across Brooklyn, Queens, Manhattan, the Bronx and Staten Island. 26 ft dock-high truck, TWIC driver, 24/7 dispatch.',
    h1: 'Box truck freight delivery across New York City.',
    lede:
      'Five boroughs, tight streets, and plenty of buildings with no dock. A 26-ft box truck with a liftgate fits where a tractor-trailer cannot.',
    keywords: ['box truck service NYC', 'trucking company New York', 'freight delivery Brooklyn', 'freight delivery Queens', 'Manhattan freight delivery'],
    places: ['Brooklyn', 'Queens', 'Manhattan', 'The Bronx', 'Staten Island', 'JFK Airport', 'Red Hook'],
    sections: [
      {
        heading: 'Built for city deliveries',
        body: [
          'A 53-ft trailer is restricted on many city streets and cannot reach most storefronts. A 26-ft straight truck can, and the liftgate puts freight on the sidewalk where a dock does not exist.',
          'From JFK air cargo and the Red Hook terminal to retail drops in Manhattan, the truck knows the routes, the bridges and the delivery windows.',
        ],
      },
      {
        heading: 'Common city runs',
        list: [
          'JFK Air Cargo to Brooklyn and Manhattan businesses',
          'Queens and Brooklyn warehouses to New Jersey distribution centers via the Verrazzano and Goethals',
          'Bronx and Hunts Point area pickups heading to Long Island or New Jersey',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can a 26-ft box truck deliver in Manhattan?',
        a: 'Yes. Straight trucks are permitted on NYC truck routes and local streets for deliveries. Share any building delivery window or freight-elevator booking when you request a quote.',
      },
      {
        q: 'How do I get a price for an NYC delivery?',
        a: 'Send pickup and delivery addresses, pallet count and weight through the quote form or call (516) 508-8078. Ask dispatch how tolls and other charges are handled before you book.',
      },
    ],
  },
  {
    slug: 'long-island',
    name: 'Long Island',
    title: 'Trucking Company on Long Island: Nassau & Suffolk Freight',
    description:
      'Long Island box truck and liftgate freight delivery across Nassau and Suffolk County. Local 516 dispatch, 26 ft dock-high truck, runs to NYC, NJ and nationwide.',
    h1: 'Long Island’s box truck for freight that has to move today.',
    lede:
      'Dispatch picks up on a 516 number because this is home ground. Nassau and Suffolk pickups and deliveries, and runs off the island to the city, the ports and beyond.',
    keywords: ['trucking company Long Island', 'box truck Long Island', 'Nassau County trucking', 'Suffolk County freight delivery'],
    places: ['Nassau County', 'Suffolk County', 'Hicksville', 'Hauppauge', 'Farmingdale', 'Garden City', 'Melville', 'Ronkonkoma'],
    sections: [
      {
        heading: 'On-island and off-island',
        body: [
          'Long Island’s industrial parks in Hauppauge, Farmingdale, Hicksville and along Route 110 ship freight to the city and New Jersey. A direct box truck can move freight without an LTL terminal transfer.',
          'Inbound, the truck can recover air freight from JFK and imports from Port Newark for delivery to Long Island businesses.',
        ],
      },
      {
        heading: 'Typical Long Island loads',
        list: [
          'Industrial park to New Jersey distribution centers',
          'JFK air cargo delivered to Nassau and Suffolk',
          'Retail and restaurant deliveries with a liftgate',
          'Job-site deliveries of building materials and fixtures',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you cover the East End?',
        a: 'Yes. Suffolk County deliveries out to the forks are scheduled like any other run. Longer distance is reflected in the rate.',
      },
      {
        q: 'Can I get a same-day pickup on Long Island?',
        a: 'Same-day pickup depends on truck availability and the lane. Call (516) 508-8078 to check.',
      },
    ],
  },
  {
    slug: 'new-jersey',
    name: 'New Jersey',
    title: 'New Jersey Box Truck & Liftgate Delivery, Port Newark Freight',
    description:
      'New Jersey box truck freight: Port Newark, Port Elizabeth, Newark airport and the Turnpike warehouse corridor. TWIC-certified, liftgate, NJ to NY runs 24/7.',
    h1: 'New Jersey freight, from the port to the door.',
    lede:
      'North Jersey is where the region’s freight lands: the port, the airport and the warehouses along the Turnpike. Contact dispatch to arrange pickups and deliveries in the area.',
    keywords: ['New Jersey box truck', 'NJ liftgate delivery', 'Port Newark trucking', 'New York to New Jersey freight'],
    places: ['Newark', 'Elizabeth', 'Secaucus', 'Edison', 'Kearny', 'Jersey City', 'Carteret', 'Linden'],
    sections: [
      {
        heading: 'Port, airport, warehouse',
        body: [
          'Port Newark–Elizabeth is the heart of the Port of New York and New Jersey, the busiest port on the East Coast, and much of what comes off a container is palletized and moved by straight truck. Terminal and CFS pickups are subject to each facility’s entry requirements.',
          'Newark Liberty’s cargo area and the 3PL warehouses in Secaucus, Kearny, Edison and Carteret are also within the service area.',
        ],
      },
      {
        heading: 'New York ↔ New Jersey',
        body: [
          'The homepage sample route from JFK to Port Newark by the Verrazzano and Goethals bridges is one example of a possible New York–New Jersey lane.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you pick up from New Jersey warehouses for delivery in New York?',
        a: 'New Jersey-to-New York service is available. Share the pickup, delivery and handling requirements with dispatch for a quote.',
      },
      {
        q: 'Can you pick up at Port Newark?',
        a: 'Yes. The driver is TWIC-certified for marine terminals, CFS facilities and bonded warehouses around the port.',
      },
    ],
  },
  {
    slug: 'nationwide',
    name: 'Nationwide',
    title: 'Nationwide Box Truck Carrier, Interstate Expedited Freight',
    description:
      'Interstate box truck freight from the New York metro to anywhere in the lower 48. USDOT 3843409, MC 1398475. Dedicated expedited loads for shippers and brokers.',
    h1: 'From New York to anywhere in the lower 48.',
    lede:
      'Full interstate operating authority means the truck that picks up in New York can deliver in Boston, Atlanta or Chicago without handing your freight to anyone else.',
    keywords: ['nationwide box truck carrier', 'interstate trucking', 'Northeast expedited freight', 'box truck carrier for freight brokers'],
    places: ['Northeast corridor', 'Mid-Atlantic', 'New England', 'Southeast', 'Midwest', 'Lower 48'],
    sections: [
      {
        heading: 'Authority and credentials',
        specs: [
          ['USDOT', '3843409'],
          ['MC', '1398475'],
          ['Equipment', '26-ft dock-high straight box, 26,000-lb GVWR'],
          ['Driver', 'Owner-operator, TWIC-certified'],
        ],
      },
      {
        heading: 'Long runs, one truck',
        body: [
          'On a long expedited run, every transfer is a chance for delay or damage. A dedicated box truck keeps your freight on one floor from pickup to delivery, with the driver reachable the whole way.',
          'Freight brokers: request the carrier packet at Bigmacklogisticsa1@gmail.com.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do you take loads that start outside New York?',
        a: 'Yes, especially loads that line up with a return trip. Tell dispatch the lane and pickup date.',
      },
      {
        q: 'How do brokers set you up as a carrier?',
        a: 'Email Bigmacklogisticsa1@gmail.com for the carrier packet, or look up MC 1398475 in your onboarding platform.',
      },
    ],
  },
];

export const findService = (slug) => SERVICES.find((s) => s.slug === slug);
export const findArea = (slug) => AREAS.find((a) => a.slug === slug);

// ---------------------------------------------------------------------------------------------
// Structured data (JSON-LD)
// ---------------------------------------------------------------------------------------------

const ORG_ID = `${SITE_URL}/#business`;

export function businessJsonLd() {
  const business = {
    '@type': BUSINESS.address ? 'LocalBusiness' : 'Organization',
    '@id': ORG_ID,
    name: BUSINESS.name,
    alternateName: [BUSINESS.shortName, 'Big Mack Logistics'],
    url: SITE_URL,
    logo: `${SITE_URL}/image/logo-transparent.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    founder: { '@type': 'Person', name: BUSINESS.owner },
    description:
      'Expedited 26-ft dock-high box truck freight carrier with a 3,500-lb liftgate, onboard pallet jack and TWIC-certified driver, serving New York City, Long Island, New Jersey and the lower 48.',
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'USDOT', value: BUSINESS.usdot },
      { '@type': 'PropertyValue', propertyID: 'MC', value: BUSINESS.mc },
    ],
    areaServed: [
      { '@type': 'City', name: 'New York' },
      { '@type': 'AdministrativeArea', name: 'Long Island' },
      { '@type': 'State', name: 'New Jersey' },
      { '@type': 'Country', name: 'United States' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    knowsAbout: ['Expedited freight', 'Liftgate delivery', 'Air cargo recovery', 'TWIC port access', 'Pallet delivery'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Freight services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: `${SITE_URL}/services/${s.slug}` },
      })),
    },
  };
  if (BUSINESS.address) business.address = { '@type': 'PostalAddress', ...BUSINESS.address };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-US',
      },
    ],
  };
}

export function landingJsonLd(page, path, kind) {
  const url = `${SITE_URL}${path}`;
  const main =
    kind === 'service'
      ? {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: page.name,
          serviceType: page.name,
          description: page.description,
          url,
          provider: { '@id': ORG_ID },
          areaServed: { '@type': 'Country', name: 'United States' },
        }
      : {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: `Box truck freight in ${page.name}`,
          serviceType: 'Box truck freight delivery',
          description: page.description,
          url,
          provider: { '@id': ORG_ID },
          areaServed: page.places.map((name) => ({ '@type': 'Place', name })),
        };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      main,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: page.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

// JSON-LD goes into a <script>; escape "<" so copy can never close the tag early.
export const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
