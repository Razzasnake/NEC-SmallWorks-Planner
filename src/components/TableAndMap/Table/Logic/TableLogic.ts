import {
  ColDef,
  ColGroupDef,
  GridApi,
  ValueGetterParams,
} from "@ag-grid-community/core";
import AgPreview from "./AgPreview.vue";
import { max } from "@/logic/Math";
import UploadedFile, { Row, ColumnSelections } from "@/entities/UploadedFile";




export default class TableLogic {
  public columnDefs: (ColDef | ColGroupDef)[] = [];
  public api: GridApi | null = null;
  public rowData: any[] = [];

  public setGridApi(api: GridApi) {
    this.api = api;
  }

  public updateRowData(newData: any[]) {
    this.rowData = newData;
    this.refreshGrid();
  }

  public refreshGrid() {
    if (this.api) {
        this.api.setRowData(this.rowData);
    }
  }

  private computeColumnTypes(uploadedFile: UploadedFile) {
    const columnTypes: { number: number; string: number }[] = [];
    const maxCols = max(uploadedFile.data.map((_) => _.data.length));
    for (let i = 0; i < maxCols; i++) {
      columnTypes.push({ number: 0, string: 0 });
    }
    uploadedFile.data
      .slice(uploadedFile.firstRowHeader ? 1 : 0)
      .forEach((row) => {
        Object.entries(row.data).forEach(([key, value], colIndex) => {
          if (isNaN(value)) {
            columnTypes[colIndex].string += 1;
          } else {
            columnTypes[colIndex].number += 1;
          }
        });
      });
    return columnTypes.map((meta) => {
      return (meta.number / (meta.number + meta.string)) > 0.95
        ? "agNumberColumnFilter"
        : "agTextColumnFilter";
    });
  }

