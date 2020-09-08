
const data = {
  kind: "drive#file",
  id: "1y5ZhaH3BWYVb34QeyaQvHRoP3D_Oqdxw",
  name: "property-detail-1000.csv",
  mimeType: "text/csv",
  starred: false,
  trashed: false,
  explicitlyTrashed: false,
  parents: [
    "1eHPrtYyFQNoJ4GylHV4ArLsOnV-qp7KT"
  ],
  spaces: [
    "drive"
  ],
  version: "1",
  webContentLink: "https://drive.google.com/uc?id=1y5ZhaH3BWYVb34QeyaQvHRoP3D_Oqdxw&export=download",
  webViewLink: "https://drive.google.com/file/d/1y5ZhaH3BWYVb34QeyaQvHRoP3D_Oqdxw/view?usp=drivesdk",
  iconLink: "https://drive-thirdparty.googleusercontent.com/16/type/text/csv",
  hasThumbnail: false,
  thumbnailVersion: "0",
  viewedByMe: true,
  viewedByMeTime: "2020-09-04T20:08:26.833Z",
  createdTime: "2020-09-04T20:08:26.833Z",
  modifiedTime: "2020-08-01T18:03:41.000Z",
  modifiedByMeTime: "2020-08-01T18:03:41.000Z",
  modifiedByMe: true,
  owners: [
    {
      kind: "drive#user",
      displayName: "Tim Gamble",
      photoLink: "https://lh4.googleusercontent.com/-ICaXVuRWujY/AAAAAAAAAAI/AAAAAAAAkqg/uB0RZbl7XOY/s64/photo.jpg",
      me: true,
      permissionId: "07807101812976335157",
      emailAddress: "tjgambs@gmail.com"
    }
  ],
  lastModifyingUser: {
    kind: "drive#user",
    displayName: "Tim Gamble",
    photoLink: "https://lh4.googleusercontent.com/-ICaXVuRWujY/AAAAAAAAAAI/AAAAAAAAkqg/uB0RZbl7XOY/s64/photo.jpg",
    me: true,
    permissionId: "07807101812976335157",
    emailAddress: "tjgambs@gmail.com"
  },
  shared: false,
  ownedByMe: true,
  capabilities: {
    canAddChildren: false,
    canAddMyDriveParent: false,
    canChangeCopyRequiresWriterPermission: true,
    canChangeViewersCanCopyContent: true,
    canComment: true,
    canCopy: true,
    canDelete: true,
    canDownload: true,
    canEdit: true,
    canListChildren: false,
    canModifyContent: true,
    canMoveChildrenWithinDrive: false,
    canMoveItemIntoTeamDrive: true,
    canMoveItemOutOfDrive: true,
    canMoveItemWithinDrive: true,
    canReadRevisions: true,
    canRemoveChildren: false,
    canRemoveMyDriveParent: true,
    canRename: true,
    canShare: true,
    canTrash: true,
    canUntrash: true
  },
  viewersCanCopyContent: true,
  copyRequiresWriterPermission: false,
  writersCanShare: true,
  permissions: [
    {
      kind: "drive#permission",
      id: "07807101812976335157",
      type: "user",
      emailAddress: "tjgambs@gmail.com",
      role: "owner",
      displayName: "Tim Gamble",
      photoLink: "https://lh4.googleusercontent.com/-ICaXVuRWujY/AAAAAAAAAAI/AAAAAAAAkqg/uB0RZbl7XOY/s64/photo.jpg",
      deleted: false
    }
  ],
  permissionIds: [
    "07807101812976335157"
  ],
  originalFilename: "property-detail-1000.csv",
  fullFileExtension: "csv",
  fileExtension: "csv",
  md5Checksum: "192451e5670eefc3c116356c60cb851b",
  size: "94574",
  quotaBytesUsed: "94574",
  headRevisionId: "0B4RANAhttRnaZms2WFVRY0N6SEh1Mmt5Sk9BWW9kMDNEMUtZPQ",
  isAppAuthorized: false
}

export default (): gapi.client.drive.File => {
  const response = Object.assign({}, data);
  response.id = Math.random().toString(36).substring(7);
  return response;
}