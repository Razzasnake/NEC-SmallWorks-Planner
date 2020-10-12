<template>
  <div>
    <h5 class="text-h5">
      <p>
        Upload GeoJSON and Shapefiles and view them as layers on the map.
        <b>Table & Map</b> will begin computing which markers fall within which
        polygons so when a marker is clicked, the data of the surrounding
        polygons will be displayed alongside the markers.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        I have a GeoJSON or Shapefile
      </h6>
      <p />
      <p>
        In order to upload a GeoJSON or Shapefile, you must first be in the tool
        already viewing a location dataset. At this point, click the Layer
        Manager option in the left menu. A popup will appear with a drop zone
        where you can drag and drop your GeoJSON or Shapefile (in a .zip) files.
        You may also click this region and a file picker will appear. We will
        begin processing the file in the background and once complete, it will
        appear as a layer on the map.
      </p>
      <p>
        After the shapes appear on the map, <b>Table & Map</b> will begin to
        compute which markers fall within which polygons so when a marker is
        clicked, the data associated with the surrounding polygons will be
        available alongside the markers in the preview window.
      </p>
      <h6 class="text-h6">
        I am looking for a GeoJSON or Shapefile
      </h6>
      <p>Some sources that we recommend for GeoJSON or Shapefiles include:</p>
      <ol>
        <li>
          <p>
            <a
              href="https://catalog.data.gov/dataset?res_format=GeoJSON"
              target="_blank"
            >Data.gov</a>
          </p>
        </li>
        <li>
          <p>
            <a
              href="https://www.census.gov/geographies/mapping-files.html"
              target="_blank"
            >Census.gov</a>
          </p>
        </li>
        <li>
          <p>
            <a
              href="https://hub.arcgis.com/search"
              target="_blank"
            >Arcgis.com</a>
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>