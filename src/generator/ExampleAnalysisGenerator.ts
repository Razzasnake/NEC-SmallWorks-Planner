import ExampleAnalysis from "@/entities/ExampleAnalysis"

const exampleAnalysisGenerator = (index: number = 0) => {
  return new ExampleAnalysis({
    id: index,
    title: 'Hospitals',
    description: 'This database contains locations of Hospitals for 50 states and Washington D.C. , Puerto Rico and US territories. The dataset only includes hospital facilities and does not include nursing homes. Data for all the states was acquired from respective states departments or their open source websites and then geocoded and converted into a spatial database.',
    preview: require('@/assets/app.jpg'),
    url: "https://hifld-geoplatform.opendata.arcgis.com/datasets/hospitals",
    createdOn: new Date(),
    config: {
      data: () => new Promise((resolve) => {
        resolve({
          default: [
            ['X', 'Y', 'OBJECTID', 'ID', 'NAME', 'ADDRESS', 'CITY', 'STATE', 'ZIP', 'ZIP4', 'TELEPHONE', 'TYPE', 'STATUS', 'POPULATION', 'COUNTY', 'COUNTYFIPS', 'COUNTRY', 'LATITUDE', 'LONGITUDE', 'NAICS_CODE', 'NAICS_DESC', 'SOURCE', 'SOURCEDATE', 'VAL_METHOD', 'VAL_DATE', 'WEBSITE', 'STATE_ID', 'ALT_NAME', 'ST_FIPS', 'OWNER', 'TTL_STAFF', 'BEDS', 'TRAUMA', 'HELIPAD'],
            ['-114.617493963999948', '34.833065921000077', '1001', '0007892363', 'COLORADO RIVER MEDICAL CENTER', '1401 BAILEY AVENUE', 'NEEDLES', 'CA', '92363', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '25', 'SAN BERNARDINO', '06071', 'USA', '34.8330659210001', '-114.617493964', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.cityofneedles.com/Hospitals.asp', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'GOVERNMENT - LOCAL', '-999', '25', 'NOT AVAILABLE', 'Y'],
            ['-117.057064595999975', '32.776586387000059', '1002', '0001392120', 'ALVARADO HOSPITAL MEDICAL CENTER', '6655 ALVARADO ROAD', 'SAN DIEGO', 'CA', '92120', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '226', 'SAN DIEGO', '06073', 'USA', '32.7765863870001', '-117.057064596', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.alvaradohospital.com', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'PROPRIETARY', '-999', '226', 'NOT AVAILABLE', 'N'],
            ['-117.044161792999944', '32.774631666000047', '1003', '0001591942', 'ALVARADO PARKWAY INSTITUTE B.H.S.', '7050 PARKWAY DRIVE', 'LA MESA', 'CA', '91942', 'NOT AVAILABLE', 'NOT AVAILABLE', 'PSYCHIATRIC', 'OPEN', '66', 'SAN DIEGO', '06073', 'USA', '32.7746316660001', '-117.044161793', '622210', 'PSYCHIATRIC AND SUBSTANCE ABUSE HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.apibhs.com', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'PROPRIETARY', '-999', '66', 'NOT AVAILABLE', 'N'],
            ['-117.14464540299997', '32.756383661000029', '1004', '0023292104', 'KINDRED HOSPITAL - SAN DIEGO', '1940 EL CAJON BOULEVARD', 'SAN DIEGO', 'CA', '92104', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '70', 'SAN DIEGO', '06073', 'USA', '32.756383661', '-117.144645403', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.kindredsandiego.com', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'PROPRIETARY', '-999', '70', 'NOT AVAILABLE', 'N'],
            ['-117.082336704999989', '32.68534055300006', '1005', '0034392050', 'PARADISE VALLEY HOSPITAL', '2400 EAST FOURTH STREET', 'NATIONAL CITY', 'CA', '92050', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '227', 'SAN DIEGO', '06073', 'USA', '32.6853405530001', '-117.082336705', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.paradisevalleyhospital.org', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'PROPRIETARY', '-999', '227', 'NOT AVAILABLE', 'N'],
            ['-122.42587335199994', '37.774364078000069', '1006', '0025094116', 'LAGUNA HONDA HOSPITAL AND REHABILITATION CENTER', '375 LAGUNA HONDA BOULEVARD', 'SAN FRANCISCO', 'CA', '94116', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '780', 'SAN FRANCISCO', '06075', 'USA', '37.7743640780001', '-122.425873352', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://lagunahonda.org/', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'GOVERNMENT - LOCAL', '-999', '780', 'NOT AVAILABLE', 'N'],
            ['-122.456850620999944', '37.763472349000033', '1007', '0025294143', 'LANGLEY PORTER PSYCHIATRIC INSTITUTE', '401 PARNASSUS AVENUE', 'SAN FRANCISCO', 'CA', '94143', 'NOT AVAILABLE', 'NOT AVAILABLE', 'PSYCHIATRIC', 'OPEN', '67', 'SAN FRANCISCO', '06075', 'USA', '37.763472349', '-122.456850621', '622210', 'PSYCHIATRIC AND SUBSTANCE ABUSE HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://psych.ucsf.edu/lpphc.aspx', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'PROPRIETARY', '-999', '67', 'NOT AVAILABLE', 'N'],
            ['-122.45787717799999', '37.763076851000051', '1008', '0050694122', 'UCSF MEDICAL CENTER', '505 PARNASSUS AVENUE', 'SAN FRANCISCO', 'CA', '94122', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '580', 'SAN FRANCISCO', '06075', 'USA', '37.7630768510001', '-122.457877178', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'https://www.ucsfhealth.org/', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'GOVERNMENT - LOCAL', '-999', '580', 'NOT AVAILABLE', 'N'],
            ['-122.439147210999977', '37.784919710000061', '1009', '0050794115', 'UCSF MEDICAL CENTER AT MOUNT ZION', '1600 DIVISADERO STREET', 'SAN FRANCISCO', 'CA', '94115', 'NOT AVAILABLE', 'NOT AVAILABLE', 'GENERAL ACUTE CARE', 'OPEN', '140', 'SAN FRANCISCO', '06075', 'USA', '37.7849197100001', '-122.439147211', '622110', 'GENERAL MEDICAL AND SURGICAL HOSPITALS', 'http://www.oshpd.ca.gov/HID/Facility-Listing.html', '2018-08-08T00:00:00.000Z', 'IMAGERY/OTHER', '2014-02-10T00:00:00.000Z', 'http://www.ucsfhealth.org', 'NOT AVAILABLE', 'NOT AVAILABLE', '06', 'GOVERNMENT - LOCAL', '-999', '140', 'NOT AVAILABLE', 'N']
          ]
        })
      }),
      columnSelections: {
        lat: 15,
        lng: 16
      },
      firstRowHeader: true
    }
  })
}

const exampleAnalysesGenerator = (num: number = 10) => {
  const data: ExampleAnalysis[] = []
  for (let i = 0; i < num; i++) {
    data.push(exampleAnalysisGenerator(i))
  }
  return data
}

export { exampleAnalysisGenerator, exampleAnalysesGenerator }