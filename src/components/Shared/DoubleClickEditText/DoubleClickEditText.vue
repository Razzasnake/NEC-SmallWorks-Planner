<template>
  <div>
    <v-tooltip
      v-if="!isEditing"
      bottom
    >
      <template #activator="{ on, attrs }">
        <span
          v-bind="attrs"
          v-on="on"
          @dblclick="startEdit"
        >
          {{ value }}
        </span>
      </template>
      <span>Double click to edit</span>
    </v-tooltip>
    <v-text-field
      v-else
      ref="textEdit"
      v-model="valueAux"
      @keyup.esc.native="handleBlur"
      @blur="saveEdit"
      @keyup.enter.native="saveEdit"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

/**
 * Create some text that is editable upon double click.
 */
@Component({
  components: {},
})
export default class DoubleClickEditText extends Vue {
  /**
   * Initial text
   */
  @Prop({ default: "" })
  private value!: string;
  private isEditing: boolean = false;
  private valueAux: string | null = null;

  private startEdit() {
    this.isEditing = true;
    this.valueAux = this.value;
    this.$nextTick(() => {
      (this.$refs.textEdit as HTMLInputElement).focus();
    });
  }

  private saveEdit() {
    this.isEditing = false;
    if (!this.valueAux) {
      this.valueAux = "Untitled File";
    }
    /**
     * Update the value
     * 
     * @type {string}
     */
    this.$emit("input", this.valueAux);
  }

  private handleBlur() {
    this.isEditing = false;
  }
}
</script>