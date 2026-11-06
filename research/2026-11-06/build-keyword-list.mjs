import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const own = JSON.parse(fs.readFileSync(path.join(dir, 'own-site-text.json'), 'utf8'));
// Curated research candidates, not search-volume observations. Never render this bank as page copy.
const sites = [
  { domain: 'umajalogistics.online', origin: 'https://umajalogistics.online', groups: [
    ['JFK cargo recovery', '/resources/jfk-air-cargo-trucking', 'Informational', 'High', 'https://truckfirstclass.com/jfk-air-cargo-trucking-company/', [
      'JFK air cargo trucking', 'JFK cargo pickup checklist', 'JFK air cargo recovery', 'JFK freight pickup documents', 'JFK cargo release before pickup', 'air waybill details for truck pickup', 'JFK cargo handler pickup instructions', 'JFK airport freight delivery', 'JFK import cargo collection', 'JFK export cargo drop off',
    ]],
    ['Airport dispatch planning', '/resources/jfk-air-cargo-trucking', 'Informational', 'High', 'https://www.aacargo.com/AACargo/ua/facilities/JFK', [
      'air cargo pickup dispatch packet', 'cargo terminal pickup appointment', 'airport cargo pickup authorization', 'flight arrival versus cargo availability', 'air cargo recovery waiting time', 'JFK cargo building pickup location', 'JFK cargo pickup receiving window', 'airport cargo delivery without a dock', 'air freight pallet dimensions for trucking', 'airport freight pickup contact checklist',
    ]],
    ['Capacity planning', '/resources/26ft-box-truck-capacity', 'Informational', 'Medium', 'https://www.expeditedfreight.com/box-trucks', [
      '26ft box truck capacity', 'how many pallets fit in a 26ft box truck', '26ft box truck payload', 'box truck pallet calculator', 'box truck door clearance', '48 x 40 pallet box truck layout', 'pallet footprint for box truck', 'box truck floor space versus payload', '26ft truck interior dimensions', 'loaded pallet gross weight',
    ]],
    ['Liftgate preparation', '/resources/liftgate-delivery-guide', 'Informational', 'Medium', 'https://www.junglogistics.com/Services/BoxTruck', [
      'liftgate delivery preparation', 'delivery without a loading dock', 'liftgate platform size', 'pallet jack delivery surface', 'liftgate capacity and pallet weight', 'dock to ground freight delivery', 'liftgate receiving checklist', 'pallet delivery doorway clearance', 'curbside liftgate delivery', 'pallet delivery site access',
    ]],
    ['Carrier and documents', '/resources/verify-motor-carrier', 'Informational', 'Medium', 'https://umajalogistics.online/resources/verify-motor-carrier', [
      'verify a motor carrier', 'carrier packet checklist', 'freight carrier insurance documents', 'motor carrier identity verification', 'check carrier operating authority', 'MC number carrier verification', 'freight rate confirmation details', 'bill of lading versus proof of delivery', 'palletized freight shipping documents', 'direct carrier quote checklist',
    ]],
    ['Shipment inquiry', '/services', 'Commercial', 'Medium', 'https://umajalogistics.online/services', [
      '26ft dock high freight carrier', 'JFK air cargo box truck service', 'dedicated expedited freight carrier', 'box truck freight with liftgate', 'dock to dock box truck freight', 'expedited pallet freight quote', 'airport cargo ground transport quote', 'dedicated truck with pallet jack', 'nationwide expedited box truck freight', 'Umaja Logistics dispatch',
    ]],
  ] },
  { domain: 'cargokingsinc.com', origin: 'https://www.cargokingsinc.com', groups: [
    ['Electric pallet jack delivery', '/resources/electric-pallet-jack-freight-delivery', 'Informational', 'High', 'https://www.osha.gov/powered-industrial-trucks', [
      'electric pallet jack delivery', 'electric pallet jack freight delivery', 'powered pallet jack delivery checklist', 'pallet jack fork entry clearance', 'electric pallet jack receiving requirements', 'pallet jack and liftgate limits', 'loaded pallet dimensions for delivery', 'pallet jack delivery turning space', 'pallet jack unloading surface', 'electric pallet jack versus forklift delivery',
    ]],
    ['Receiving path', '/resources/electric-pallet-jack-freight-delivery', 'Informational', 'High', 'https://www.junglogistics.com/Services/BoxTruck', [
      'freight receiving path checklist', 'pallet delivery threshold clearance', 'liftgate delivery to a storefront', 'receiving pallet freight without a dock', 'pallet delivery inside placement', 'curbside versus inside freight delivery', 'pallet delivery receiving contact', 'pallet freight unloading responsibility', 'pallet delivery route through doorway', 'pallet freight site photos for quote',
    ]],
    ['Equipment acceptance', '/resources/electric-pallet-jack-freight-delivery', 'Informational', 'High', 'https://www.osha.gov/powered-industrial-trucks', [
      'electric pallet jack operator for delivery', 'damaged pallet before freight pickup', 'custom skid fork access', 'pallet jack load stability', 'liftgate combined platform load', 'forklift availability at delivery', 'truck payload versus pallet jack rating', 'non stackable pallet delivery', 'pallet jack unloading restrictions', 'freight unloading equipment confirmation',
    ]],
    ['Quote preparation', '/resources/expedited-freight-quote-checklist', 'Informational', 'Medium', 'https://www.expeditedfreight.com/box-trucks', [
      'expedited freight quote checklist', 'box truck quote details', 'freight ready time versus pickup window', 'pallet dimensions for freight quote', 'gross weight per pallet for quote', 'freight delivery appointment details', 'liftgate charges in freight quote', 'waiting time allowance freight quote', 'exclusive use truck quote', 'freight quote pickup and delivery contacts',
    ]],
    ['Receiving records', '/resources/electric-pallet-jack-freight-delivery', 'Informational', 'Medium', 'https://www.cargokingsinc.com/resources/electric-pallet-jack-freight-delivery', [
      'pallet freight receiving day checklist', 'record visible freight damage at delivery', 'pallet count on proof of delivery', 'freight delivery handoff sheet', 'receiver unavailable freight delivery', 'freight delivery changed unloading conditions', 'confirm freight handling scope', 'pallet delivery packaging inspection', 'delivery paperwork piece count', 'freight delivery exception notes',
    ]],
    ['Shipment inquiry', '/', 'Commercial', 'Medium', 'https://www.cargokingsinc.com/', [
      'box truck with electric pallet jack', 'dock high truck with liftgate', 'expedited box truck freight quote', 'pallet delivery carrier with driver', 'dedicated box truck service', 'ground level pallet delivery quote', 'commercial freight with powered pallet jack', 'straight truck freight inquiry', 'Cargo Kings Inc dispatch', 'Cargo Kings freight quote',
    ]],
  ] },
  { domain: 'bigmacktrucking.com', origin: 'https://www.bigmacktrucking.com', groups: [
    ['Multi-stop planning', '/resources/multi-stop-box-truck-delivery-planning', 'Informational', 'High', 'https://armorfreight.com/box-truck-shipping/', [
      'multi stop box truck delivery', 'multi stop freight delivery planning', 'box truck delivery stop sheet', 'multi stop box truck loading order', 'pallet delivery route planning', 'store replenishment box truck delivery', 'multiple delivery stops one truck', 'multi stop freight quote checklist', 'box truck stop sequence', 'multi stop freight receiving windows',
    ]],
    ['Load access and handoff', '/resources/multi-stop-box-truck-delivery-planning', 'Informational', 'High', 'https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules', [
      'pallet loading order multiple deliveries', 'access to freight at each stop', 'remaining freight securement after delivery', 'multi stop pallet piece references', 'proof of delivery for each stop', 'box truck route delivery records', 'undelivered pallet after route', 'multi stop delivery appointment changes', 'extra stop freight charges', 'multi stop truck waiting time',
    ]],
    ['Site preparation', '/resources/liftgate-delivery-site-checklist', 'Informational', 'Medium', 'https://www.junglogistics.com/Services/BoxTruck', [
      'liftgate delivery site checklist', 'liftgate delivery parking space', 'pallet jack route from liftgate', 'ground level pallet handoff', 'liftgate delivery receiver contact', 'pallet delivery on gravel', 'pallet delivery steps and thresholds', 'liftgate platform freight dimensions', 'pallet delivery truck access', 'storefront freight receiving preparation',
    ]],
    ['Dedicated versus LTL', '/resources/dedicated-box-truck-vs-ltl', 'Commercial investigation', 'Medium', 'https://www.expeditedfreight.com/box-trucks', [
      'dedicated box truck versus LTL', 'LTL versus direct pallet delivery', 'dedicated freight handling points', 'box truck exclusive use shipment', 'compare dedicated freight quotes', 'LTL delivery window versus dedicated', 'direct truck freight with no terminal transfer', 'box truck shipment accessorial charges', 'dedicated box truck appointment delivery', 'partial truckload box truck alternative',
    ]],
    ['Equipment inquiry', '/services/26ft-dock-high-box-truck', 'Commercial', 'Medium', 'https://www.bigmacktrucking.com/services/26ft-dock-high-box-truck', [
      '26 ft dock high box truck with driver', '12 pallet box truck freight', 'box truck carrier for freight brokers', 'straight truck with liftgate and pallet jack', 'dedicated box truck with driver', '26ft box truck shipment quote', 'box truck freight usable payload', 'box truck loaded pallet clearance', 'Big Mack Trucking dispatch', 'Big Mack Trucking freight quote',
    ]],
    ['Service-area inquiry', '/service-areas/new-york-city', 'Commercial', 'Medium', 'https://www.xentratransport.com/locations/new-jersey-courier-nj/services/vans-box-trucks-liftgate-nj', [
      'New York City box truck freight', 'Long Island pallet delivery carrier', 'New Jersey liftgate freight delivery', 'New York to New Jersey box truck freight', 'NYC dock high freight carrier', 'Long Island dedicated box truck', 'New Jersey box truck with driver', 'New York metro multi stop pallet delivery', 'Northeast dedicated box truck freight', 'nationwide expedited box truck carrier',
    ]],
  ] },
];

