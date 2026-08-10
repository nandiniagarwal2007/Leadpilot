// ===============================
// GLOBAL VARIABLES
// ===============================

let generatedCount = 0;
let sentCount = 0;

let currentLead = null;
let currentEmail = "";

let currentLeads = [];


// ===============================
// LOAD LEADS FROM DATABASE
// ===============================

async function loadLeadsFromDatabase() {

    try {

        const response = await fetch("/leads");

        const leads = await response.json();

        currentLeads = leads;

        displayLeads(leads);

        document.getElementById("totalLeads").textContent =
            leads.length;

    } catch (error) {

        console.error("❌ Error loading leads:", error);

    }

}


// ===============================
// DISPLAY LEADS
// ===============================

function displayLeads(leads) {

    currentLeads = leads;

    const leadsContainer =
        document.getElementById("leadsContainer");

    if (!leadsContainer) return;

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

        let status = "Pending";
        let statusClass = "pending";

        if (lead.emailSent) {

            status = "Sent";
            statusClass = "sent";

        } else if (lead.emailGenerated) {

            status = "Generated";
            statusClass = "generated";

        }

        table += `
            <tr id="row-${lead._id}">

                <td>${lead.name || ""}</td>

                <td>${lead.company || ""}</td>

                <td>${lead.email || ""}</td>

                <td>${lead.industry || ""}</td>

                <td>${lead.employees || ""}</td>

                <td>

                    <span
                        id="status-${lead._id}"
                        class="status ${statusClass}">
                        ${status}
                    </span>

                </td>

                <td>

                    <button
                        onclick="generateEmailById('${lead._id}')">
                        Generate Email
                    </button>

                    <button
                        onclick="editLeadById('${lead._id}')">
                        Edit
                    </button>

                    <button
                        onclick="deleteLead('${lead._id}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;
    }

    table += "</table>";

    leadsContainer.innerHTML = table;

}


// ===============================
// GENERATE EMAIL BY ID
// ===============================

function generateEmailById(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (lead) {

        generateEmail(lead);

    }

}


// ===============================
// EDIT LEAD BY ID
// ===============================

function editLeadById(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (lead) {

        editLead(lead);

    }

}


// ===============================
// CSV UPLOAD
// ===============================

const uploadBtn =
    document.getElementById("uploadBtn");

const csvFile =
    document.getElementById("csvFile");

const sendBtn =
    document.getElementById("sendBtn");


if (uploadBtn && csvFile) {

    uploadBtn.addEventListener("click", () => {

        csvFile.click();

    });


    csvFile.addEventListener("change", async () => {

        const file = csvFile.files[0];

        if (!file) return;

        try {

            const formData = new FormData();

            formData.append("csvFile", file);

            const response = await fetch("/upload", {

                method: "POST",

                body: formData

            });

            if (!response.ok) {

                throw new Error("Upload failed");

            }

            const result = await response.json();

            console.log("Uploaded leads:", result);

            await loadLeadsFromDatabase();

            await loadAnalytics();

            await loadActivity();

            alert("✅ CSV uploaded successfully");

        } catch (error) {

            console.error("❌ Upload Error:", error);

            alert("❌ Failed to upload CSV");

        }

    });

}


// ===============================
// GENERATE EMAIL
// ===============================

async function generateEmail(lead) {

    try {

        currentLead = lead;

        const response = await fetch("/generate-email", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(lead)

        });

        const result = await response.json();

        console.log(
            "Generate Email Response:",
            result
        );

        if (!response.ok || !result.success) {

            alert("❌ Failed to generate email");

            return;

        }

        currentEmail = result.email;

        const preview =
            document.getElementById("emailPreview");

        if (preview) {

            preview.textContent = currentEmail;

        }

        await loadLeadsFromDatabase();

        await loadAnalytics();

        if (sendBtn) {

            sendBtn.style.display = "block";

        }

    } catch (error) {

        console.error(
            "❌ Generate Email Error:",
            error
        );

        alert(
            "❌ Something went wrong while generating the email"
        );

    }

}


// ===============================
// SEND EMAIL
// ===============================

if (sendBtn) {

    sendBtn.addEventListener("click", async () => {

        if (!currentLead) {

            alert("Generate an email first.");

            return;

        }

        try {

            const response = await fetch("/send-email", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: currentLead.email,

                    subject:
                        `Helping ${currentLead.company} Grow with AI`,

                    body: currentEmail

                })

            });

            const result =
                await response.json();

            if (result.success) {

                alert("✅ Email Sent Successfully!");

                currentLead = null;

                currentEmail = "";

                document.getElementById(
                    "emailPreview"
                ).textContent = "";

                sendBtn.style.display = "none";

                await loadLeadsFromDatabase();

                await loadAnalytics();

                await loadActivity();

            } else {

                alert("❌ Failed to send email.");

            }

        } catch (error) {

            console.error(
                "❌ Send Email Error:",
                error
            );

            alert("❌ Something went wrong while sending.");

        }

    });

}


// ===============================
// RECENT ACTIVITY
// ===============================

async function loadActivity() {

    try {

        const response =
            await fetch("/recent-activity");

        const data =
            await response.json();

        const container =
            document.getElementById(
                "activityContainer"
            );

        if (!container) return;

        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `

                <div class="activity-item">

                    <i class="fa-solid fa-paper-plane"></i>

                    ${item.name}
                    (${item.company})
                    - ${item.status}

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "❌ Activity Error:",
            error
        );

    }

}


