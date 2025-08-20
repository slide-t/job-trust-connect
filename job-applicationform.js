// ===============================
// CONFIG
// ===============================
const SHEETDB_URL = "https://sheetdb.io/api/v1/YOUR_CODES_SHEET_ID"; // Replace
const EMAILJS_SERVICE_ID = "your_service_id"; // Replace
const EMAILJS_TEMPLATE_ID = "your_template_id"; // Replace
const EMAILJS_PUBLIC_KEY = "your_public_key"; // Replace

// ===============================
// FORM NAVIGATION
// ===============================
const form = document.getElementById("jobForm");
const sections = document.querySelectorAll(".form-section");
const progressBars = document.querySelectorAll(".progress .bar");
let currentStep = 0;

function showStep(index) {
  sections.forEach((sec, i) => {
    if (i === index) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
    progressBars[i].style.width = i <= index ? "100%" : "0%";
  });
  currentStep = index;
}

// Next / Prev Buttons
form.addEventListener("click", (e) => {
  if (e.target.classList.contains("next")) {
    if (form.checkValidity()) {
      if (currentStep < sections.length - 1) {
        showStep(currentStep + 1);
      }
    } else {
      form.reportValidity();
    }
  }
  if (e.target.classList.contains("prev")) {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  }
});

// ===============================
// STATE & LGA (External JSON)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof statesAndLgas !== "undefined") {
    const stateSelect = document.getElementById("state");
    const lgaSelect = document.getElementById("lga");

    // Populate States
    Object.keys(statesAndLgas).forEach((state) => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });

    // Populate LGAs on state change
    stateSelect.addEventListener("change", () => {
      lgaSelect.innerHTML = "<option value=''>-- Select LGA --</option>";
      const selected = stateSelect.value;
      if (statesAndLgas[selected]) {
        statesAndLgas[selected].forEach((lga) => {
          const opt = document.createElement("option");
          opt.value = lga;
          opt.textContent = lga;
          lgaSelect.appendChild(opt);
        });
      }
    });
  }
});

// ===============================
// PHOTO PREVIEW
// ===============================
document.getElementById("photo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById("photoPreview").src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ===============================
// PREVIEW MODAL
// ===============================
const previewModal = document.getElementById("previewModal");
const previewContent = document.getElementById("previewContent");

document.getElementById("openPreview").addEventListener("click", () => {
  previewContent.innerHTML = `
    <p><strong>Name:</strong> ${form.fullname.value}</p>
    <p><strong>Email:</strong> ${form.email.value}</p>
    <p><strong>Phone:</strong> ${form.phone.value}</p>
    <p><strong>State:</strong> ${form.state.value}</p>
    <p><strong>LGA:</strong> ${form.lga.value}</p>
    <p><strong>Address:</strong> ${form.address.value}</p>
    <p><strong>Photo:</strong><br><img src="${document.getElementById("photoPreview").src}" width="120"/></p>
  `;
  previewModal.classList.add("show");
});

document.getElementById("closePreview").addEventListener("click", () => {
  previewModal.classList.remove("show");
});

// ===============================
// SUBMIT FORM (SheetDB + EmailJS)
// ===============================
document.getElementById("submitFinal").addEventListener("click", async () => {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = {
    fullname: form.fullname.value,
    email: form.email.value,
    phone: form.phone.value,
    state: form.state.value,
    lga: form.lga.value,
    address: form.address.value,
    photo: document.getElementById("photoPreview").src,
  };

  try {
    // Submit to SheetDB
    await fetch(SHEETDB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [formData] }),
    });

    // Send confirmation Email
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);

    alert("Application submitted successfully!");
    previewModal.classList.remove("show");
    form.reset();
    showStep(0);
    document.getElementById("photoPreview").src = "";
  } catch (err) {
    console.error(err);
    alert("Error submitting application. Try again.");
  }
});

// ===============================
// PDF EXPORT
// ===============================
document.getElementById("printPdf").addEventListener("click", () => {
  window.print(); // simple version; can replace with html2pdf/jsPDF if needed
});

// ===============================
// DARK / LIGHT TOGGLE
// ===============================
const themeToggle = document.getElementById("themeToggle");
document.body.classList.add("dark"); // default dark

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
});