const quote = v => `"${String(v ?? '').replaceAll('"', '""')}"`;
const rows = [];
for (const site of sites) {
  const siteText = (own[`${site.origin}/`] || '').toLowerCase();
  const seen = new Set();
  for (const [cluster, url, intent, priority, seedSource, terms] of site.groups) {
    for (const keyword of terms) {
      if (seen.has(keyword)) throw new Error(`Duplicate candidate: ${keyword}`);
      seen.add(keyword);
      rows.push({ domain: site.domain, keyword, cluster, intent, editorial_priority: priority,
        target_url: `${site.origin}${url}`, evidence_type: siteText.includes(keyword.toLowerCase()) ? 'phrase observed on owned homepage' : 'derived research candidate; demand unvalidated',
        source_url: siteText.includes(keyword.toLowerCase()) ? `${site.origin}/` : seedSource,
        checked: '2026-11-06', country: 'US', monthly_volume: '', keyword_difficulty: '', current_google_position: '',
        metrics_status: 'not measured; validate with Ahrefs or Search Console',
      });
    }
  }
  if (seen.size !== 60) throw new Error(`${site.domain}: expected 60 curated candidates, got ${seen.size}`);
}
const columns = Object.keys(rows[0]);
const csv = data => columns.map(quote).join(',') + '\n' + data.map(r => columns.map(c => quote(r[c])).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(dir, 'keyword-research.csv'), '\uFEFF' + csv(rows));
for (const site of sites) fs.writeFileSync(path.join(dir, `${site.domain}-keywords.csv`), '\uFEFF' + csv(rows.filter(r => r.domain === site.domain)));
console.log(JSON.stringify({ total: rows.length, perSite: 60, observedOwnedPhrases: rows.filter(r => r.evidence_type.startsWith('phrase')).length, measuredKeywordMetrics: 0 }));
