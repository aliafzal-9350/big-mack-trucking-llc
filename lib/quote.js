export function quoteEmail(data) {
  const body = [
    `Pickup: ${data.get('origin') || ''}`,
    `Delivery: ${data.get('destination') || ''}`,
    `Pallet count: ${data.get('pallets') || ''}`,
    `Total weight: ${data.get('weight') || ''}`,
    `Liftgate: ${data.has('liftgate') ? 'Yes' : 'No'}`,
    `Pallet jack: ${data.has('palletJack') ? 'Yes' : 'No'}`,
    `Port access: ${data.has('twic') ? 'Yes' : 'No'}`,
    `Company and contact: ${data.get('broker_contact') || ''}`,
    '',
    'Please confirm availability, equipment, access requirements and rate.',
  ].join('\n');
  return `mailto:Bigmacklogisticsa1@gmail.com?subject=${encodeURIComponent('Freight quote request')}&body=${encodeURIComponent(body)}`;
}
