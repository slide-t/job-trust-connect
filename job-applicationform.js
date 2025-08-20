// =============================
// Form Wizard Script
// =============================

// grab all steps
let currentStep = 0;
const steps = document.querySelectorAll(".form-step"); // use your .form-step divs
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const previewBtn = document.getElementById("previewBtn");
const submitBtn = document.getElementById("submitBtn");
const spinner = document.getElementById("spinner");

// progress circles (if you have them)
const progressCircles = document.querySelectorAll(".step-circle");

// show first step
function showStep(n) {
  steps.forEach((step, i) => {
    step.style.display = i === n ? "block" : "none";
  });

  // update buttons
  if (n === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline-block";
  }

  if (n === steps.length - 1) {
    nextBtn.style.display = "none";
    previewBtn.style.display = "inline-block";
    submitBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    previewBtn.style.display = "none";
    submitBtn.style.display = "none";
  }

  updateProgress(n);
}

// validate fields before moving next
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

// progress update
function updateProgress(n) {
  if (!progressCircles) return;
  progressCircles.forEach((circle, i) => {
    if (i <= n) {
      circle.classList.add("active");
    } else {
      circle.classList.remove("active");
    }
  });
}

// event listeners
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

previewBtn.addEventListener("click", () => {
  alert("Preview your details before submission!");
});

submitBtn.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;

  spinner.style.display = "inline-block";

  // collect data
  const formData = {};
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach(inp => {
    formData[inp.name] = inp.value;
  });

  console.log("Submitting form:", formData);

  // simulate submission
  setTimeout(() => {
    spinner.style.display = "none";
    alert("Form submitted successfully!");
  }, 2000);
});

// init
showStep(currentStep);