  public setData(uploadedFile: UploadedFile) {
    const columnTypes = this.computeColumnTypes(uploadedFile);
    const latitudeColumnIndex = (uploadedFile.data[0].columnSelections as UploadedFile['columnSelections'])?.lat ?? null;
    const longitudeColumnIndex = (uploadedFile.data[0].columnSelections as UploadedFile['columnSelections'])?.lng ?? null;

    let headers: string[] = [];
    if (uploadedFile.firstRowHeader) {
        headers = uploadedFile.headers;
    } else {
        headers = Object.keys(uploadedFile.data[0]); // Use keys of the first object as headers
    }

    // Mapping of original header to new header
    const headerMapping: { [key: string]: string | undefined } = {
        "index": "JobNo",
        "data": "Description",
        "columnSelections": "Address",
        "features": "Client"
    };


    // Replace original headers with new ones
    headers = headers.map(header => headerMapping[header] || header);

    const generatedCols: (ColDef | ColGroupDef)[] = headers
        .map((headerName: string, index: number) => {
            if (index === latitudeColumnIndex || index === longitudeColumnIndex) {
                return null;
            }

            const adjustedHeaderName = headerName === "Priority:" ? "Target (Days)" : headerName;

            return {
                headerName: adjustedHeaderName,
                filter: columnTypes[index],
                sortable: true,
                valueGetter: (params: ValueGetterParams) => {
                    return params.data.data ? params.data.data[index] : null;
                },
            };
        })
        .filter((col: ColDef | ColGroupDef | null) => col !== null) as (ColDef | ColGroupDef)[];

    const startDateCol: ColDef = {
        headerName: "Start Date",
        filter: "agDateColumnFilter",
        sortable: true,

        valueGetter: (params: ValueGetterParams) => {
            const row = params.data as Row; // Cast data as Row
            let startDate;
            const startDateIndex = uploadedFile.startDateIndex; // get the start date index here, you need to define this in your UploadedFile class

            if (row.data && Array.isArray(row.data)) {
                if (startDateIndex !== null) {
                    const [day, month, year] = row.data[startDateIndex].split("/");
                    startDate = new Date(`${month}/${day}/${year}`);  // Use startDateIndex to access start date value
                }
            } else {
                console.log("Missing data")
            }

            if (!startDate) {
                console.log('Missing or invalid data', row.data, 'startDate:', startDate);
                return null;
            }

            return startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
    };

    const priorityCol: ColDef = {
        headerName: "Priority (Days)",
        filter: "agNumberColumnFilter",
        sortable: true,
        valueGetter: (params: ValueGetterParams) => {
            const row = params.data as Row; // Cast data as Row
            let priority;
            const priorityIndex = uploadedFile.priorityIndex; // get the priority index here

            if (row.data && Array.isArray(row.data)) {
                if (priorityIndex !== null) {
                    priority = row.data[priorityIndex];  // Use priorityIndex to access priority value
                }
            } else {
                console.log("Missing data")
            }

            if (!priority || isNaN(priority)) {
                console.log('Missing or invalid data', row.data, 'priority:', priority);
                return null;
            }

            return priority;
        },
    };

    // Add target date column
    const targetDateCol: ColDef = {
        headerName: "Target Date",
        filter: "agDateColumnFilter",
        sortable: true,
        valueGetter: (params: ValueGetterParams) => {
            const row = params.data as Row; // Cast data as Row
            let priority;
            const priorityIndex = uploadedFile.priorityIndex; // get the priority index here
            const startDateIndex = uploadedFile.startDateIndex; // get the start date index here, you need to define this in your UploadedFile class
            let startDate;

            if (row.data && Array.isArray(row.data)) {
                if (priorityIndex !== null) {
                    priority = row.data[priorityIndex];  // Use priorityIndex to access priority value
                }

                if (startDateIndex !== null) {
                    const [day, month, year] = row.data[startDateIndex].split("/");
                    startDate = new Date(`${month}/${day}/${year}`);  // Use startDateIndex to access start date value
                }
            } else {
                console.log("Missing data")
            }

            if (!priority || isNaN(priority) || !startDate) {
                console.log('Missing or invalid data', row.data, 'startDate:', startDate, 'priority:', priority);
                return null;
            }

            startDate.setDate(startDate.getDate() + Number(priority)- 1);
            return startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
    };

    const daysToTargetCol: ColDef = {
        headerName: "Days To Target",
        filter: "agNumberColumnFilter",
        sortable: true,
        sort: 'desc', // sort descending by default
        comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
          if (valueA < 0 && valueB >= 0) {
            return 1; // Lapsed jobs first
          }
          if (valueA >= 0 && valueB < 0) {
            return -1; // Non-lapsed jobs after
          }
          if (valueA < 0 && valueB < 0) {
            return valueB - valueA; // Among lapsed jobs, most lapsed first
          }
          // Among non-lapsed jobs, closest to being lapsed first
          return valueB - valueA;
        },
        valueGetter: (params: ValueGetterParams) => {
            const row = params.data as Row; // Cast data as Row
            let priority;
            const priorityIndex = uploadedFile.priorityIndex; // get the priority index here
            const startDateIndex = uploadedFile.startDateIndex; // get the start date index here, you need to define this in your UploadedFile class
            let startDate;

            if (row.data && Array.isArray(row.data)) {
                if (priorityIndex !== null) {
                    priority = row.data[priorityIndex];  // Use priorityIndex to access priority value
                }

                if (startDateIndex !== null) {
                    const [day, month, year] = row.data[startDateIndex].split("/");
                    startDate = new Date(`${month}/${day}/${year}`);  // Use startDateIndex to access start date value
                }
            } else {
                console.log("Missing data")
            }

            if (!priority || isNaN(priority) || !startDate) {
                console.log('Missing or invalid data', row.data, 'startDate:', startDate, 'priority:', priority);
                return null;
            }

            startDate.setDate(startDate.getDate() + Number(priority) - 1); // Calculate target date
            const targetDate = startDate;

            // Get difference between target date and current date in days
            const currentDate = new Date();
            const diffTime = targetDate.getTime() - currentDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // Convert diffTime to days

            return diffDays;
        },
        cellStyle: (params: any) => {
            if (params.value < 0) {
                return {
                    color: 'red',
                    backgroundColor: '#ffe6e6', // light red background
                    fontWeight: 'bold', // bold text
                };
            }
            else if (params.value <= 2) {
                return {
                    color: '#ff8503',
                    backgroundColor: '#ffecb3', // light amber background
                    fontWeight: 'bold', // bold text
                };
            }
            return {
                color: 'green',
                backgroundColor: '#e6ffe6', // light green background
                fontWeight: 'bold', // bold text
            };
        },
    };

    const previewCol: ColDef = {
        headerName: "",
        field: "preview",
        pinned: "left",
        width: 92,
        suppressMenu: true,
        sortable: true,
        cellRenderer: undefined,
        cellRendererFramework: AgPreview,
    };

    this.columnDefs = [previewCol].concat(generatedCols).concat(startDateCol).concat(priorityCol).concat(targetDateCol).concat(daysToTargetCol);
  }
}

