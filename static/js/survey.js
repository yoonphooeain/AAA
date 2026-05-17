document.addEventListener("DOMContentLoaded", () => {
  const appText = window.APP_TEXT || {};
  const form = document.getElementById("survey-form");
  const status = document.getElementById("form-status");
  const errorList = document.getElementById("form-errors");
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");

  if (!form) return;

  const requiredFields = Array.from(form.querySelectorAll("[required]"));

  function fieldLabel(field) {
    const label = field.closest("label");
    const labelText = label?.querySelector("span")?.textContent?.trim();
    return labelText || field.name || "Field";
  }

  function showErrors(errors) {
    if (!errorList) return;
    if (!errors.length) {
      errorList.hidden = true;
      errorList.innerHTML = "";
      return;
    }
    errorList.hidden = false;
    errorList.innerHTML = `
      <strong>${appText.validation_fix_form || "Please correct the highlighted fields before submitting."}</strong>
      <ul>${errors.map((item) => `<li>${item}</li>`).join("")}</ul>
    `;
  }

  function validateForm() {
    const errors = [];
    requiredFields.forEach((field) => {
      const value = String(field.value).trim();
      if (!value) {
        errors.push((appText.validation_required || "{field} is required.").replace("{field}", fieldLabel(field)));
        field.classList.add("field-invalid");
      } else {
        field.classList.remove("field-invalid");
      }
    });

    const ageField = form.querySelector('input[name="age"]');
    const ageValue = String(ageField?.value || "").trim();
    if (ageValue) {
      const parsedAge = Number(ageValue);
      if (!Number.isFinite(parsedAge)) {
        errors.push(appText.validation_age_number || "Age must be a valid number.");
        ageField.classList.add("field-invalid");
      } else if (parsedAge < 15 || parsedAge > 100) {
        errors.push(appText.validation_age_range || "Age must be between 15 and 100.");
        ageField.classList.add("field-invalid");
      } else {
        ageField.classList.remove("field-invalid");
      }
    } else if (ageField) {
      ageField.classList.remove("field-invalid");
    }

    const commentField = form.querySelector('textarea[name="comment"]');
    if (commentField && String(commentField.value).trim().length > 300) {
      errors.push(appText.validation_comment_length || "Comment should be 300 characters or fewer.");
      commentField.classList.add("field-invalid");
    } else if (commentField) {
      commentField.classList.remove("field-invalid");
    }

    showErrors(errors);
    return errors;
  }

  function updateProgress() {
    const completed = requiredFields.filter((field) => String(field.value).trim()).length;
    const total = requiredFields.length;
    const percent = total ? (completed / total) * 100 : 0;
    const template = appText.progress_required || "{completed} of {total} required fields completed";
    progressText.textContent = template.replace("{completed}", completed).replace("{total}", total);
    progressFill.style.width = `${percent}%`;
  }

  requiredFields.forEach((field) => {
    field.addEventListener("change", updateProgress);
    field.addEventListener("input", updateProgress);
    field.addEventListener("input", () => field.classList.remove("field-invalid"));
  });
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("field-invalid")) {
        validateForm();
      }
    });
  });
  updateProgress();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      status.textContent = appText.validation_fix_form || "Please correct the highlighted fields before submitting.";
      status.className = "form-status error";
      return;
    }
    status.textContent = appText.submitting_survey || "Submitting survey...";
    status.className = "form-status";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Failed to submit survey.");
      }

      const successPrefix = appText.submit_success || result.message || "Survey submitted successfully.";
      const currentResponses = appText.current_responses || "Current Responses";
      status.textContent = `${successPrefix} ${currentResponses}: ${result.analysis.total_responses}.`;
      status.classList.add("success");
      form.reset();
      showErrors([]);
      updateProgress();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("error");
    }
  });
});
