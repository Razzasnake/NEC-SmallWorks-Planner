<template>
  <FeaturesComponent />
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import FeaturesComponent from "@/components/Features/Features/Features.vue";

/**
 * Features page
 */
@Component({
  components: {
    FeaturesComponent
  }
})
export default class Features extends Vue {}
</script>