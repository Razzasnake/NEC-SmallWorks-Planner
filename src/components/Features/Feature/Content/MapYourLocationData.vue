<template>
  <div>
    <h5 class="text-h5">
      <p>
        Whether your file has latitudes and longitudes or only contains
        addresses, <b>Table & Map</b> makes it easy to map your location data.
        Follow the guide below and easily get started.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        I have an excel or csv file:
      </h6>
      <p />
      <ol>
        <li>
          <p>
            Go to
            <router-link
              v-if="$router"
              to="/"
            >
              <span>tableandmap.com</span>
            </router-link>
            <a
              v-else
              href="/"
            >
              <span>tableandmap.com</span>
            </a>
            and click <b>Upload a dataset</b>.
          </p>
        </li>
        <li>
          <p>
            Select an excel or csv file with location data from your computer.
          </p>
        </li>
        <li>
          <p>
            <b>Table & Map</b> will process your file. The larger the file, the
            longer this step takes to complete.
          </p>
        </li>
        <li>
          <p>If you <u>do</u> have a latitude and longitude in the file:</p>
          <p>
            a. The system will attempt to automatically detect the columns and
            if successful, you will enter the tool automatically.
          </p>
          <p>
            b. If the system needs some help, it will prompt you to select the
            correct latitude and longitude columns. After selecting the columns,
            press <b>Confirm</b> and you will enter the tool.
          </p>
        </li>
        <li>
          <p>If you <u>do not</u> have a latitude and longitude in the file:</p>
          <p>
            a. The system will ask you to select the address components
            (address, city, state or zip code). You must select at least one
            address component to continue, but the more you select, the more
            accurate the geocoding will be.
          </p>
          <p>
            b. Press <b>Confirm</b> and the system will compute the latitude and
            longitude for each record and add them as new columns to your
            dataset.
          </p>
          <p>
            c. You will enter the tool automatically when the geocoding process
            is complete. The duration of this step depends on the number of
            records in the dataset.
          </p>
        </li>
      </ol>
      <h6 class="text-h6">
        I want to copy and paste in data:
      </h6>
      <p />
      <ol>
        <li>
          <p>
            Go to
            <router-link
              v-if="$router"
              to="/"
            >
              <span>tableandmap.com</span>
            </router-link>
            <a
              v-else
              href="/"
            >
              <span>tableandmap.com</span>
            </a>
            and click <b>Paste</b>.
          </p>
        </li>
        <li><p>Copy the dataset and paste it into the text box.</p></li>
        <li>
          <p>
            Press <b>Confirm</b> and continue with Step 3 of the
            <i>I have an excel or csv file</i> instructions above.
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>