<template>
  <v-data-table :headers="headers" :items="tableData" @dblclick:row="rowClicked">
    <template v-slot:item.name="{ item }">
      <a @click="rowClicked($event, { item })">{{ item.name }}</a>
    </template>
  </v-data-table>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import state from "@/store/driveStore";

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
  components: {},
})
export default class Uploads extends Vue {
  @Prop({ default: [] })
  private files!: gapi.client.drive.File[];

  private headers = [
    { text: "Name", value: "name" },
    { text: "Owner", value: "owner", width: 150 },
    { text: "Last modified", value: "lastModified", width: 150 },
    { text: "File size", value: "fileSize", width: 150 },
  ];

  private get tableData(): TableRow[] {
    return this.files.map((file) => {
      return {
        id: file.id!,
        name: file.name!,
        owner: this.formatOwner(file),
        lastModified: this.formatLastModified(file),
        fileSize: this.formatFileSize(file),
      };
    });
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
      const options = { year: "numeric", month: "long", day: "numeric" };
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
     */
    this.$emit(
      "rowClicked",
      this.files.find((file) => file.id === row.item.id)
    );
  }
}
</script>