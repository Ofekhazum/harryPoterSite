// document.addEventListener('DOMContentLoaded', async () => {
//     const countryInput = document.getElementById('country');
//     const phoneInput = document.getElementById('phone');
//     const datalist = document.getElementById('countryList');

//     try {
//         const response = await fetch('/data/countries.json');
//         const countryList = await response.json();

//         const iti = window.intlTelInput(phoneInput, {
//             initialCountry: "auto",
//             geoIpLookup: function(success, failure) {
//                 fetch('https://ipinfo.io/json?token=YOUR_TOKEN_HERE') // replace 'YOUR_TOKEN_HERE' with your ipinfo.io token
//                     .then(response => response.json())
//                     .then(data => success(data.country))
//                     .catch(() => success('us'));
//             },
//             utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
//         });

//         phoneInput.addEventListener('countrychange', function() {
//             const selectedCountryData = iti.getSelectedCountryData();
//             const countryName = countryList.find(country => selectedCountryData.name.includes(country));
//             if (countryName) {
//                 countryInput.value = countryName;
//             }
//         });

//         // Populate datalist for country input
//         countryList.forEach(country => {
//             const option = document.createElement('option');
//             option.value = country;
//             datalist.appendChild(option);
//         });

//         countryInput.addEventListener('input', function() {
//             const value = this.value.toLowerCase();
//             const filteredCountries = countryList.filter(country => country.toLowerCase().includes(value));
//             datalist.innerHTML = '';
//             filteredCountries.forEach(country => {
//                 const option = document.createElement('option');
//                 option.value = country;
//                 datalist.appendChild(option);
//             });
//         });
//     } catch (error) {
//         console.error('Error fetching country data:', error);
//     }
// });



document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    const form = event.target;
    if (!form.checkValidity()) {
        event.preventDefault();
        alert('Please fill out all required fields.');
    }
});

// Initialize intl-tel-input
const phoneInput = document.getElementById('phone');
const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: function(success, failure) {
        fetch('https://ipinfo.io/json?token=YOUR_TOKEN_HERE')
            .then(response => response.json())
            .then(data => success(data.country))
            .catch(() => success('us'));
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

// Fetch country list and populate datalist
fetch('/path/to/countries.json')
    .then(response => response.json())
    .then(data => {
        const countryList = document.getElementById('countryList');
        data.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            countryList.appendChild(option);
        });
    });

// Update country input based on phone input
phoneInput.addEventListener('countrychange', function() {
    const selectedCountryData = iti.getSelectedCountryData();
    document.getElementById('country').value = selectedCountryData.name;
});