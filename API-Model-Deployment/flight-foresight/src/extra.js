//
// // Function to fix the JSON format and ensure all contents are wrapped in {}
//
// // Function to fix the JSON structure and combine properties into a single object
// function fixJSONStructure() {
//     // Step 1: Read the JSON file
//     fs.readFile('airportData.json', 'utf8', (err, fileData) => {
//         if (err) {
//             console.error('Error reading JSON file:', err);
//             return;
//         }
//
//         // Step 2: Parse the file data into an array
//         let jsonData;
//         try {
//             jsonData = JSON.parse(fileData);
//         } catch (parseErr) {
//             console.error('Error parsing JSON:', parseErr);
//             return;
//         }
//
//         // Step 3: Create a new object to hold the merged data
//         let mergedData = {};
//
//         // Step 4: Process each item in the array
//         jsonData.forEach(item => {
//             // Check if it's an object, then add/merge its data
//             if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
//                 Object.keys(item).forEach(key => {
//                     // Merge the data based on the key
//                     if (mergedData[key]) {
//                         // If the key exists in mergedData, make sure we have an array to store multiple values
//                         if (!Array.isArray(mergedData[key])) {
//                             mergedData[key] = [mergedData[key]];
//                         }
//                         mergedData[key].push(item[key]);
//                     } else {
//                         mergedData[key] = item[key];
//                     }
//                 });
//             }
//         });
//
//         // Step 5: Save the merged data back to the file
//         fs.writeFile('airportData.json', JSON.stringify([mergedData], null, 2), (err) => {
//             if (err) {
//                 console.error('Error saving JSON file:', err);
//             } else {
//                 console.log('JSON structure fixed and saved to airportData.json');
//             }
//         });
//     });
// }
//
//
//
