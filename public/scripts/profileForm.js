

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('editButton');
    const submitButton = document.getElementById('submitButton');
    const resetButton = document.getElementById('resetButton');
    const inputs = document.querySelectorAll('#profileForm input');
    const initialValues = {};
  
    inputs.forEach(input => {
      initialValues[input.id] = input.value;
    });
  
    const isFormChanged = () => {
      return Array.from(inputs).some(input => input.value !== initialValues[input.id]);
    };
  
    const toggleSubmitButton = () => {
      submitButton.disabled = !isFormChanged();
    };
  
    editButton.addEventListener('click', () => {
      inputs.forEach(input => {
        if (input.id !== 'user_type') {
          input.disabled = false;
        }
      });
      submitButton.disabled = true;
      resetButton.disabled = false;
      editButton.disabled = true;
    });
  
    resetButton.addEventListener('click', () => {
      inputs.forEach(input => {
        input.value = initialValues[input.id];
        input.disabled = true;
      });
      submitButton.disabled = true;
      resetButton.disabled = true;
      editButton.disabled = false;
    });
  
    inputs.forEach(input => {
      input.addEventListener('input', toggleSubmitButton);
    });
  
    document.getElementById('profileForm').addEventListener('submit', () => {
      editButton.disabled = false;
      submitButton.disabled = true;
      resetButton.disabled = true;
    });
  });
  