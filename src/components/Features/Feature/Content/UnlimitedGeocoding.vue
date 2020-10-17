<template>
  <div>
    <h5 class="text-h5">
      <p>
        Make use of our geocoding service and see your location data on a map in
        no time. Select the available address components and we will geocode
        your dataset automatically.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        Select Address Components
      </h6>
      <p />
      <p>
        Upload your dataset as you normally would and if it doesn’t have
        latitude and longitude columns, we will prompt you to select the address
        components (address, city, state and zip code). We only require one of
        these fields to proceed, but the accuracy of the geocoding will improve
        the more address components are selected.
      </p>
      <h6 class="text-h6">
        Geocode
      </h6>
      <p />
      <p>
        After selecting the address components, we will begin to compute the
        latitudes and longitudes for each row in the uploaded dataset. The
        progress of the geocoding will be displayed as an overlay. This process
        is generally pretty fast, but if your dataset contains thousands of
        rows, expect this to take a couple of minutes.
      </p>
      <h6 class="text-h6">
        Explore
      </h6>
      <p />
      <p>
        Once the geocoding completes, you will be dropped into the tool with two
        new columns added to the end of the uploaded dataset, latitude and
        longitude.
      </p>
      <h6 class="text-h6">
        Export
      </h6>
      <p />
      <p>
        In the event that you want to revisit this data in the future, we
        recommend you sign in with Google or export the data with the latitude
        and longitude columns so you can skip the geocoding process next time.
        To export, click the Export option in the left menu and the contents of
        the table will be downloaded as a CSV.
      </p>
    </div>
  </div>
</template>