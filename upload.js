/**
 * ==============================================================================
 * CAMPUS BUDDY — NOTICE UPLOAD CONTROLLER (upload-notice.js)
 * ==============================================================================
 * Responsibilities:
 * 1. Manages file selection & drag-and-drop.
 * 2. Validates allowed formats (PDF, JPG, PNG) and file size (max 10MB).
 * 3. Keeps the native `File` object in memory ready for Firebase/backend.
 * 4. Hands off the File cleanly via `window.handleNoticeUpload(file, metadata)`.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("noticeFileInput");
  const filePreviewCard = document.getElementById("filePreviewCard");
  const fileBadge = document.getElementById("fileBadge");
  const fileNameEl = document.getElementById("fileName");
  const fileSizeEl = document.getElementById("fileSize");
  const btnChangeFile = document.getElementById("btnChangeFile");
  const btnRemoveFile = document.getElementById("btnRemoveFile");
  const errorAlert = document.getElementById("errorAlert");
  const errorMessage = document.getElementById("errorMessage");
  const btnAnalyze = document.getElementById("btnAnalyzeNotice");
  const analyzeSpinner = document.getElementById("analyzeSpinner");
  const btnText = document.getElementById("btnText");

  // State
  let currentFile = null;
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  // Helper: Format bytes into readable string
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Helper: Show error alert
  function showError(msg) {
    errorMessage.textContent = msg;
    errorAlert.style.display = "flex";
  }

  // Helper: Clear error alert
  function clearError() {
    errorAlert.style.display = "none";
  }

  // Validation function
  function validateFile(file) {
    clearError();

    if (!file) return false;

    // Type validation
    const isValidType = ALLOWED_TYPES.includes(file.type) || 
      /\.(pdf|jpe?g|png)$/i.test(file.name);

    if (!isValidType) {
      showError("Invalid file type. Please upload a PDF, PNG, or JPG document.");
      return false;
    }

    // Size validation (Max 10MB)
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      showError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }

    return true;
  }

  // Set selected file into UI state
  function setSelectedFile(file) {
    if (!validateFile(file)) {
      removeFile();
      return;
    }

    currentFile = file;

    // Display details
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = `${formatBytes(file.size)} • ${file.type || "Document"}`;

    // Badge styling
    if (file.type.includes("pdf") || file.name.endsWith(".pdf")) {
      fileBadge.textContent = "PDF";
      fileBadge.className = "file-badge badge-pdf";
    } else {
      fileBadge.textContent = "IMAGE";
      fileBadge.className = "file-badge badge-img";
    }

    dropZone.style.display = "none";
    filePreviewCard.style.display = "flex";
    btnAnalyze.disabled = false;
  }

  // Remove / reset file
  function removeFile() {
    currentFile = null;
    fileInput.value = "";
    filePreviewCard.style.display = "none";
    dropZone.style.display = "block";
    btnAnalyze.disabled = true;
    clearError();
  }

  // ---------------------------------------------------------
  // Event Listeners
  // ---------------------------------------------------------

  // Click dropzone to open native file browser
  dropZone.addEventListener("click", () => fileInput.click());

  // Input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  });

  // Change file button
  btnChangeFile.addEventListener("click", () => fileInput.click());

  // Remove file button
  btnRemoveFile.addEventListener("click", removeFile);

  // Drag and drop events
  ["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-active");
    });
  });

  ["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-active");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  });

  // ---------------------------------------------------------
  // Analyze Notice Button: Backend Hand-off Hook
  // ---------------------------------------------------------
  btnAnalyze.addEventListener("click", async () => {
    if (!currentFile) return;

    // Set UI loading state
    btnAnalyze.disabled = true;
    analyzeSpinner.style.display = "inline-block";
    btnText.textContent = "Analyzing Notice...";

    const filePayload = {
      file: currentFile,
      name: currentFile.name,
      size: currentFile.size,
      type: currentFile.type,
      uploadedAt: new Date().toISOString()
    };

    try {
      /**
       * FIREBASE / BACKEND INTEGRATION CONTRACT:
       * When your teammate connects Firebase Storage, they simply define:
       * window.handleNoticeUpload = async (fileObject, metadata) => { ... }
       */
      if (typeof window.handleNoticeUpload === "function") {
        await window.handleNoticeUpload(currentFile, filePayload);
      } else {
        // Mock processing delay for testing
        console.log("File ready for Firebase Storage upload:", filePayload);
        await new Promise(res => setTimeout(res, 1200));
        alert(`Notice "${currentFile.name}" selected! Ready for Firebase upload.`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      showError("Failed to upload notice. Please try again.");
    } finally {
      btnAnalyze.disabled = false;
      analyzeSpinner.style.display = "none";
      btnText.textContent = "✦ Analyze Notice";
    }
  });
});
