import React from 'react';
import { saveAs } from 'file-saver';

// Function to convert an array of objects to a CSV string
const convertToCSV = (data, excludeColumns) => {
    const filteredData = data.map(item => {
        const filteredItem = { ...item };
        excludeColumns.forEach(column => delete filteredItem[column]);
        return filteredItem;
    });

    const header = Object.keys(filteredData[0]).join(',');
    const csv = filteredData.map(row => Object.values(row).join(',')).join('\n');
    return `${header}\n${csv}`;
}

// React component
function DownloadCSVButton({ data }) {
    const excludeColumns = ['_id', 'Book', '__v', 'RatingNo'];

    const handleDownload = () => {
        const csvData = convertToCSV(data, excludeColumns);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Stocks.csv');
    }

    return (
        <button title="Download" onClick={handleDownload} id="downloadButton">
            <i className="bi bi-download"></i>
        </button>
    );
}

export default DownloadCSVButton;
