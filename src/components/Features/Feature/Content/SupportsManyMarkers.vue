<template>
  <div>
    <h5 class="text-h5">
      <p>
        No matter how many rows are in your location data,
        <b>Table & Map</b> will be able to handle it. We designed our tool to be
        highly performant at large scales.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        How is it so fast?
      </h6>
      <p />
      <h6 class="text-h6">
        Map
      </h6>
      <ul>
        <li>
          <p>
            Clustering. After exceeding 1,000 markers, we combine nearby markers
            into location based clusters so the map can remain fast no matter
            the input size. This option is preselected and can be turned off in
            the left menu, however we recommend leaving it on for performance
            reasons.
          </p>
        </li>
        <li>
          <p>
            Smart Rendering. As you pan over the map, we hide the markers and
            clusters as they become out of view. In doing so, the panning
            becomes smoother allowing for many more markers to exist on the map
            at one time.
          </p>
        </li>
      </ul>
      <h6 class="text-h6">
        Table
      </h6>
      <ul>
        <li>
          <p>
            Smart Rendering. We render the rows and columns as they become
            visible instead of keeping them while they may be out of view. This
            allows for many rows and columns to exist without slowing down the
            tool.
          </p>
        </li>
      </ul>
      <h6 class="text-h6">
        Table & Map
      </h6>
      <ul>
        <li>
          <p>
            Cooperation. From the beginning, the table and map components have
            been designed to work together. As a result, we have been able to
            optimize the communication between the two components for maximum
            performance.
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>