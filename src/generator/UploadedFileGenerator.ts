import propertyNameGenerator from './PropertyNameGenerator'
import latLngGenerator from './LatLngGenerator'
import addressGenerator from './AddressGenerator'
import nameGenerator from './NameGenerator'

import UploadedFile from '@/entities/UploadedFile'

const uploadedFileGenerator = (numRows: number = 1000) => {
  const data: (string | number)[][] = [['Property Name', 'Address', 'City', 'State', 'Zip Code', 'Latitude', 'Longitude', 'Tenant Name', 'Rent', 'Sqft', 'Bed', 'Bath']]
  for (let i = 0; i < numRows; i++) {
    const propertyName = propertyNameGenerator()
    const latLng = latLngGenerator({ lat: 39.8283, lng: -98.5795 }, 1000000)
    const address = addressGenerator()
    const name = nameGenerator()
    data.push([
      propertyName,
      address.address,
      address.city,
      address.state,
      address.zipcode,
      latLng.lat,
      latLng.lng,
      name,
      500 + Math.round(Math.random() * 2000),
      500 + Math.round(Math.random() * 2000),
      Math.round(Math.random() * 5),
      Math.round(Math.random() * 5)
    ])
  }
  return new UploadedFile({
    toUpload: false,
    toSaveChanges: false,
    fileName: "Test",
    data,
    columnSelections: {
      lat: 5,
      lng: 6
    },
    firstRowHeader: true
  })
}

export { uploadedFileGenerator }