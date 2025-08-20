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

  const stateSelect = document.getElementById("stateOfOrigin");
  const lgaWrap = document.getElementById("lgaWrap");
  const lgaInput = document.getElementById("lga");

  const dobInput = document.getElementById("dob");
  const ageInput = document.getElementById("age");

  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");

  const previewModal = document.getElementById("previewModal");
  const closePreview = document.getElementById("closePreview");
  const previewBtn = document.getElementById("previewBtn");
  const printBtn = document.getElementById("printPdf");
  const submitFinal = document.getElementById("submitFinal");
  const previewContent = document.getElementById("previewContent");

  let statesLgas = {}; // Will load from external JSON

  // 🔹 Load states & LGAs from external file (states.json)
  fetch("states.json")
    .then(res => res.json())
    .then(data => {
      statesLgas = data;

      // Populate states dropdown
      Object.keys(statesLgas).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading states.json:", err));

  // 🔹 Show/Hide LGAs based on state
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

  // 🔹 Step navigation
  function showStep(index) {
    sections.forEach((sec, i) => {
      sec.classList.toggle("active", i === index);
      progressBars[i].style.width = i <= index ? "100%" : "0%";
    });

    currentStep = index;

    // Hide back button on first step
    backBtns.forEach(btn => btn.classList.toggle("hidden", index === 0));

    // Hide next button on last step
    nextBtns.forEach(btn => btn.classList.toggle("hidden", index === sections.length - 1));

    // Show preview modal trigger only on last step
    previewBtn.classList.toggle("hidden", index !== sections.length - 1);
  }

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
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

  // 🔹 Preview Modal
  previewBtn.addEventListener("click", () => {
    previewModal.classList.add("show");
    previewContent.innerHTML = new FormData(form)
      .entries()
      .map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`)
      .join("");
  });

  closePreview.addEventListener("click", () => {
    previewModal.classList.remove("show");
  });

  // 🔹 Dark Mode Toggle
  document.getElementById("themeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });

  // 🔹 Age calculation
  dobInput.addEventListener("change", () => {
    const dob = new Date(dobInput.value);
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    ageInput.value = age >= 0 ? age : "";
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
});
