// API key and base URL
const apiKey = "fca_live_6iDGk1qWK037MAWm8uYwWnWMJGMjwSpLCVb1Q9Sx";
const apiURL = "https://api.freecurrencyapi.com/v1/latest";

// Populate currency dropdown menus
const populateCurrencyDropdowns = async () => {
    try {
        // Fetch currency data from the API
        const response = await fetch(`${apiURL}?apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.data) {
            throw new Error("Unexpected API response format.");
        }

        // Extract the currency codes
        const currencyOptions = Object.keys(data.data);
        const fromCurrency = document.getElementById("fromCurrency");
        const toCurrency = document.getElementById("toCurrency");

        // Add each currency as an option in both menus
        currencyOptions.forEach((currency) => {
            const optionFrom = document.createElement("option");
            const optionTo = document.createElement("option");

            optionFrom.value = currency;
            optionTo.value = currency;
            optionFrom.textContent = currency;
            optionTo.textContent = currency;

            fromCurrency.appendChild(optionFrom);
            toCurrency.appendChild(optionTo);
        });

        // Set default currencies for the menus
        fromCurrency.value = "USD";
        toCurrency.value = "EUR";
    } catch (error) {
        console.error("Error fetching currency data: ", error);
        alert("Failed to load currency data. Please try again later.");
    }
};

// Initialize dropdowns
document.addEventListener("DOMContentLoaded", populateCurrencyDropdowns);

// Convert currency
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("convertButton").addEventListener("click", async () => {
        // Retrieve user input and selections
        const amount = parseFloat(document.getElementById("amount").value);
        const fromCurrency = document.getElementById("fromCurrency").value;
        const toCurrency = document.getElementById("toCurrency").value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount!");
            return;
        }

        try {
            // Fetch conversion rates for the selected currency
            const response = await fetch(`${apiURL}?apikey=${apiKey}&base_currency=${fromCurrency}`);
            const data = await response.json();
            const rates = data.data;

            if (!rates[toCurrency]) {
                alert("Conversion rate not available!");
                return;
            }

            // Calculate the converted amount and display the result
            const convertedAmount = amount * rates[toCurrency];
            document.getElementById("result").textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
        } catch (error) {
            console.error("Error during conversion:", error);
            alert("Conversion failed. Please try again later.");
        }
    });
});
