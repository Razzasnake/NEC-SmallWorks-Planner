<template>
  <div>
    <h5 class="text-h5">
      <p>
        Our mission when building <b>Table & Map</b> was to make the process of
        taking an excel or csv file and visualizing it on a map as simple as
        possible. To do this, we automate as much of the workflow as possible.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        Column Detection
      </h6>
      <p />
      <p>
        After processing the uploaded location data, we run a number of scripts
        to determine which columns contain the latitudes, longitudes and address
        components (address, city, state and zip code). If we find a latitude
        and longitude column, we will drop you into the tool automatically. If
        we can't find a latitude and longitude column, then we will prompt you
        for help before
        <router-link
          v-if="$router"
          to="/features/unlimited-geocoding"
        >
          <span>geocoding</span>
        </router-link>
        <a
          v-else
          href="/features/unlimited-geocoding"
        >
          <span>geocoding</span>
        </a>
        each of the records.
      </p>
      <p>
        Our goal is to make the barrier of entry to our tool as small as
        possible. We try to automate everything we can so you can spend more
        time analyzing.
      </p>
      <p />
      <h6 class="text-h6">
        Smart Filters
      </h6>
      <p />
      <p>
        <b>Table & Map</b> analyzes your data and computes the correct data type
        of each column. We use this information to offer unique filters made
        available through the header of each column. Learn more about Table &
        Map’s
        <router-link
          v-if="$router"
          to="/features/filterable"
        >
          <span>filtering capabilities</span>
        </router-link>
        <a
          v-else
          href="/features/filterable"
        >
          <span>filtering capabilities</span>
        </a>.
      </p>
    </div>
  </div>
</template>