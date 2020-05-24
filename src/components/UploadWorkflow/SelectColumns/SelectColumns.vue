<template>
  <div>
    <b-field label="First Row Header">
      <b-checkbox v-model="firstRowHeaderAux"></b-checkbox>
    </b-field>
    <b-field v-for="c in visibleColumns" :key="c.key" :label="c.label">
      <b-autocomplete
        v-model="c.search"
        placeholder="Search for a column"
        dropdown-position="top"
        :data="filterOptions(c.search)"
        @input="inputFnc($event, c.key)"
        open-on-focus
        keep-first
      ></b-autocomplete>
    </b-field>
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
  components: {}
})
export default class SelectColumns extends Vue {
  /**
   * Array of anything that came from the Upload step.
   */
  @Prop({ default: () => [] })
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
      selection: null
    },
    {
      label: "Longitude",
      key: "lng",
      search: "",
      selection: null
    }
  ];

  private addressColmns: Column[] = [
    {
      label: "Address",
      key: "address",
      search: "",
      selection: null
    },
    {
      label: "City",
      key: "city",
      search: "",
      selection: null
    },
    {
      label: "State",
      key: "state",
      search: "",
      selection: null
    },
    {
      label: "Zip",
      key: "zip",
      search: "",
      selection: null
    }
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
     */
    this.$emit("updateFirstRowHeader", newVal);
  }

  private get allOptions(): {
    index: number;
    value: string;
  }[] {
    if (this.firstRowHeader) {
      return this.value[0].map((_, index) => {
        return {
          index,
          value: _.toString()
        };
      });
    } else {
      return this.value[0].map((_, index) => {
        return {
          index,
          value: `Column ${index.toString()} (Example: ${this.value[0][index]})`
        };
      });
    }
  }

  private get isComplete() {
    if (this.showAddressFields) {
      // Only need at least one field selected for us to be able to geocode.
      return this.addressColmns.filter(_ => _.selection !== null).length > 0;
    } else {
      return (
        this.locationColumns.filter(_ => _.selection !== null).length === 2
      );
    }
  }

  @Watch("firstRowHeader")
  private firstRowHeaderUpdated() {
    this.allColumns.forEach(col => {
      if (col.selection !== null) {
        col.search = this.allOptions[col.selection].value;
      }
    });
  }

  private created() {
    this.allColumns.forEach(col => {
      col.selection = (this.columnSelections as any)[col.key];
      if (col.selection !== null) {
        col.search = this.allOptions[col.selection].value;
      }
    });
  }

  private filterOptions(search: string | undefined) {
    if (!search) {
      return this.allOptions;
    }
    return this.allOptions.filter(option => {
      return (
        option.value
          .toString()
          .toLowerCase()
          .indexOf(search.toLowerCase()) >= 0
      );
    });
  }

  private inputFnc(text: string, key: string) {
    const field = this.visibleColumns.find(_ => _.key === key)!;
    if (text.length) {
      const option = this.allOptions.find(_ => _.value === text);
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
    this.allColumns.forEach(col => {
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
    this.$emit("updateSelections", toReturn);
    /**
     * Notify parent is the selections needed are done
     */
    this.$emit("updateIsComplete", this.isComplete);
  }

  private toggleAddressFields() {
    this.showAddressFields = !this.showAddressFields;
    this.$emit("updateIsComplete", this.isComplete);
  }
}
</script>
<style lang='scss' scoped>
</style>