<template>
  <div></div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import geocodeApi from "@/api/geocode";

@Component({
  components: {}
})
export default class Geocoder extends Vue {
  private geocode: string = "";

  private mounted() {
    geocodeApi
      .fakeGeocode("111 W Wacker Dr, Chicago, IL 60601")
      .then(response => {
        console.log(response);
      });
  }
}
</script>
<style lang='scss' scoped>
</style>