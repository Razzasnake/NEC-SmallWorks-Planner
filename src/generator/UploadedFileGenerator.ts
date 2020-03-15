import latLngGenerator from './LatLngGenerator'
import UploadedFile from '@/entities/UploadedFile'

const uploadedFileGenerator = (numRows: number = 1000) => {
  const data: (string | number)[][] = [['Lat', 'Lon', 'Letter', 'Letter', 'Letter', 'Letter', 'Letter']]
  for (let i = 0; i < numRows; i++) {
    const latLng = latLngGenerator({ lat: 39.8283, lng: -98.5795 }, 1000000)
    data.push([
      latLng.lat,
      latLng.lng,
      'A',
      'B',
      'C',
      'D',
      'E'
    ])
  }
  return new UploadedFile({
    data,
    columnSelections: {
      lat: 0,
      lng: 1
    },
    firstRowHeader: true
  })
}

export { uploadedFileGenerator }