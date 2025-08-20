let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const previewBtn = document.getElementById("previewBtn");
const submitBtn = document.getElementById("submitBtn");

showStep(currentStep);

function showStep(n) {
  formSteps.forEach(step => step.classList.remove("active"));
  formSteps[n].classList.add("active");

  progressSteps.forEach((p, idx) => {
    p.classList.remove("active");
    if (idx <= n) p.classList.add("active");
  });

  prevBtn.style.display = n === 0 ? "none" : "inline-block";
  nextBtn.style.display = n === formSteps.length - 1 ? "none" : "inline-block";
  previewBtn.style.display = n === formSteps.length - 1 ? "inline-block" : "none";
  submitBtn.style.display = n === formSteps.length - 1 ? "inline-block" : "none";
}

nextBtn.addEventListener("click", () => {
  if (currentStep < formSteps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

previewBtn.addEventListener("click", () => {
  const formData = new FormData(document.getElementById("regForm"));
  let html = "";
  formData.forEach((val, key) => {
    html += `<p><strong>${key}:</strong> ${val}</p>`;
  });
  document.getElementById("previewContent").innerHTML = html;
  document.getElementById("previewSection").style.display = "block";
});

submitBtn.addEventListener("click", () => {
  alert("Form submitted successfully!");
});

function downloadPDF() {
  window.print();
}

function goHome() {
  window.location.href = "index.html";
}

// Load States and LGAs
async function loadStates() {
  const response = await fetch("states-lgas.json");
  const data = await response.json();
  const stateSelect = document.getElementById("stateOrigin");
  const lgaSelect = document.getElementById("lgaOrigin");
  const lgaCol = document.getElementById("lgaCol");

  data.states.forEach(state => {
    let opt = document.createElement("option");
    opt.value = state.name;
    opt.textContent = state.name;
    stateSelect.appendChild(opt);
  });

  stateSelect.addEventListener("change", () => {
    lgaSelect.innerHTML = "";
    const selected = data.states.find(s => s.name === stateSelect.value);
    if (selected) {
      selected.lgas.forEach(lga => {
        let opt = document.createElement("option");
        opt.value = lga;
        opt.textContent = lga;
        lgaSelect.appendChild(opt);
      });
      lgaCol.style.display = "block";
    } else {
      lgaCol.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", loadStates);
