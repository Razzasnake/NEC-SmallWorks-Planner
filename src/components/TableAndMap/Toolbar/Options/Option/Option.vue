<template>
  <v-menu offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, value }">
      <v-btn color="primary" text small v-on="on">
        <span>{{ name }}&nbsp;</span>
        <v-icon>{{ value ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </template>
    <v-list small>
      <v-list-item v-for="d in dropdowns" :key="d.key" @click="toggle(d.key)" small>
        <v-list-item-title>{{ keyVisible(d.key) ? `${activeText}${d.label}` :`${inactiveText}${d.label}` }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
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
  /**
   * Text to show before the label if option is active
   */
  @Prop({ default: "Hide " })
  private activeText!: string;
  /**
   * Text to show before the label if option is inactive
   */
  @Prop({ default: "Show " })
  private inactiveText!: string;

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