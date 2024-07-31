

document.addEventListener('DOMContentLoaded', () => {
    const addUserButton = document.getElementById('addUserButton');
    const addUserModal = document.getElementById('addUserModal');
    const closeModal = document.getElementsByClassName('close')[0];
    
    addUserButton.addEventListener('click', () => {
      addUserModal.style.display = 'block';
    });
  
    closeModal.addEventListener('click', () => {
      addUserModal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == addUserModal) {
        addUserModal.style.display = 'none';
      }
    });
  
    const editButtons = document.querySelectorAll('.editButton');
    const submitButtons = document.querySelectorAll('.submitButton');
    const cancelButtons = document.querySelectorAll('.cancelButton');
    const deleteButtons = document.querySelectorAll('.deleteButton');
  
    editButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const row = button.closest('tr');
        const inputs = row.querySelectorAll('input, select');
        const initialValues = {};
  
        // Store initial values of the inputs
        inputs.forEach(input => {
          initialValues[input.name] = input.value;
        });
  
        const isFormChanged = () => {
          return Array.from(inputs).some(input => input.value !== initialValues[input.name]);
        };
  
        const toggleSubmitButton = () => {
          submitButtons[index].disabled = !isFormChanged();
        };
  
        inputs.forEach(input => {
          input.disabled = false;
          input.addEventListener('input', toggleSubmitButton);
        });
  
        submitButtons[index].style.display = 'inline-block';
        submitButtons[index].disabled = true; // Initially disabled until form changes
        cancelButtons[index].style.display = 'inline-block';
        button.style.display = 'none';
        deleteButtons[index].style.display = 'none';
  
        cancelButtons[index].addEventListener('click', () => {
          inputs.forEach(input => {
            input.value = initialValues[input.name];
            input.disabled = true;
            input.removeEventListener('input', toggleSubmitButton); // Remove event listener
          });
          submitButtons[index].style.display = 'none';
          editButtons[index].style.display = 'inline-block';
          cancelButtons[index].style.display = 'none';
          deleteButtons[index].style.display = 'inline-block';
        });
      });
    });
  
    deleteButtons.forEach((button, index) => {
      button.addEventListener('click', async function() {
        const row = button.closest('tr');
        const userId = row.dataset.id;
  
        if (confirm('Are you sure you want to delete this user?')) {
          await fetch(`/users-management/${userId}/delete`, {
            method: 'POST'
          });
  
          row.remove();
        }
      });
    });
  });
  