<template>
  <v-card elevation="0">
    <Loading :loading="loading" />
    <v-card-title>
      My Uploads
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        :prepend-icon="mdiMagnify"
        label="Search in Drive"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-card-title>
    <v-data-table
      sort-by="name"
      :no-data-text="noDataText"
      :headers="headers"
      :items="tableData"
      :search="search"
      :mobile-breakpoint="0"
      @dblclick:row="rowClicked"
    ></v-data-table>
  </v-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { mdiMagnify } from "@mdi/js";
import Loading from "@/components/Shared/Loading/Loading.vue";

interface TableRow {
  id: string;
  name: string;
  owner: string;
  lastModified: string;
  fileSize: string;
}

/**
 * Display all of the users uploads stored in google drive.
 */
@Component({
  components: {
    Loading,
  },
})
export default class Table extends Vue {
  /**
   * List of files to display in the table
   */
  @Prop({ default: Array() })
  private files!: gapi.client.drive.File[];
  private search: string = "";
  private mdiMagnify = mdiMagnify;
  private loading = false;
  private noDataText = 'You have no uploads. Click "New" to get started.';

  private get headers() {
    const headers: {
      text: string;
      value: string;
      width?: number | undefined;
    }[] = [{ text: "Name", value: "name" }];
    if (this.$vuetify.breakpoint.smAndUp) {
      headers.push({ text: "Owner", value: "owner", width: 150 });
      headers.push({
        text: "Last modified",
        value: "lastModified",
        width: 150,
      });
    }
    if (this.$vuetify.breakpoint.mdAndUp) {
      headers.push({ text: "File size", value: "fileSize", width: 100 });
    }
    return headers;
  }

  private get tableData(): TableRow[] {
    return this.files
      .filter((_) => _.name!.endsWith(".csv"))
      .map((file) => {
        return {
          id: file.id!,
          name: this.formatName(file),
          owner: this.formatOwner(file),
          lastModified: this.formatLastModified(file),
          fileSize: this.formatFileSize(file),
        };
      });
  }

  private formatName(file: gapi.client.drive.File) {
    if (file.name) {
      const fileNameArr = file.name.split(".");
      return fileNameArr.slice(0, fileNameArr.length - 2).join(".") + ".csv";
    }
    return "";
  }

  private formatOwner(file: gapi.client.drive.File) {
    if (!file.ownedByMe && file.owners) {
      return file.owners.map((_) => _.displayName).join(",");
    }
    return "me";
  }

  private formatLastModified(file: gapi.client.drive.File) {
    let lastModified = "";
    if (file.modifiedTime) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const locale =
        navigator.languages && navigator.languages.length
          ? navigator.languages[0]
          : navigator.language;
      lastModified = new Date(file.modifiedTime).toLocaleDateString(
        locale,
        options
      );
    }
    if (file.lastModifyingUser) {
      if (file.lastModifyingUser.me) {
        return `${lastModified} me`;
      } else {
        return `${lastModified} ${file.lastModifyingUser.displayName}`;
      }
    }
    return lastModified;
  }

  private formatFileSize(file: gapi.client.drive.File) {
    if (file.size) {
      const int = parseInt(file.size);
      if (int < 1024) {
        return `${int.toLocaleString()} bytes`;
      } else if (int < 1048576) {
        return `${Math.round(int / 1024).toLocaleString()} KB`;
      } else if (int < 1073741824) {
        return `${Math.round(int / 1048576).toLocaleString()} MB`;
      }
    }
    return "";
  }

  private rowClicked(event: MouseEvent, row: { item: TableRow }) {
    /**
     * Notify parent to download this row and start the tool with it
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File }}
     */
    const file = this.files.find((file) => file.id === row.item.id)!;
    const configFile = this.files.find((_) => _.name === `${file.name}.json`);
    this.$emit("rowClicked", { file, configFile });
    this.loading = true;
  }

  private deactivated() {
    this.loading = false;
  }
}
</script>