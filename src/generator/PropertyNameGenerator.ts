export default () => {
  const propertyNames = [
    'Elevate',
    'Common Addams',
    '200 Squared',
    'Alta at K Station',
    'Park View Apartments',
    'Residences at Addison Clark',
    'Aurelien',
    'JeffJack Apartments',
    '65 East Scott',
    'Lofts At River East'
  ]
  return propertyNames[Math.round(Math.random() * (propertyNames.length - 1))]
}