<template>
  <div>
    <h5 class="text-h5">
      <p>
        Visualize the locations of each category by selecting a categorical
        column to group by. When viewing as clusters, a pie chart will take the
        place of the normal cluster and display the distribution of the
        contained markers.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        Selecting a group by column
      </h6>
      <p />
      <p>
        To select a group by column, click the Map dropdown in the left menu of
        the tool. Inside of the dropdown will be a select field called Group By
        where you can click and select the name of the categorical column. After
        selecting the categorical column, a legend will appear in the bottom
        left of the map and the colors of the markers and clusters will update
        in accordance with your selection.
      </p>
      <p>
        The marker colors will be unique up to 19 different categories after
        which colors will be reused.
      </p>
      <h6 class="text-h6">
        Removing a group by column
      </h6>
      <p />
      <p>
        After adding the group by column, an X will appear in the select field,
        to the right of the selected column name. If this is clicked, the group
        by key will be removed and the normal marker and cluster colors will
        return back to the tool.
      </p>
    </div>
  </div>
</template>