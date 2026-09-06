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
                <th>AI Score</th>
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

        // ===============================
        // AI SCORE DISPLAY
        // ===============================

        let scoreDisplay = "Not Scored";

        if (
            lead.leadScore !== null &&
            lead.leadScore !== undefined
        ) {

            let scoreClass = "score-low";

            if (lead.leadScore >= 70) {
                scoreClass = "score-high";
            } else if (lead.leadScore >= 40) {
                scoreClass = "score-medium";
            }

            scoreDisplay = `
                <span class="ai-score ${scoreClass}">
                    ${lead.leadScore}/100
                    <span>•</span>
                    ${lead.leadPriority || ""}
                </span>
            `;
        }

        // ===============================
        // FOLLOW-UP BUTTON
        // ===============================

        let followUpButton = "";

        if (lead.emailGenerated && lead.generatedEmail) {

            followUpButton = `
                <button
                    class="btn-followup"
                    onclick="generateFollowUpById('${lead._id}')">
                    <i class="fa-solid fa-reply"></i>
                    Follow-Up
                </button>
            `;
        }

        // ===============================
        // TABLE ROW
        // ===============================

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

                <!-- AI SCORE -->

                <td>

                    ${scoreDisplay}

                    ${
                        lead.leadScoreReasons &&
                        lead.leadScoreReasons.length
                            ? `
                                <button
                                    class="score-reason-btn"
                                    onclick="showScoreReasons('${lead._id}')">
                                    Why?
                                </button>
                              `
                            : ""
                    }

                </td>

                <!-- ACTIONS -->

                <td class="action-cell">

                    <div class="action-buttons">

                        <button
                            class="btn-generate"
                            onclick="generateEmailById('${lead._id}')">
                            <i class="fa-solid fa-envelope"></i>
                            Generate
                        </button>

                        <button
                            class="btn-score"
                            onclick="scoreLeadById('${lead._id}')">
                            <i class="fa-solid fa-chart-simple"></i>
                            AI Score
                        </button>

                        <button
                            class="btn-outreach"
                            onclick="getOutreachRecommendation('${lead._id}')">
                            <i class="fa-solid fa-lightbulb"></i>
                            Outreach
                        </button>

                        ${followUpButton}

                        <button
                            class="btn-edit"
                            onclick="editLeadById('${lead._id}')">
                            <i class="fa-solid fa-pen"></i>
                            Edit
                        </button>

                        <button
                            class="btn-delete"
                            onclick="deleteLead('${lead._id}')">
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>

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

// ===============================
// AI LEAD SCORING
// ===============================

async function scoreLeadById(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (!lead) return;

    try {

        const response = await fetch("/score-lead", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(lead)

        });

        const result = await response.json();

        console.log("Lead Score Response:", result);

        if (!response.ok || !result.success) {

            alert("❌ Failed to score lead");

            return;
        }

        alert(
            `AI Lead Score: ${result.score}/100\n` +
            `Priority: ${result.priority}\n\n` +
            `Why:\n${result.reasons.join("\n")}`
        );

        await loadLeadsFromDatabase();

    } catch (error) {

        console.error("❌ Lead Scoring Error:", error);

        alert("❌ Something went wrong while scoring the lead");
    }
}

// ===============================
// SMART OUTREACH RECOMMENDATION
// ===============================

async function getOutreachRecommendation(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (!lead) return;

    try {

        const response = await fetch(
            "/outreach-recommendation",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(lead)
            }
        );

        const result = await response.json();

        console.log(
            "Outreach Recommendation:",
            result
        );

        if (!response.ok || !result.success) {

            alert("❌ Failed to generate recommendation");

            return;
        }

        const recommendation =
            result.recommendation;

        document.getElementById("recommendationChannel").textContent =
    recommendation.recommendedChannel || "—";

document.getElementById("recommendationTiming").textContent =
    recommendation.recommendedTiming || "—";

document.getElementById("recommendationAction").textContent =
    recommendation.suggestedAction || "—";

document.getElementById("recommendationReason").textContent =
    recommendation.reason || "—";

document.getElementById("outreachModal").style.display = "flex";

    } catch (error) {

        console.error(
            "❌ Outreach Recommendation Error:",
            error
        );

        alert(
            "❌ Something went wrong while generating the recommendation."
        );
    }
}

// ===============================
// CLOSE OUTREACH MODAL
// ===============================

function closeOutreachModal() {

    const modal =
        document.getElementById("outreachModal");

    if (modal) {
        modal.style.display = "none";
    }
}
document.addEventListener("click", (event) => {

    const modal =
        document.getElementById("outreachModal");

    if (
        modal &&
        event.target === modal
    ) {
        closeOutreachModal();
    }

});
// ===============================
// SHOW AI SCORE REASONS
// ===============================