// ===============================
// ANALYTICS
// ===============================

async function loadAnalytics() {

    try {

        const response =
            await fetch("/analytics-data");

        const data =
            await response.json();

        document.getElementById(
            "totalLeads"
        ).textContent = data.total;

        document.getElementById(
            "generatedEmails"
        ).textContent = data.generated;

        document.getElementById(
            "sentEmails"
        ).textContent = data.sent;

        generatedCount = data.generated;

        sentCount = data.sent;

    } catch (error) {

        console.error(
            "❌ Analytics Error:",
            error
        );

    }

}


// ===============================
// DELETE LEAD
// ===============================

async function deleteLead(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `/leads/${id}`,
            {
                method: "DELETE"
            }
        );

        const result =
            await response.json();

        if (result.success) {

            alert(
                "✅ Lead deleted successfully"
            );

            await loadLeadsFromDatabase();

            await loadAnalytics();

        } else {

            alert(
                "❌ Failed to delete lead"
            );

        }

    } catch (error) {

        console.error(
            "❌ Delete Lead Error:",
            error
        );

        alert(
            "❌ Something went wrong"
        );

    }

}


// ===============================
// EDIT LEAD
// ===============================

async function editLead(lead) {

    document.getElementById(
        "editLeadId"
    ).value = lead._id;

    document.getElementById(
        "editName"
    ).value = lead.name || "";

    document.getElementById(
        "editCompany"
    ).value = lead.company || "";

    document.getElementById(
        "editEmail"
    ).value = lead.email || "";

    document.getElementById(
        "editIndustry"
    ).value = lead.industry || "";

    document.getElementById(
        "editEmployees"
    ).value = lead.employees || "";

    document.getElementById(
        "editModal"
    ).style.display = "block";

}


// ===============================
// CLOSE EDIT MODAL
// ===============================

function closeEditModal() {

    document.getElementById(
        "editModal"
    ).style.display = "none";

}


// ===============================
// SAVE EDITED LEAD
// ===============================

async function saveEditedLead() {

    const id =
        document.getElementById(
            "editLeadId"
        ).value;

    const updatedData = {

        name:
            document.getElementById(
                "editName"
            ).value,

        company:
            document.getElementById(
                "editCompany"
            ).value,

        email:
            document.getElementById(
                "editEmail"
            ).value,

        industry:
            document.getElementById(
                "editIndustry"
            ).value,

        employees:
            document.getElementById(
                "editEmployees"
            ).value

    };

    try {

        const response =
            await fetch(`/leads/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(updatedData)

            });

        const result =
            await response.json();

        if (result.success) {

            alert(
                "✅ Lead updated successfully"
            );

            closeEditModal();

            await loadLeadsFromDatabase();

        } else {

            alert(
                "❌ Failed to update lead"
            );

        }

    } catch (error) {

        console.error(
            "❌ Update Lead Error:",
            error
        );

        alert(
            "❌ Something went wrong"
        );

    }

}


// ===============================
// START APPLICATION
// ===============================

loadLeadsFromDatabase();

loadActivity();

loadAnalytics();