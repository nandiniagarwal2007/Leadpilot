let generatedCount = 0;
let sentCount = 0;

let currentLead = null;
let currentEmail = "";

const uploadBtn = document.getElementById("uploadBtn");
const csvFile = document.getElementById("csvFile");
const sendBtn = document.getElementById("sendBtn");

uploadBtn.addEventListener("click", () => {
    csvFile.click();
});

csvFile.addEventListener("change", async () => {

    const file = csvFile.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    const leads = await response.json();

    document.getElementById("totalLeads").textContent = leads.length;

    const leadsContainer = document.getElementById("leadsContainer");

    let table = `
        <table>
            <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Industry</th>
                <th>Employees</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
    `;

    for (const lead of leads) {

        table += `
            <tr id="row-${lead.email}">
                <td>${lead.name}</td>
                <td>${lead.company}</td>
                <td>${lead.email}</td>
                <td>${lead.industry}</td>
                <td>${lead.employees}</td>

                <td>
                    <span id="status-${lead.email}" class="status pending">
                        Pending
                    </span>
                </td>

                <td>
                    <button onclick='generateEmail(${JSON.stringify(lead)})'>
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

    currentLead = lead;

    const response = await fetch("/generate-email", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(lead)

    });

    const result = await response.json();

    currentEmail = result.email;

    document.getElementById("emailPreview").textContent = currentEmail;

    generatedCount++;

    document.getElementById("generatedEmails").textContent = generatedCount;

    document.getElementById(`status-${lead.email}`).className =
        "status generated";

    document.getElementById(`status-${lead.email}`).textContent =
        "Generated";

    sendBtn.style.display = "block";

}

sendBtn.addEventListener("click", async () => {

    if (!currentLead) {

        alert("Generate an email first.");

        return;

    }

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

        sentCount++;

        document.getElementById("sentEmails").textContent = sentCount;

        document.getElementById(`status-${currentLead.email}`).className =
            "status sent";

        document.getElementById(`status-${currentLead.email}`).textContent =
            "Sent";

    } else {

        alert("❌ Failed to send email.");

    }

});