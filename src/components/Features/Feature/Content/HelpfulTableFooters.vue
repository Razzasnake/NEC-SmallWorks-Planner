<template>
  <div>
    <h5 class="text-h5">
      <p>
        As filters are applied and shapes are drawn, it is helpful to see
        aggregated data to better understand the subset being analyzed.
        <b>Table & Map</b> currently offers optional min, max, average and
        total rows to each numeric field.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h2>Aggregate Rows</h2>
      <p />
      <p>
        With help from <b>Table & Map</b>’s automation, we are able to offer
        helpful aggregate footer rows in the table. For all columns detected to
        be a numeric type, we compute the minimum, maximum, average and total of
        all the visible values in each column. These values will update as you
        filter the table as well as draw polygons on the map.
      </p>
      <p>
        By default, the footer rows are disabled. To enable them, open the Table
        options in the left menu and select which aggregate rows you want to
        show or hide.
      </p>
    </div>
  </div>
</template>