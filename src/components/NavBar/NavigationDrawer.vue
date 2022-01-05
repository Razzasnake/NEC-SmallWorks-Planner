<template>
  <v-list dense>
    <v-list-group
      v-for="(dropdown0, index0) in dropdowns"
      :key="index0"
      :prepend-icon="dropdown0.icon"
    >
      <template #activator>
        <v-list-item-title>{{ dropdown0.label }}</v-list-item-title>
      </template>
      <span
        v-for="(dropdown1, index1) in dropdown0.dropdowns"
        :key="index1"
      >
        <v-list-item v-if="dropdown1.key === 'map:groupByKey'">
          <v-list-item-content>
            <v-select
              :value="groupByKeyValue"
              :label="dropdown1.label"
              :items="groupByKeyItems"
              clearable
              dense
              @change="groupByKeyChange"
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-else
          link
          @click="updateViewOptions(dropdown1)"
        >
          <v-list-item-content>
            <v-list-item-title>{{
              keyVisible(dropdown1.key)
                ? `${activeText}${dropdown1.label}`
                : `${inactiveText}${dropdown1.label}`
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </span>
    </v-list-group>
    <v-list-group
      v-if="isSaved"
      :prepend-icon="mdiSecurity"
    >
      <template #activator>
        <v-list-item-title>Permissions</v-list-item-title>
      </template>
      <v-list-item
        link
        @click="updateShared"
      >
        <v-list-item-content>
          <v-list-item-title>
            Make
            {{ isPublic ? "private" : "public" }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        link
        :disabled="!isPublic"
        @click="copyLink"
      >
        <v-list-item-content>
          <v-list-item-title>
            Copy link
            <span
              v-if="copyLinkDisplay"
              class="float-right"
            >Copied</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <v-list-item @click="uploadLayerModal = true">
      <v-list-item-icon>
        <v-icon>{{ mdiLayers }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Layer Manager</v-list-item-title>
        <LayerManager
          v-if="uploadLayerModal"
          @close="uploadLayerModal = false"
        />
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      link
      @click="exportToCsv"
    >
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
import { mdiExport, mdiTable, mdiMap, mdiLayers, mdiSecurity } from "@mdi/js";
import LayerManager from "./LayerManager/LayerManager.vue";
import driveState from "@/store/driveStore";

/**
 * Table options
 */
@Component({
  name: "NavBarNavigationDrawer",
  components: {
    LayerManager,
  },
})
export default class NavigationDrawer extends Vue {
  private activeText: string = "Hide ";
  private inactiveText: string = "Show ";
  private mdiExport = mdiExport;
  private mdiLayers = mdiLayers;
  private mdiSecurity = mdiSecurity;
  private uploadLayerModal: boolean = false;
  private copyLinkDisplay = false;

  private get viewOptions() {
    return state.viewOptions;
  }

  private get isPublic() {
    const file = driveState.files.find(
      (file) => file.name === state.uploadedFile!.fileName
    )!;
    return file ? file.shared : false;
  }

  private get isSaved() {
    if (state.uploadedFile) {
      return (
        driveState.files.filter((_) => _.name === state.uploadedFile!.fileName)
          .length > 0
      );
    }
    return false;
  }

  private get groupByKeyItems() {
    if (state.uploadedFile) {
      const groupByKetItems = state.uploadedFile.data[0].data.map((_, index) => {
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
      })
      console.log(groupByKetItems);
      return groupByKetItems.filter(_ => _);
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
          label: "Footer",
          key: "table:footer",
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
      if (selection.key === "map:heat") {
        newOptions.push("map:markers");
        if (state.uploadedFile && state.uploadedFile.data.length > 1000) {
          newOptions.push("map:clusters");
        }
      }
      if (selection.key === "table:footer") {
        newOptions = newOptions.filter((_) => !_.startsWith("table:footer"));
      }
    } else {
      newOptions = this.viewOptions.concat(selection.key);
      if (selection.key === "map:heat") {
        newOptions = newOptions.filter(
          (_) => ["map:markers", "map:clusters"].indexOf(_) < 0
        );
      }
      if (selection.key === "table:footer") {
        newOptions.push("table:footer:avg");
      }
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

  private updateShared() {
    /**
     * Update the permissions of this file
     */
    this.$emit("update-shared");
  }

  private copyLink() {
    const configFile = driveState.files.find(
      (_) => _.name === `${state.uploadedFile!.fileName}.json`
    );
    if (configFile) {
      const url = `${process.env.VUE_APP_BASE_URL}/explore/${configFile.id}`;
      const input = document.createElement("input");
      input.setAttribute("value", url);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.copyLinkDisplay = true;
      setTimeout(() => {
        this.copyLinkDisplay = false;
      }, 2000);
    }
  }

  private exportToCsv() {
    exportToCsv();
  }
}
</script>