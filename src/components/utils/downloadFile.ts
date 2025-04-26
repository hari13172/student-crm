import { saveAs } from "file-saver";

export function downloadFile(blob: Blob, pathSegments: string) {
    // Get the current date and time
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0"); // Ensure two digits
    const minutes = String(today.getMinutes()).padStart(2, "0"); // Ensure two digits

    // Format the date and time as dd-mm-yyyy_HH-MM
    const formattedDateTime = `(${day}-${month}-${year}_${hours}-${minutes})`;

    // Construct the filename using the first segment of the path and the formatted date-time
    const fileName = `${pathSegments}_${formattedDateTime}.xlsx`;

    // Save the file using FileSaver.js
    saveAs(blob, fileName);
}