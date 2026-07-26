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
    const sendBtn = document.getElementById("sendBtn");

let currentLead = null;
let currentEmail = "";

let table = `
    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
    <th>Name</th>
    <th>Company</th>
    <th>Email</th>
    <th>Industry</th>
    <th>Employees</th>
    <th>Action</th>
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
        <td>
            <button
                onclick='generateEmail(${JSON.stringify(lead)})'>
                Generate Email
            </button>
        </td>
    </tr>
`;
} 
table += "</table>";

leadsContainer.innerHTML = table;

});
async function generateEmail(lead) {
    alert("Button Clicked!");

    const response = await fetch("/generate-email", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(lead)

    });

    const result = await response.json();

    console.log(JSON.stringify(result, null, 2));

const preview = document.getElementById("emailPreview");

console.log(preview);

preview.textContent = result.email;
currentLead = lead;
currentEmail = result.email;

sendBtn.style.display = "inline-block";

}
sendBtn.addEventListener("click", async () => {

    const response = await fetch("/send-email", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            email: currentLead.email,

            subject: `Helping ${currentLead.company} Grow with AI`,

            body: currentEmail

        })

    });

    const result = await response.json();

    if (result.success) {

        alert("✅ Email Sent Successfully!");

    } else {

        alert("❌ Failed to send email.");

    }

});