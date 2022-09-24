const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Loading Spinner Shown
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Remove Loading Spinner
function complete() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

let apiQuotes = [];

function newQuote() {
    // const quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    console.log(quote);
    return quote;
}

// Get Quote From external API
// If we want to use the localQuotes then we can comment out this function.
async function getQuote() {
    loading()
    // We need to use a Proxy URL to make our API call in order to avoid a CORS error
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // Check if Author field is blank and replace it with 'Unknown'
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Dynamically reduce font size for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop Loading, Show Quote
        complete();
    } catch (error) {
        getQuote();
    }
}

async function getQuoteFromJacintoApi() {
    loading()
    const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
        const quote = newQuote();

        // Check if Author field is blank and replace it with 'Unknown'
        if (quote.author === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = quote.author;
        }
        // Dynamically reduce font size for long quotes
        if (quote.text.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = quote.text;
        // Stop Loading, Show Quote
        complete();
    } catch (error) {
        getQuote();
    }
}

// Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
// newQuoteBtn.addEventListener('click', getQuote);
newQuoteBtn.addEventListener('click', getQuoteFromJacintoApi);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
// getQuote();
getQuoteFromJacintoApi();