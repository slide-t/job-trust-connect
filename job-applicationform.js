// app.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appForm");
  const sections = document.querySelectorAll(".form-section");
  const progressBars = document.querySelectorAll(".step .bar");
  const totalSteps = sections.length;

  let currentStep = 0;
  let statesLgas = {};
  let photoBase64 = "";

  // Buttons
  const nextBtns = document.querySelectorAll("[id^=nextBtn]");
  const backBtns = document.querySelectorAll("[id^=backBtn]");
  const previewBtn = document.getElementById("previewBtn");
  const previewModal = document.getElementById("previewModal");
  const closePreview = document.getElementById("closePreview");
  const previewContent = document.getElementById("previewContent");
  const submitFinal = document.getElementById("submitFinal");

  // Inputs
  const stateSelect = document.getElementById("stateOfOrigin");
  const lgaWrap = document.getElementById("lgaWrap");
  const lgaInput = document.getElementById("lga");
  const dobInput = document.getElementById("dob");
  const ageInput = document.getElementById("age");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");

  // 🔹 Load states & LGAs from external JSON
  fetch("job-applicationform.json")
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
    .catch(err => console.error("Error loading job-applicationform.json:", err));

  // 🔹 Show LGAs dynamically
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

  // 🔹 Navigation
  function showStep(index) {
    sections.forEach((sec, i) => {
      sec.classList.toggle("active", i === index);
      progressBars[i].style.width = i <= index ? "100%" : "0%";
    });

    currentStep = index;
    backBtns.forEach(btn => btn.classList.toggle("hidden", index === 0));
    nextBtns.forEach(btn => btn.classList.toggle("hidden", index === totalSteps - 1));
    previewBtn.classList.toggle("hidden", index !== totalSteps - 1);
  }

 /* nextBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
      }
    })
  );*/

  backBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    })
  );
// 🔹 Validate required fields in current step
  function validateStep(index) {
    const section = sections[index];
    const inputs = section.querySelectorAll("input, select, textarea");
    let valid = true;

    inputs.forEach(input => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("error");
        valid = false;
      } else {
        input.classList.remove("error");
      }

      // Special case: radio/checkbox groups
      if ((input.type === "radio" || input.type === "checkbox") && input.required) {
        const group = section.querySelectorAll(`input[name="${input.name}"]`);
        const checked = Array.from(group).some(r => r.checked);
        if (!checked) {
          valid = false;
          group.forEach(r => r.classList.add("error"));
        } else {
          group.forEach(r => r.classList.remove("error"));
        }
      }
    });

    if (!valid) {
      alert("⚠️ Please complete all required fields before proceeding.");
    }

    return valid;
  }

  // 🔹 Update Next button logic
  nextBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      if (currentStep < totalSteps - 1) {
        if (validateStep(currentStep)) {   // ✅ check before moving forward
          currentStep++;
          showStep(currentStep);
        }
      }
    })
  );
  

  // 🔹 Preview Modal
  previewBtn.addEventListener("click", () => {
    previewModal.classList.add("show");
    const fd = new FormData(form);
    let html = "";
    fd.forEach((val, key) => {
      if (key !== "photo") {
        html += `<p><strong>${key}:</strong> ${val}</p>`;
      }
    });
    if (photoBase64) {
      html += `<p><strong>Photograph:</strong><br><img src="${photoBase64}" style="max-width:150px;border-radius:6px"/></p>`;
    }
    previewContent.innerHTML = html;
  });

  closePreview.addEventListener("click", () => {
    previewModal.classList.remove("show");
  });

  // 🔹 Dark Mode Toggle
  document.getElementById("themeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });

  // 🔹 Age auto-calc
  dobInput.addEventListener("change", () => {
    const dob = new Date(dobInput.value);
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    ageInput.value = age >= 0 ? age : "";
  });

  // 🔹 Photo preview & Base64 conversion
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        photoBase64 = e.target.result;
        photoPreview.src = photoBase64;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
// 🔹 Final submission → SheetDB + EmailJS
submitFinal.addEventListener("click", e => {
  e.preventDefault();

  const fd = new FormData(form);
  const data = {};
  fd.forEach((val, key) => {
    if (key === "photo") {
      data[key] = photoBase64;
    } else {
      data[key] = val;
    }
  });

  // ✅ Save to SheetDB
  fetch("https://sheetdb.io/api/v1/2d6wigbp84e9e", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [data] }),
  })
    .then(res => res.json())
    .then(() => {
      // ✅ Send via EmailJS
      emailjs
        .send("service_74g1ljg", "ejs-test-mail-service", data, "zJDixw4ygvB_riybX")
        .then(() => {
          alert("🎉 Application submitted successfully!");
          form.reset();
          previewModal.classList.remove("show");
          showStep(0); // reset to first step
        })
        .catch(err => {
          console.error("EmailJS error:", err);
          alert("⚠️ Error sending email. Please try again.");
        });
    })
    .catch(err => {
      console.error("SheetDB error:", err);
      alert("⚠️ Error submitting form. Please try again.");
    });
});

  
  
  // 🔹 Start at step 0
  showStep(0);
});
