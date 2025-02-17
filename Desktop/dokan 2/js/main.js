$(document).ready(function(){
    $('.slickSlider').slick({
        rtl: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        isArabic: true,
        autoplay: true,
        autoplaySpeed: 1000,

        responsive: [
            {
            breakpoint: 1024,
            settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});








const showToast = (message, isError = false) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      style: {
        background: isError ? "#ef4444" : "#22c55e",
        direction: "rtl"
      }
    }).showToast();
  };
  
  // Form validation rules
  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'الرجاء إدخال الاسم';
    } else if (!/^[\u0600-\u06FF\s\w]+$/.test(formData.name)) {
      errors.name = 'الرجاء إدخال اسم صحيح';
    }
    
   // phone validation (numbers only, length between 8-15 digits)
    const numberRegex = /^\d+$/;
    if (!formData.phone.trim()) {
      errors.phone = 'الرجاء إدخال رقم الجوال';
    } else if (!numberRegex.test(formData.phone)) {
      errors.phone = 'الرجاء إدخال أرقام فقط';
    } else if (formData.phone.length < 8 || formData.phone.length > 15) {
      errors.phone = 'رقم الجوال يجب أن يكون بين 8 و 15 رقم';
    }
    

    
    return errors;
  };
  
  // Create error message elements
  const createErrorElement = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    return errorDiv;
  };
  
  // Remove existing error messages
  const removeErrorMessages = () => {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
  };
  
  // Display error messages
  const showErrors = (errors) => {
    removeErrorMessages();
    Object.keys(errors).forEach(fieldName => {
      const input = document.getElementById(fieldName);
      const errorElement = createErrorElement(errors[fieldName]);
      input.parentNode.appendChild(errorElement);
      input.classList.add('border-red-500');
      
      // Show toast for first error
      if (Object.keys(errors)[0] === fieldName) {
        showToast(errors[fieldName], true);
      }
    });
  };
  
  // Remove error styling
  const removeErrorStyles = () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('border-red-500'));
  };
  
  // Google Sheets submission with loading state
  const submitToGoogleSheets = async (formData) => {
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyvzfnSCyWZTwsI6GyWMOgeS3IwrK3TVyd2Oox2YpDyDrevC3EVI8E3AhBxxOKW5gan/exec';
    
    // Show sending toast
    showToast('جاري إرسال البيانات...');
    
    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      // Show success toast
      showToast('تم التسجيل بنجاح!');
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error toast
      showToast('حدث خطأ في التسجيل. الرجاء المحاولة مرة أخرى.', true);
      return false;
    }
  };
  
  // Form submission handler
  document.getElementById('form-submit').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      notes: document.getElementById('notes').value,
      timestamp: new Date().toISOString()
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    // Remove existing error styling
    removeErrorStyles();
    
    // If there are errors, show them and return
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'جاري التسجيل...';
    submitButton.disabled = true;
    
    // Submit to Google Sheets
    const success = await submitToGoogleSheets(formData);
    
    if (success) {
      // Reset form
      e.target.reset();
    }
    
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  });
      