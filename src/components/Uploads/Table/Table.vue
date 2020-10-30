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
    >
      <!-- eslint-disable vue/valid-v-slot -->
      <template #item.name="{ item }">
        <div>
          <v-tooltip
            v-if="item.isPublic"
            bottom
          >
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                class="margin-right-small"
                v-on="on"
              >
                {{ mdiEarth }}
              </v-icon>
            </template>
            <span>Public</span>
          </v-tooltip>
          {{ item.name }}
        </div>
      </template>
      <!--eslint-enable-->
    </v-data-table>
    <v-menu
      v-if="showMenu"
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
        <v-list-item @click="updateShared">
          <v-list-item-icon>
            <v-icon>
              {{
                contextMenuItem.isPublic ? mdiAccount : mdiEarth
              }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Make
            {{
              contextMenuItem.isPublic ? "private" : "public"
            }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :disabled="!contextMenuItem.isPublic"
          @click="copyLink"
        >
          <v-list-item-icon>
            <v-icon>{{ mdiLink }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Copy link</v-list-item-title>
        </v-list-item>
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
            <v-icon>{{ mdiDeleteOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Remove</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-snackbar
      v-model="configMissingSnackbar"
      bottom
      color="error"
    >
      <div class="align-center">
        Configuration file cannot be found in
        <a
          :href="driveFolderUrl"
          target="_blank"
        >Google Drive</a>
      </div>
    </v-snackbar>
    <v-snackbar
      v-model="copyLinkDisplay"
      bottom
    >
      <div class="align-center">
        Public link copied to clipboard
      </div>
    </v-snackbar>
  </v-card>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { mdiMagnify } from "@mdi/js";
import Loading from "@/components/Shared/Loading/Loading.vue";
import {
  mdiEye,
  mdiEarth,
  mdiLink,
  mdiDownloadOutline,
  mdiDeleteOutline,
  mdiFileEditOutline,
  mdiAccount,
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
  /**
   * Google drive folder id
   */
  @Prop({ default: null })
  private folderId!: string;

  private search: string = "";
  private mdiMagnify = mdiMagnify;
  private loading = false;
  private noDataText = 'You have no uploads. Click "New" to get started.';
  private showMenu = false;
  private contextMenuItem: TableRow | null = null;
  private x: number = 0;
  private y: number = 0;
  private mdiEye = mdiEye;
  private mdiEarth = mdiEarth;
  private mdiAccount = mdiAccount;
  private mdiLink = mdiLink;
  private mdiDownloadOutline = mdiDownloadOutline;
  private mdiDeleteOutline = mdiDeleteOutline;
  private mdiFileEditOutline = mdiFileEditOutline;
  private configMissingSnackbar = false;
  private copyLinkDisplay = false;

  private get driveFolderUrl() {
    return `https://drive.google.com/drive/folders/${this.folderId}`;
  }

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
          isPublic: this.isPublic(file),
        };
      });
  }

  private isPublic(file: gapi.client.drive.File): boolean {
    const collectedFiles = this.collectFiles({ id: file.id! } as TableRow);
    if (
      collectedFiles.file &&
      collectedFiles.file.shared &&
      collectedFiles.configFile &&
      collectedFiles.configFile.shared
    ) {
      if (collectedFiles.geojsonFile) {
        return collectedFiles.geojsonFile.shared!;
      }
      return true;
    }
    return false;
  }

  private formatName(file: gapi.client.drive.File) {
    if (file.name) {
      return file.name.split(".").slice(0, -2).join(".");
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
    const collectedFiles = this.collectFiles(row.item);
    if (collectedFiles.configFile) {
      this.$emit("row-clicked", this.collectFiles(row.item));
      this.loading = true;
    } else {
      this.configMissingSnackbar = true;
    }
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
      const collectedFiles = this.collectFiles(this.contextMenuItem);
      if (collectedFiles.configFile) {
        this.$emit("row-clicked", this.collectFiles(this.contextMenuItem));
        this.loading = true;
      } else {
        this.configMissingSnackbar = true;
      }
    }
  }

  private updateShared() {
    if (this.contextMenuItem) {
      /**
       * Notify parent to update the shared settings
       *
       * @type {{ file: gapi.client.drive.File, configFile: gapi.client.drive.File, geojsonFile: gapi.client.drive.File | undefined }}
       */
      this.$emit("update-shared", this.collectFiles(this.contextMenuItem));
    }
  }

  private copyLink() {
    if (this.contextMenuItem) {
      const files = this.collectFiles(this.contextMenuItem);
      if (files.configFile) {
        const url = `${process.env.VUE_APP_BASE_URL}/explore/${files.configFile.id}`;
        const input = document.createElement("input");
        input.setAttribute("value", url);
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        this.copyLinkDisplay = true;
      }
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