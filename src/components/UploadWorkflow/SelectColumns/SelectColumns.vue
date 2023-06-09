<template>
  <div>
    <v-checkbox
      v-model="firstRowHeaderAux"
      label="First Row Header"
    />
    <div
      v-for="(c, index) in visibleColumns"
      :key="index"
    >
      <v-autocomplete
        v-model="c.search"
        :items="allOptions"
        item-text="value"
        :label="c.label"
        clearable
        name="notASearchField"
        autocomplete="notASearchField"
        @input="inputFnc($event, c.key)"
      />
    </div>
    <a
      v-if="!showAddressFields"
      a
      @click="toggleAddressFields"
    >Don't have a latitude and longitude? Click to use an address.</a>
    <a
      v-else
      @click="toggleAddressFields"
    >Have a latitude and longitude? Click to use a latitude and longitude.</a>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface Column {
  label: string;
  key: string;
  search: string;
  selection: number | null;
}

/**
 * Confirm our predictions or select columns for lat/lon or address component
 */
@Component({
  name: "UploadWorkflowSelectColumns",
  components: {},
})
export default class SelectColumns extends Vue {
  /**
   * Array of anything that came from the Upload step.
   */
  @Prop({ default: Array() })
  private value!: any[][];
  /**
   * The row that contains the headers for this file.
   */
  @Prop()
  private firstRowHeader!: boolean;
  /**
   * Column selections
   */
  @Prop()
  private columnSelections!: {
    lat: null | number;
    lng: null | number;
    address: null | number;
    city: null | number;
    state: null | number;
    zip: null | number;
  };

  private showAddressFields: boolean = false;
  private locationColumns: Column[] = [
    {
      label: "Latitude",
      key: "lat",
      search: "",
      selection: null,
    },
    {
      label: "Longitude",
      key: "lng",
      search: "",
      selection: null,
    },
  ];

  private addressColmns: Column[] = [
    {
      label: "Location / Address",
      key: "address",
      search: "",
      selection: null,
    },
    {
      label: "City / County",
      key: "city",
      search: "",
      selection: null,
    },
    {
      label: "State / Province / Postcode",
      key: "state",
      search: "",
      selection: null,
    },
    {
      label: "Zip / Postcode / Country",
      key: "zip",
      search: "",
      selection: null,
    },
  ];

  private get visibleColumns() {
    if (this.showAddressFields) {
      return this.addressColmns;
    }
    return this.locationColumns;
  }

  private get allColumns() {
    return this.locationColumns.concat(this.addressColmns);
  }

  private get firstRowHeaderAux() {
    return this.firstRowHeader;
  }

  private set firstRowHeaderAux(newVal: boolean) {
    /**
     * Update first row header value
     *
     * @type {boolean}
     */
    this.$emit("update-first-row-header", newVal);
  }

  private get allOptions(): {
    index: number;
    value: string;
  }[] {
    if (this.value.length === 0) {
      return [];
    }
    const data: { index: number; value: string }[] = [];
    if (this.firstRowHeader) {
      for (let index = 0; index < this.value[0].length; index++) {
        if (this.value[0][index]) {
          data.push({
            index,
            value: `${
              this.value[0][index] +
              (this.value[1] && this.value[1][index]
                ? ` (e.g. ${this.value[1][index]})`
                : "")
            }`,
          });
        } else {
          data.push({
            index,
            value: `Column ${index.toString()} (e.g. ${this.value[0][index]})`,
          });
        }
      }
    } else {
      for (let index = 0; index < this.value[0].length; index++) {
        data.push({
          index,
          value: `Column ${index.toString()} (e.g. ${this.value[0][index]})`,
        });
      }
    }
    return data;
  }

  private get isComplete() {
    if (this.showAddressFields) {
      // Only need at least one field selected for us to be able to geocode.
      return this.addressColmns.filter((_) => _.selection !== null).length > 0;
    } else {
      return (
        this.locationColumns.filter((_) => _.selection !== null).length === 2
      );
    }
  }

  @Watch("firstRowHeader")
  private firstRowHeaderUpdated() {
    this.allColumns.forEach((col) => {
      if (col.selection !== null && this.allOptions.length) {
        col.search = this.allOptions[col.selection].value;
      }
    });
  }

  private created() {
    this.allColumns.forEach((col) => {
      col.selection = (this.columnSelections as any)[col.key];
      if (col.selection !== null && this.allOptions.length) {
        col.search = this.allOptions[col.selection].value;
      }
    });
    if (
      this.columnSelections.lat === null &&
      this.columnSelections.lng === null
    ) {
      this.showAddressFields =
        this.columnSelections.address !== null ||
        this.columnSelections.city !== null ||
        this.columnSelections.state !== null ||
        this.columnSelections !== null;
    }
    this.$emit("update-is-complete", this.isComplete);
  }

  private inputFnc(text: string | undefined, key: string) {
    const field = this.visibleColumns.find((_) => _.key === key)!;
    if (text && text.length) {
      const option = this.allOptions.find((_) => _.value === text);
      if (option) {
        field.selection = option.index;
        field.search = option.value;
      } else {
        field.selection = null;
        field.search = "";
      }
    } else {
      field.selection = null;
      field.search = "";
    }
    const toReturn: { [key: string]: number | null } = {};
    this.allColumns.forEach((col) => {
      toReturn[col.key] = col.selection;
    });
    /**
     * Update the selections in the correct format
     *
     * @type {{
        lat: null | number;
        lng: null | number;
        address: null | number;
        city: null | number;
        state: null | number;
        zip: null | number;
      }}
     */
    this.$emit("update-selections", toReturn);
    /**
     * Notify parent is the selections needed are done
     *
     * @type {boolean}
     */
    this.$emit("update-is-complete", this.isComplete);
  }

  private toggleAddressFields() {
    this.showAddressFields = !this.showAddressFields;
    this.$emit("update-is-complete", this.isComplete);
  }
}
</script>