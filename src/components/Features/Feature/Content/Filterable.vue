<template>
  <div>
    <h5 class="text-h5">
      <p>
        Quickly narrow in on a segment of your data by drawing shapes on the map
        or using the smart filters in the table that adjust with the data types
        detected.
      </p>
    </h5>
    <p />
    <v-divider />
    <p />
    <div class="margin-bottom-large">
      <h6 class="text-h6">
        Drawing Shapes
      </h6>
      <p />
      <p>
        After uploading a location dataset, select from the drawing options in
        the top left of the map. Select the circle to draw a circle starting
        from the center. Select the polygon to draw a more complex shape. Select
        the rectangle to draw a simple shape.
      </p>
      <p>
        Draw as many shapes as you want and we do the math to determine which
        point falls within each polygon.
      </p>
      <p>See the table update in real time as shapes are added to the map.</p>
      <h6 class="text-h6">
        Deleting Shapes
      </h6>
      <p />
      <p>
        To delete a shape, click the shape on the map then click the red trash
        icon that will appear as the right-most option in the top left drawing
        options. An alternative to this button is to hit the delete or backspace
        key on your keyboard. Doing so will have the same effect as clicking the
        red trash icon.
      </p>
      <p>
        This action will be permanent, so make sure you want to delete the
        shape.
      </p>
      <h6 class="text-h6">
        Adding Table Filters
      </h6>
      <p />
      <p>
        To add a table filter, click on the stacked horizontal lines to the
        right of each header in the table. If the detected data type for the
        selected column is numeric, then you will see numeric filters.
        Otherwise, you will see text filters. Select the desired filter from the
        dropdown and enter in the filter text. At this point the table and map
        will update instantly, displaying the filtered data only.
      </p>
      <h6 class="text-h6">
        Removing Table Filters
      </h6>
      <p />
      <p>
        Columns that have a filter applied to them will have a filter icon to
        the right of the header. If you want to remove one of these filters,
        click on the stacked horizontal lines that were used to add it, then
        delete the filter text from the text box. Once all of the characters are
        removed, the filter will remove itself.
      </p>
    </div>
  </div>
</template>