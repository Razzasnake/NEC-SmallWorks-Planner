import Geocode from '@/entities/Geocode'

const geocodeGenerator = () => {
  const response = '{"input":{"address_components":{"number":"111","predirectional":"W","street":"Wacker","suffix":"Dr","formatted_street":"W Wacker Dr","city":"Chicago","state":"IL","zip":"60601","country":"US"},"formatted_address":"111 W Wacker Dr, Chicago, IL 60601"},"results":[{"address_components":{"number":"111","predirectional":"W","street":"Wacker","suffix":"Dr","formatted_street":"W Wacker Dr","city":"Chicago","county":"Cook County","state":"IL","zip":"60601","country":"US"},"formatted_address":"111 W Wacker Dr, Chicago, IL 60601","location":{"lat":41.886542,"lng":-87.631567},"accuracy":1,"accuracy_type":"rooftop","source":"Cook"},{"address_components":{"number":"111","predirectional":"E","street":"Wacker","suffix":"Dr","formatted_street":"E Wacker Dr","city":"Chicago","county":"Cook County","state":"IL","zip":"60601","country":"US"},"formatted_address":"111 E Wacker Dr, Chicago, IL 60601","location":{"lat":41.887684,"lng":-87.623559},"accuracy":0.8,"accuracy_type":"rooftop","source":"Cook"}]}'
  return new Geocode(JSON.parse(response))
}

export { geocodeGenerator }