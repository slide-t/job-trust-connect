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
  const saveDraftBtn = document.getElementById("saveDraftBtn");

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

  // STATE & LGA JSON
  const statesLgas = {
    "Abia": ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],
    "FCT - Abuja": ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"]
    // Add all other states and LGAs here
  };

  // Show/Hide LGA based on state
  stateSelect.addEventListener("change", () => {
    const lgas = statesLgas[stateSelect.value];
    if(lgas){
      lgaWrap.classList.remove("hidden");
      lgaInput.innerHTML = "";
      lgaInput.setAttribute("list","lgaList");
      let datalist = document.getElementById("lgaList");
      if(!datalist){
        datalist = document.createElement("datalist");
        datalist.id = "lgaList";
        document.body.appendChild(datalist);
      }
      datalist.innerHTML = "";
      lgas.forEach(lga => {
        const option = document.createElement("option");
        option.value = lga;
        datalist.appendChild(option);
      });
    } else {
      lgaWrap.classList.add("hidden");
    }
  });

  // Age calculation
  dobInput.addEventListener("change", () => {
    const dob = new Date(dobInput.value);
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    ageInput.value = age >= 0 ? age : "";
  });

  // Photo preview
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = e => {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo" style="width:100%;height:100%;object-fit:cover"/>`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Show Step
  function showStep(index){
    sections.forEach((sec,i) => {
      sec.classList.toggle("active", i===index);
      progressBars[i].style.width = i<=index ? "100%" : "0%";
    });
    currentStep = index;
  }

  // Validation for required fields
  function validateStep(index){
    const currentSection = sections[index];
    let valid = true;
    const inputs = currentSection.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      if(input.hasAttribute("required") && !input.value.trim()){
        valid = false;
        const errDiv = document.getElementById(`err-${input.id}`);
        if(errDiv) errDiv.style.display = "block";
      } else {
        const errDiv = document.getElementById(`err-${input.id}`);
        if(errDiv) errDiv.style.display = "none";
      }
    });
    return valid;
  }

  // Next Buttons
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if(validateStep(currentStep)){
        if(currentStep < totalSteps - 1) showStep(currentStep+1);
      }
    });
  });

  // Back Buttons
  backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if(currentStep > 0) showStep(currentStep-1);
    });
  });

  // Preview
  previewBtn.addEventListener("click", () => {
    if(validateStep(currentStep)){
      previewModal.setAttribute("aria-hidden", "false");
      previewContent.innerHTML = "";
      const data = new FormData(form);
      for(const [key,value] of data.entries()){
        previewContent.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
      }
      // Photo preview
      if(photoInput.files[0]){
        const reader = new FileReader();
        reader.onload = e => {
          previewContent.innerHTML += `<p><strong>Photo:</strong><br><img src="${e.target.result}" style="width:100px;height:100px;object-fit:cover"/></p>`;
        };
        reader.readAsDataURL(photoInput.files[0]);
      }
    }
  });

  closePreview.addEventListener("click", () => previewModal.setAttribute("aria-hidden", "true"));

  // Print PDF
  printBtn.addEventListener("click", () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Application Preview</title></head><body>");
    printWindow.document.write(previewContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  });

  // Submit Final
  submitFinal.addEventListener("click", () => {
    alert("Application submitted successfully!");
    form.reset();
    showStep(0);
    previewModal.setAttribute("aria-hidden", "true");
  });

  // Initialize first step
  showStep(0);
});
