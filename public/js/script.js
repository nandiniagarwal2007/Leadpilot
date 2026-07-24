const uploadBtn = document.getElementById("uploadBtn");
const csvFile = document.getElementById("csvFile");

uploadBtn.addEventListener("click", () => {
    csvFile.click();
});

csvFile.addEventListener("change", async () => {

    const file = csvFile.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();

    formData.append("csvFile", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const leads = await response.json();

    const leadsContainer = document.getElementById("leadsContainer");

let table = `
    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Industry</th>
            <th>Employees</th>
        </tr>
`;

for (const lead of leads) {

    table += `
        <tr>
            <td>${lead.name}</td>
            <td>${lead.company}</td>
            <td>${lead.email}</td>
            <td>${lead.industry}</td>
            <td>${lead.employees}</td>
        </tr>
    `;

}

table += "</table>";

leadsContainer.innerHTML = table;

});