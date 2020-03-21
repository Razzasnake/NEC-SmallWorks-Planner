export default () => {
  const address = [
    { address: '474 Military St', city: 'Carpentersville', state: 'IL', zipcode: '60110'},
    { address: '9553 Berkshire Street', city: 'Fernandina Beach', state: 'FL', zipcode: '32034'},
    { address: '5 2nd Dr', city: 'Plainview', state: 'NY', zipcode: '11803'},
    { address: '997 Evergreen Lane', city: 'Mableton', state: 'GA', zipcode: '30126'},
    { address: '9167 North Lookout St', city: 'Millington', state: 'TN', zipcode: '38053'},
    { address: '55 South Hamilton Lane', city: 'Glenview', state: 'IL', zipcode: '60025'},
    { address: '137 Old Plymouth Street', city: 'Los Banos', state: 'CA', zipcode: '93635'},
    { address: '60 West St', city: 'Matthews', state: 'NC', zipcode: '28104'},
    { address: '68 Marshall Court', city: 'Phoenix', state: 'AZ', zipcode: '85021'},
    { address: '74 Lakewood Ave', city: 'Superior', state: 'WI', zipcode: '54880'}
  ]
  return address[Math.round(Math.random() * (address.length - 1))]
}