<template>
  <b-dropdown>
    <a slot="trigger" slot-scope="{ active }">
      <span>{{ name }}&nbsp;</span>
      <font-awesome-icon :icon="active ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </a>
    <b-dropdown-item
      v-for="d in dropdowns"
      :key="d.key"
      @click="toggle(d.key)"
    >{{ keyVisible(d.key) ? `Hide ${d.label}` :`Show ${d.label}` }}</b-dropdown-item>
  </b-dropdown>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * A generic component to generate option dropdowns for the toolbars.
 */
@Component({
  components: {}
})
export default class Option extends Vue {
  /**
   * Name of the dropdown
   */
  @Prop()
  private name!: string;
  /**
   * Dropdowns to display
   */
  @Prop({ default: () => [] })
  private dropdowns!: {
    label: string;
    key: string;
  }[];
  /**
   * Options that are in use
   */
  @Prop({ default: () => [] })
  private options!: string[];

  private keyVisible(key: string) {
    return this.options.indexOf(key) > -1;
  }

  private toggle(key: string) {
    if (this.keyVisible(key)) {
      /**
       * Update parent with new array of map options
       *
       * @type {string[]}
       */
      this.$emit(
        "updateOptions",
        this.options.filter(_ => _ !== key)
      );
    } else {
      const viewOptions = this.options.concat(key);
      this.$emit("updateOptions", viewOptions);
    }
  }
}
</script>
<style lang='scss' scoped>
.displaying-icon {
  position: absolute;
  right: 18px;
  top: 10px;
}
</style>