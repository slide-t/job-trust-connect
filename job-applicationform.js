// app.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appForm");
  const sections = document.querySelectorAll(".form-section");
  const progressBars = document.querySelectorAll(".step .bar");
  const totalSteps = sections.length;

  let currentStep = 0;

  // Navigation Buttons
  const nextBtns = document.querySelectorAll("[id^=nextBtn]");
  const backBtns = document.querySelectorAll("[id^=backBtn]");

  // Inputs
  const stateSelect = document.getElementById("stateOfOrigin");
  const lgaWrap = document.getElementById("lgaWrap");
  const lgaInput = document.getElementById("lga");
  const dobInput = document.getElementById("dob");
  const ageInput = document.getElementById("age");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");

  // Preview modal
  const previewModal = document.getElementById("previewModal");
  const closePreview = document.getElementById("closePreview");
  const previewBtn = document.getElementById("previewBtn");
  const printBtn = document.getElementById("printPdf");
  const submitFinal = document.getElementById("submitFinal");
  const previewContent = document.getElementById("previewContent");

  let statesLgas = {}; // external JSON data

  // 🔹 Load states & LGAs from external file
  fetch("states.json")
    .then(res => res.json())
    .then(data => {
      statesLgas = data;
      Object.keys(statesLgas).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading states.json:", err));

  // 🔹 Populate LGAs on state change
  stateSelect.addEventListener("change", () => {
    const lgas = statesLgas[stateSelect.value];
    if (lgas) {
      lgaWrap.classList.remove("hidden");
      lgaInput.innerHTML = '<option value="">Select LGA</option>';
      lgas.forEach(lga => {
        const option = document.createElement("option");
        option.value = lga;
        option.textContent = lga;
        lgaInput.appendChild(option);
      });
    } else {
      lgaWrap.classList.add("hidden");
      lgaInput.innerHTML = "";
    }
  });

  // 🔹 Step navigation + validation
  function validateStep(stepIndex) {
    const currentSection = sections[stepIndex];
    const inputs = currentSection.querySelectorAll("input, select, textarea");

    for (let input of inputs) {
      if (!input.checkValidity() || (input.type === "file" && input.files.length === 0)) {
        alert(`Please fill out the field: ${input.name || input.id}`);
        input.focus();
        return false;
      }
    }
    return true;
  }

  function showStep(index) {
    sections.forEach((sec, i) => {
      sec.classList.toggle("active", i === index);
      progressBars[i].style.width = i <= index ? "100%" : "0%";
    });

    currentStep = index;

    // back/next button visibility
    backBtns.forEach(btn => btn.classList.toggle("hidden", index === 0));
    nextBtns.forEach(btn => btn.classList.toggle("hidden", index === totalSteps - 1));

    // Preview button only at last step
    previewBtn.classList.toggle("hidden", index !== totalSteps - 1);
  }

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps - 1) {
          currentStep++;
          showStep(currentStep);
        }
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // 🔹 Preview modal
  previewBtn.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      previewModal.classList.add("show");
      const entries = [...new FormData(form).entries()];
      previewContent.innerHTML = entries
        .map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`)
        .join("");
    }
  });

  closePreview.addEventListener("click", () => {
    previewModal.classList.remove("show");
  });

  // 🔹 Age calculation
  dobInput.addEventListener("change", () => {
    const dob = new Date(dobInput.value);
    if (!isNaN(dob)) {
      const diff = Date.now() - dob.getTime();
      const age = new Date(diff).getUTCFullYear() - 1970;
      ageInput.value = age >= 0 ? age : "";
    }
  });

  // 🔹 Photo preview
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // 🔹 Dark mode
  document.getElementById("themeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });

  // 🔹 Start at first step
  showStep(0);
});
