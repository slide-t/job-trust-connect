// =============================
// Multi-step Form Wizard
// =============================
let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const previewBtn = document.getElementById("previewBtn");
const submitBtn = document.getElementById("submitBtn");
const spinner = document.getElementById("spinner");
const progressCircles = document.querySelectorAll(".step-circle");
const previewContainer = document.getElementById("previewContainer");

// Show step
function showStep(n) {
  steps.forEach((step, i) => {
    step.style.display = i === n ? "block" : "none";
  });

  prevBtn.style.display = n === 0 ? "none" : "inline-block";
  nextBtn.style.display = n === steps.length - 1 ? "none" : "inline-block";
  previewBtn.style.display = n === steps.length - 1 ? "inline-block" : "none";
  submitBtn.style.display = n === steps.length - 1 ? "inline-block" : "none";

  updateProgress(n);
}

// Validate fields
function validateStep(n) {
  const inputs = steps[n].querySelectorAll("input, select, textarea");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

// Update progress
function updateProgress(n) {
  progressCircles.forEach((circle, i) => {
    circle.classList.toggle("active", i <= n);
  });
}

// Collect form data
function collectData() {
  const data = {};
  document.querySelectorAll("input, select, textarea").forEach(inp => {
    data[inp.name] = inp.value;
  });
  return data;
}

// Fill preview page
function showPreview() {
  const data = collectData();
  previewContainer.innerHTML = `
    <h3>Preview Your Details</h3>
    <ul>
      ${Object.keys(data).map(key => `<li><strong>${key}:</strong> ${data[key]}</li>`).join("")}
    </ul>
  `;
}

// Submit form
function submitForm() {
  if (!validateStep(currentStep)) return;

  spinner.style.display = "inline-block";
  const formData = collectData();

  // Send to SheetDB or API
  fetch("https://sheetdb.io/api/v1/YOUR_SHEET_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: formData })
  })
    .then(res => res.json())
    .then(res => {
      spinner.style.display = "none";
      alert("Form submitted successfully!");
      console.log(res);
    })
    .catch(err => {
      spinner.style.display = "none";
      alert("Submission failed!");
      console.error(err);
    });
}

// Event Listeners
nextBtn.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  currentStep++;
  if (currentStep >= steps.length) currentStep = steps.length - 1;
  showStep(currentStep);
});

prevBtn.addEventListener("click", () => {
  currentStep--;
  if (currentStep < 0) currentStep = 0;
  showStep(currentStep);
});

previewBtn.addEventListener("click", showPreview);
submitBtn.addEventListener("click", submitForm);

// Init
showStep(currentStep);

// =============================
// State → LGA JSON Integration
// =============================
fetch("job-applicationform.json")
  .then(res => res.json())
  .then(data => {
    const stateSelect = document.getElementById("state");
    const lgaSelect = document.getElementById("lga");

    data.states.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state.name;
      opt.textContent = state.name;
      stateSelect.appendChild(opt);
    });

    stateSelect.addEventListener("change", () => {
      lgaSelect.innerHTML = "<option value=''>Select LGA</option>";
      const selected = data.states.find(s => s.name === stateSelect.value);
      if (selected) {
        selected.lgas.forEach(lga => {
          const opt = document.createElement("option");
          opt.value = lga;
          opt.textContent = lga;
          lgaSelect.appendChild(opt);
        });
      }
    });
  });
