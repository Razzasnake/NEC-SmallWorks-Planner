<template>
  <v-card elevation="0">
    <Loading :loading="loading" />
    <v-card-title>
      Uploads
      <v-spacer />
      <v-spacer />
      <v-text-field
        v-model="search"
        :prepend-icon="mdiMagnify"
        label="Search in Drive"
        single-line
        hide-details
        clearable
      />
    </v-card-title>
    <v-data-table
      sort-by="name"
      :no-data-text="noDataText"
      :headers="headers"
      :items="tableData"
      :search="search"
      :mobile-breakpoint="0"
      :loading="vuetifyTableLoading"
      single-select
      @dblclick:row="rowClicked"
      @contextmenu:row="openContextMenu"
      @click:row="activateRow"
    />
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-item @click="open">
          <v-list-item-icon>
            <v-icon>{{ mdiEye }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Open</v-list-item-title>
        </v-list-item>
        <v-divider />
        <!-- <v-list-item @click="share">
          <v-list-item-icon>
            <v-icon>{{ mdiAccountPlusOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Share</v-list-item-title>
        </v-list-item>
        <v-list-item @click="getLink">
          <v-list-item-icon>
            <v-icon>{{ mdiLink }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Get link</v-list-item-title>
        </v-list-item> -->
        <v-list-item @click="rename">
          <v-list-item-icon>
            <v-icon>{{ mdiFileEditOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Rename</v-list-item-title>
        </v-list-item>
        <v-list-item @click="download">
          <v-list-item-icon>
            <v-icon>{{ mdiDownloadOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Download</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="remove">
          <v-list-item-icon>
            <v-icon>{{ mdiDelete }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Remove</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { mdiMagnify } from "@mdi/js";
import Loading from "@/components/Shared/Loading/Loading.vue";
import {
  mdiEye,
  mdiAccountPlusOutline,
  mdiLink,
  mdiDownloadOutline,
  mdiDelete,
  mdiFileEditOutline,
} from "@mdi/js";

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
  /**
   * Whether or not we are getting the files
   */
  @Prop({ default: false })
  private tableLoading!: boolean;
  private search: string = "";
  private mdiMagnify = mdiMagnify;
  private loading = false;
  private noDataText = 'You have no uploads. Click "New" to get started.';
  private showMenu = false;
  private contextMenuItem: TableRow | null = null;
  private x: number = 0;
  private y: number = 0;
  private mdiEye = mdiEye;
  private mdiAccountPlusOutline = mdiAccountPlusOutline;
  private mdiLink = mdiLink;
  private mdiDownloadOutline = mdiDownloadOutline;
  private mdiDelete = mdiDelete;
  private mdiFileEditOutline = mdiFileEditOutline;

  private get vuetifyTableLoading() {
    return this.tableLoading ? "primary" : false;
  }

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

  private collectFiles(item: TableRow) {
    const file = this.files.find((file) => file.id === item.id)!;
    const configFile = this.files.find((_) => _.name === `${file.name}.json`);
    const geojsonFile = this.files.find(
      (_) => _.name === `${file.name}.geojson.json`
    );
    return { file, configFile, geojsonFile };
  }

  private rowClicked(event: MouseEvent | undefined, row: { item: TableRow }) {
    /**
     * Notify parent to download this row and start the tool with it
     *
     * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
     */
    this.$emit("rowClicked", this.collectFiles(row.item));
    this.loading = true;
  }

  private openContextMenu(
    event: MouseEvent,
    row: { item: TableRow; select: (val: boolean) => void }
  ) {
    event.preventDefault();
    this.showMenu = false;
    this.contextMenuItem = row.item;
    this.activateRow(event, row);
    this.x = event.clientX;
    this.y = event.clientY;
    this.$nextTick(() => {
      this.showMenu = true;
    });
  }

  private activateRow(
    event: MouseEvent,
    row: { item: TableRow; select: (val: boolean) => void }
  ) {
    row.select(true);
  }

  private open() {
    if (this.contextMenuItem) {
      this.$emit("rowClicked", this.collectFiles(this.contextMenuItem));
      this.loading = true;
    }
  }

  private share() {
    if (this.contextMenuItem) {
      /**
       * Notify parent to share this file
       *
       * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
       */
      this.$emit("share", this.collectFiles(this.contextMenuItem));
    }
  }

  private getLink() {
    if (this.contextMenuItem) {
      /**
       * Notify parent to get the link of this file
       *
       * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
       */
      this.$emit("getLink", this.collectFiles(this.contextMenuItem));
    }
  }

  private rename() {
    if (this.contextMenuItem) {
      /**
       * Notify parent to rename this file
       *
       * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
       */
      this.$emit("rename", this.collectFiles(this.contextMenuItem));
    }
  }

  private download() {
    if (this.contextMenuItem) {
      const files = this.collectFiles(this.contextMenuItem);
      if (files.file.webContentLink) {
        window.location.href = files.file.webContentLink;
      }
    }
  }

  private remove() {
    if (this.contextMenuItem) {
      /**
       * Notify parent to remove this file
       *
       * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
       */
      this.$emit("remove", this.collectFiles(this.contextMenuItem));
    }
  }

  private deactivated() {
    this.loading = false;
  }
}
</script>