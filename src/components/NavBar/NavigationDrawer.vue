<template>
  <v-list dense>
    <v-list-group
      v-for="(dropdown0, index0) in dropdowns"
      :key="index0"
      :prepend-icon="dropdown0.icon"
    >
      <template v-slot:activator>
        <v-list-item-title>{{ dropdown0.label }}</v-list-item-title>
      </template>
      <span v-for="(dropdown1, index1) in dropdown0.dropdowns" :key="index1">
        <v-list-item v-if="dropdown1.key === 'map:groupByKey'">
          <v-list-item-content>
            <v-select
              :value="groupByKeyValue"
              :label="dropdown1.label"
              :items="groupByKeyItems"
              clearable
              dense
              @change="groupByKeyChange"
            ></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else link @click="updateViewOptions(dropdown1)">
          <v-list-item-content>
            <v-list-item-title>{{ keyVisible(dropdown1.key) ? `${activeText}${dropdown1.label}` :`${inactiveText}${dropdown1.label}` }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </span>
    </v-list-group>
    <v-list-item link @click="exportToCsv">
      <v-list-item-icon>
        <v-icon>{{ mdiExport }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Export</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import state, { updateViewOptions, exportToCsv } from "@/store/exploreStore";
import { mdiExport, mdiTable, mdiMap } from "@mdi/js";

/**
 * Table options
 */
@Component({
  components: {},
})
export default class NavigationDrawer extends Vue {
  private activeText: string = "Hide ";
  private inactiveText: string = "Show ";
  private mdiExport = mdiExport;

  private get viewOptions() {
    return state.viewOptions;
  }

  private get groupByKeyItems() {
    if (state.uploadedFile) {
      return state.uploadedFile.data[0].data.map((_, index) => {
        if (state.uploadedFile!.firstRowHeader) {
          return {
            text: state.uploadedFile!.data[0].data[index],
            value: index.toString(),
          };
        } else {
          return {
            text: `Column ${(index + 1).toString()}`,
            value: index.toString(),
          };
        }
      });
    }
    return [];
  }

  private get groupByKeyValue() {
    const value = this.viewOptions.find((_) => _.startsWith("map:groupByKey:"));
    if (value) {
      return value.split("map:groupByKey:")[1];
    }
    return null;
  }
  private set groupByKeyValue(newValue: string | null) {}

  private dropdowns = [
    {
      label: "Table",
      icon: mdiTable,
      dropdowns: [
        {
          label: "Table",
          key: "table",
        },
        {
          label: "Footer Min",
          key: "table:footer:min",
        },
        {
          label: "Footer Max",
          key: "table:footer:max",
        },
        {
          label: "Footer Avg",
          key: "table:footer:avg",
        },
        {
          label: "Footer Total",
          key: "table:footer:total",
        },
      ],
    },
    {
      label: "Map",
      icon: mdiMap,
      dropdowns: [
        {
          label: "Map",
          key: "map",
        },
        {
          label: "Heat Map",
          key: "map:heat",
        },
        {
          label: "Markers",
          key: "map:markers",
        },
        {
          label: "Clusters",
          key: "map:clusters",
        },
        {
          label: "Group By",
          key: "map:groupByKey",
        },
      ],
    },
  ];

  private keyVisible(key: string) {
    return this.viewOptions.indexOf(key) > -1;
  }

  private updateViewOptions(selection: { label: string; key: string }) {
    let newOptions: string[] = [];
    if (this.keyVisible(selection.key)) {
      newOptions = this.viewOptions.filter((_) => _ !== selection.key);
    } else {
      newOptions = this.viewOptions.concat(selection.key);
    }
    if (!newOptions.includes("map") && !newOptions.includes("table")) {
      if (this.viewOptions.includes("map")) {
        newOptions.push("table");
      } else {
        newOptions.push("map");
      }
    }
    updateViewOptions(newOptions);
  }

  private groupByKeyChange(value: string | undefined) {
    const newOptions: string[] = this.viewOptions.filter(
      (_) => !_.startsWith("map:groupByKey")
    );
    if (value) {
      newOptions.push(`map:groupByKey:${value}`);
    }
    updateViewOptions(newOptions);
  }

  private exportToCsv() {
    exportToCsv();
  }
}
</script>