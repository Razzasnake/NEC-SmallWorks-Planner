const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const axios = require('axios');
const chokidar = require('chokidar');

const apiKey = 'AIzaSyBEwxTPR1yMSEW05ZSuR-RQ9vrv1m6W0t4';

const coordinatesCache = new Map();

async function readExistingJobData() {
    const jobDataFilePath = path.join(__dirname, 'jobDataWithCoordinates.json');
    if (fs.existsSync(jobDataFilePath)) {
        const jobDataString = fs.readFileSync(jobDataFilePath, 'utf-8');
        const jobData = JSON.parse(jobDataString);
        jobData.forEach(job => {
            coordinatesCache.set(job.address, {
                lat: job.latitude,
                lng: job.longitude,
            });
        });
    }
}

async function processExcelFile() {
    console.log('Processing Excel file...');

    await readExistingJobData();

    // Read the Excel file
    const excelFilePath = path.join(__dirname, 'jobs.xlsx');
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jobData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }).slice(2);
    const updatedJobData = [];

    // Fetch coordinates for each job and add them to the job data
    for (const row of jobData.slice(1)) { 
        if (!row[0]) {
            continue;
        }
        const job = {
            "Job No.": row[0],
            "Description": row[1],
            "Customer": row[2],
            "Start Date": row[4],
        };

        // Check if the Description field exists and is not empty
        if (job.Description) {
            // Split the Description field into parts using a regex that matches a hyphen with optional spaces around it
            const parts = job.Description.split(/\s*-\s*/);

            // Assign the first part to the address
            job.address = parts[0];

            // Assign the second part to the description, if it exists
            job.Description = parts[1] || '';

            // Extract only numbers from the last part (priority), if it exists
            if (parts[2]) {
                const priorityNumber = parts[2].match(/\d+/);
                if (priorityNumber) {
                    job.Priority = Number(priorityNumber[0]);
                } else {
                    job.Priority = '';
                }
            } else {
                job.Priority = '';
            }
        } else {
            // Set address, Description, and Priority to empty strings if the Description field is missing or empty
            job.address = '';
            job.Description = '';
            job.Priority = '90';
        }

        // Convert Start Date to a date object if it's a number
        if (typeof job['Start Date'] === 'number') {
            const dateValue = (job['Start Date'] - 25569) * 86400 * 1000;
            const dateObj = new Date(dateValue);

            // Format the date using the toISOString method
            job['Start Date'] = dateObj.toISOString();
        }

        // Copy the "Customer" field as "client" in the JSON
        job.Client = job.Customer;
        delete job.Customer;
        job['Start Date:'] = job['Start Date'];
        delete job['Start Date'];
        job['Priority:'] = job.Priority || 90;
        delete job.Priority;
   

        const coordinates = await fetchCoordinates(job.address);
        if (coordinates) {
            job.latitude = coordinates.lat;
            job.longitude = coordinates.lng;
        }

        const cachedCoordinates = coordinatesCache.get(job.address);
            if (cachedCoordinates) {
             console.log(`Using cached coordinates for address: "${job.address}"`);
             job.latitude = cachedCoordinates.lat;
             job.longitude = cachedCoordinates.lng;
        } else {
            const coordinates = await fetchCoordinates(job.address);
            if (coordinates) {
                console.log(`Fetching new coordinates for address: "${job.address}"`);
                job.latitude = coordinates.lat;
                job.longitude = coordinates.lng;
                coordinatesCache.set(job.address, coordinates);
            }
        }

        updatedJobData.push(job);
    }

    // Save the updated job data with coordinates as a JSON file
    const jobDataString = JSON.stringify(updatedJobData, null, 2);
    const jobDataFilePath = path.join(__dirname, 'jobDataWithCoordinates.json');
    fs.writeFileSync(jobDataFilePath, jobDataString);
    console.log('Job data with coordinates saved to "jobDataWithCoordinates.json"');
}



async function fetchCoordinates(address) {
    console.log(`Fetching coordinates for address: "${address}"`);

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: apiKey,
            },
        });

        if (response.data.status === 'OK') {
            return response.data.results[0].geometry.location;
        } else {
            throw new Error(`Geocoding failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error(`Error fetching coordinates for address "${address}":`, error);
        return null;
    }
}

// Call the function for the first time to process the Excel file
processExcelFile();

// Watch for changes to the Excel file and call the processExcelFile function when a change is detected
const excelFilePath = path.join(__dirname, 'jobs.xlsx');
chokidar.watch(excelFilePath, { usePolling: true }).on('change', () => {
    console.log('Excel file changed, updating JSON file...');
    processExcelFile();
}).on('error', (error) => {
    console.error('Error watching Excel file:', error);
});
