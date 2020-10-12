<template>
  <div>
    <h5 class="text-h5">
      <p>
        For location data with high density markers, viewing the data with a
        heat map layer is a high performant way to view hot spots.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        View Heat Map Layer
      </h6>
      <p>
        To activate the heat map layer, click the Show Heat Map option in the
        left menu bar. This will hide the clusters and markers and only display
        the heat map layer.
      </p>
      <p>
        To deactivate the heat map layer, click the Hide Heat Map option and we
        will remove the heat map layer and add back the clusters and markers to
        the map.
      </p>
      <p />
      <h6 class="text-h6">
        I don’t see a heat map or the colors are faint
      </h6>
      <p>
        Sometimes the colors of our heat map will be faint or not visible. To
        fix that, let’s decrease the number of visible markers.
      </p>
      <ol>
        <li><p>Apply filters to the table to reach the focus area</p></li>
        <li><p>Draw polygons around the focus area</p></li>
      </ol>
      <p>
        The generated heat map is relative to all visible markers. Filtering the
        table or drawing polygons will help the colors scale properly. Sometimes
        areas of high density markers will affect the color scale and make the
        heat map difficult to see.
      </p>
    </div>
  </div>
</template>