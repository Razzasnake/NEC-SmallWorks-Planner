export default () => {
  const names = [
    'Lyndsey Lyons',
    'Eisa Watson',
    'Chantel Case',
    'Neil Bond',
    'Shanice Castillo',
    'Ellis Smart',
    'Roan Barnes',
    'Chenai Ellison',
    'Brennan Bateman',
    'Jac Davey'
  ]
  return names[Math.round(Math.random() * (names.length - 1))]
}