<template>
  <div class="map-your-excel-locational-data">
    <div class="header">
      <div class="section">
        <div class="title">Map Your Excel Locational Data</div>
        <div class="subtitle">
          Locational data stored in excel and csv files is more insightful when displayed on a map. Thanks to
          <b>Table & Map</b>, interacting with your data has never been easier. Follow the guide to see your locational data on a map and start interacting with your data like you have always wanted.
        </div>
      </div>
    </div>
    <div class="content">
      <div class="section">
        <div>
          <div class="label">I have an excel or csv file:</div>
          <div class="margin-left-large">
            <div>
              1. Go to
              <a href="https://tableandmap.com">tableandmap.com</a> and click
              <b>Upload a dataset</b>.
            </div>
            <div>2. Select an excel or csv file from your computer.</div>
            <div>3. Table & Map will process your file. The larger the file, the longer this step takes to complete.</div>
            <div>
              4. If you
              <u>do</u> have a latitude and longitude in the file:
            </div>
            <div class="margin-left-large">
              <div>a. The system will attempt to automatically detect the columns and if successful, you will enter the tool automatically.</div>
              <div>
                b. If the system needs some help, it will prompt you to select the correct latitude and longitude columns. After selecting the columns, press
                <b>Finish</b> and you will enter the tool.
              </div>
            </div>
            <div>
              5. If you
              <u>do not</u> have a latitude and longitude in the file:
            </div>
            <div class="margin-left-large">
              <div>a. The system will ask you to select the location columns. You must fill at least one of the requested fields: Address, City, State or Zip.</div>
              <div>
                b. Press
                <b>Finish</b> and the system will compute the latitude and longitude for each record and add them as new columns to your dataset.
              </div>
              <div>c. You will enter the tool automatically when the geocoding process is complete. The duration of this step depends on the number of records in the dataset.</div>
            </div>
          </div>
        </div>
        <div class="margin-top-large">
          <div class="label">I want to copy and paste in data:</div>
          <div class="margin-left-large">
            <div>
              1. Go to
              <a href="https://tableandmap.com">tableandmap.com</a> and click
              <b>Paste</b>.
            </div>
            <div>2. Copy the dataset and paste it into the text box.</div>
            <div>
              3. Press
              <b>Finish</b> and continue with Step 3 of the
              <i>I have an excel or csv file</i> instructions above.
            </div>
          </div>
        </div>
        <Preview class="margin-top-large preview" />
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Preview from '@/components/Home/Preview/Preview.vue';

/**
 * Map Your Excel Locational Data
 */
@Component({
  components: {
    Preview
  }
})
export default class MapYourExcelLocationalData extends Vue {}
</script>
<style lang='scss' scoped>
.map-your-excel-locational-data {
  .section {
    max-width: 1024px;
    margin: auto;
  }
  .header {
    background-color: #fafafa;
  }
  .content {
    background-color: #eeeeee;
    .preview {
      width: 80%;
      display: block;
      margin: auto;
    }
  }
}
</style>