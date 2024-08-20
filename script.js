let currentPage = 1;
let rowsPerPage = 10;

function displayTableRows(page) {
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tr');
    const totalRows = rows.length - 1; // excluding header row
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    for (let i = 1; i < rows.length; i++) {
        rows[i].style.display = 'none';
    }

    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, totalRows + 1);

    for (let i = start; i < end; i++) {
        rows[i].style.display = '';
    }

    updatePaginationControls(totalPages, page);
}

function updatePaginationControls(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayTableRows(currentPage);
        });
        pagination.appendChild(pageBtn);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayTableRows(currentPage);
    makeTableEditable();
});

function sortTable(columnIndex) {
    let table = document.getElementById("dataTable");
    let rows = table.rows;
    let switching = true;
    let direction = "asc";
    let switchcount = 0;

    removeSortIcons();

    while (switching) {
        switching = false;
        for (let i = 1; i < (rows.length - 1); i++) {
            let shouldSwitch = false;
            let x = rows[i].getElementsByTagName("TD")[columnIndex];
            let y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

            if (direction === "asc" && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
                shouldSwitch = true;
                break;
            } else if (direction === "desc" && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && direction === "asc") {
                direction = "desc";
                switching = true;
            }
        }
    }

    addSortIcon(columnIndex, direction);
}

function addSortIcon(columnIndex, direction) {
    const th = document.getElementsByTagName('th')[columnIndex];
    const icon = document.createElement('span');
    icon.classList.add('sort-icon');
    icon.innerHTML = direction === 'asc' ? ' &#9650;' : ' &#9660;';
    th.appendChild(icon);
}

function removeSortIcons() {
    const icons = document.getElementsByClassName('sort-icon');
    while (icons.length > 0) {
        icons[0].parentNode.removeChild(icons[0]);
    }
}

function filterTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

function resetTable() {
    document.getElementById("searchInput").value = "";
    filterTable();
}

function filterByColumn(columnIndex) {
    const input = document.getElementsByTagName('th')[columnIndex].getElementsByTagName('input')[0];
    const filter = input.value.toUpperCase();
    const table = document.getElementById("dataTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td")[columnIndex];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function makeTableEditable() {
    const table = document.getElementById("dataTable");
    const cells = table.getElementsByTagName("td");

    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("contenteditable", "true");
        cells[i].addEventListener("blur", function() {
            validateCell(this);
        });
    }
}

function validateCell(cell) {
    const columnIndex = cell.cellIndex;
    const value = cell.textContent.trim();
    if (columnIndex === 1) { // Assuming Age column
        if (!isNumeric(value) || value < 0) {
            alert("Invalid age value");
            cell.textContent = "";
        }
    }
    // Additional validations can be added for other columns
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function exportTableToCSV(filename) {
    let csv = [];
    const rows = document.querySelectorAll("table tr");

    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        csv.push(row.join(","));
    }

    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