// ===============================
// SHOW AI SCORE REASONS
// ===============================

function showScoreReasons(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (!lead) {
        return;
    }

    // Set score
    document.getElementById("modalLeadScore").textContent =
        lead.leadScore ?? "—";

    // Set priority
    const priorityElement =
        document.getElementById("modalLeadPriority");

    priorityElement.textContent =
        lead.leadPriority || "—";

    // Set priority styling
    priorityElement.className = "modal-priority";

    if (lead.leadPriority === "High") {
        priorityElement.classList.add("score-high");
    } else if (lead.leadPriority === "Medium") {
        priorityElement.classList.add("score-medium");
    } else if (lead.leadPriority === "Low") {
        priorityElement.classList.add("score-low");
    }

    // Display reasons
    const reasonsContainer =
        document.getElementById("modalScoreReasons");

    if (
        lead.leadScoreReasons &&
        lead.leadScoreReasons.length
    ) {

        reasonsContainer.innerHTML =
            lead.leadScoreReasons
                .map(reason => `
                    <div class="score-reason-item">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>${reason}</span>
                    </div>
                `)
                .join("");

    } else {

        reasonsContainer.innerHTML = `
            <div class="score-reason-item">
                <i class="fa-solid fa-circle-info"></i>
                <span>
                    No detailed scoring explanation is available.
                </span>
            </div>
        `;
    }

    // Open modal
    document.getElementById("scoreModal").style.display =
        "flex";
}

// ===============================
// CLOSE AI SCORE MODAL
// ===============================

function closeScoreModal() {

    const modal =
        document.getElementById("scoreModal");

    if (modal) {
        modal.style.display = "none";
    }
}

document.addEventListener("click", (event) => {

    const modal =
        document.getElementById("scoreModal");

    if (
        modal &&
        event.target === modal
    ) {
        closeScoreModal();
    }

});
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
// ===============================
// GENERATE AI FOLLOW-UP
// ===============================

async function generateFollowUpById(id) {

    const lead = currentLeads.find(
        lead => lead._id === id
    );

    if (!lead) {
        alert("Lead not found");
        return;
    }

    // Make sure an initial email exists
    if (!lead.generatedEmail) {

        alert(
            "Please generate the initial email first."
        );

        return;
    }

    try {

        const response = await fetch(
            "/generate-follow-up",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    lead: lead,
                    previousEmail: lead.generatedEmail
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to generate follow-up"
            );

            return;
        }

        // Update local lead data
        lead.followUpGenerated = true;
        lead.followUpEmail = data.followUp;

        // Show generated follow-up
        document.getElementById("followUpRecipient").textContent =
    lead.email || "—";

document.getElementById("followUpCompany").textContent =
    lead.company || "—";

document.getElementById("followUpContent").value =
    data.followUp;

document.getElementById("followUpModal").style.display =
    "flex";

        console.log(
            "✅ Follow-up generated:",
            data.followUp
        );

    } catch (error) {

        console.error(
            "❌ Follow-Up Error:",
            error
        );

        alert(
            "Failed to generate follow-up"
        );
    }
}
// ===============================
// CLOSE FOLLOW-UP MODAL
// ===============================

function closeFollowUpModal() {

    const modal =
        document.getElementById("followUpModal");

    if (modal) {
        modal.style.display = "none";
    }
}
document.addEventListener("click", (event) => {

    const modal =
        document.getElementById("followUpModal");

    if (
        modal &&
        event.target === modal
    ) {
        closeFollowUpModal();
    }

});
// ===============================
// COPY FOLLOW-UP
// ===============================

async function copyFollowUp() {

    const content =
        document.getElementById("followUpContent").value;

    if (!content) {
        return;
    }

    try {

        await navigator.clipboard.writeText(content);

        alert("Follow-up copied to clipboard!");

    } catch (error) {

        console.error("❌ Copy Error:", error);

        alert("Could not copy follow-up.");
    }
}
// ===============================
// SEND FOLLOW-UP EMAIL
// ===============================

async function sendFollowUp() {

    const email =
        document.getElementById("followUpRecipient").textContent;

    const body =
        document.getElementById("followUpContent").value;

    if (!email || !body) {
        alert("Follow-up email details are missing.");
        return;
    }

    try {

        const response = await fetch("/send-email", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                subject: "Following up",
                body: body
            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to send follow-up"
            );

            return;
        }

        alert("Follow-up sent successfully!");

        closeFollowUpModal();

        // Refresh the dashboard data
        if (typeof loadLeads === "function") {
            loadLeads();
        }

    } catch (error) {

        console.error(
            "❌ Send Follow-Up Error:",
            error
        );

        alert("Failed to send follow-up.");
    }
}