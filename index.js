// Global Variables
const API_KEY = "bc1d472";
const SEARCH_HISTORY_KEY = "cinemaScope_searchHistory";
let isInWatchlist = false;
let currentTheme = 'dark';

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Set up search on Enter key
    const inputField = document.getElementById('name');
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            search();
        }
    });
    
    // Load search history from localStorage
    loadSearchHistory();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('cinemaScope_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Load default movie data for demonstration
    loadDefaultMovie();
});

// Load default movie on initial page load
function loadDefaultMovie() {
    const defaultMovieData = {
        "Title": "Guardians of the Galaxy Vol. 2",
        "Year": "2017",
        "Rated": "PG-13",
        "Released": "05 May 2017",
        "Runtime": "136 min",
        "Genre": "Action, Adventure, Comedy",
        "Director": "James Gunn",
        "Writer": "James Gunn, Dan Abnett, Andy Lanning",
        "Actors": "Chris Pratt, Zoe Saldaña, Dave Bautista",
        "Plot": "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.",
        "Language": "English",
        "Country": "United States",
        "Awards": "Nominated for 1 Oscar. 15 wins & 61 nominations total",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
        "Ratings": [
            {"Source": "Internet Movie Database", "Value": "7.6/10"},
            {"Source": "Rotten Tomatoes", "Value": "85%"},
            {"Source": "Metacritic", "Value": "67/100"}
        ],
        "Metascore": "67",
        "imdbRating": "7.6",
        "imdbVotes": "788,570",
        "imdbID": "tt3896198",
        "Type": "movie",
        "DVD": "N/A",
        "BoxOffice": "$389,813,101",
        "Production": "N/A",
        "Website": "N/A",
        "Response": "True"
    };
    
    // Set input field with the movie title
    document.getElementById('name').value = defaultMovieData.Title;
    
    // Display the default movie info
    displayMovieInfo(defaultMovieData);
    addToSearchHistory(defaultMovieData.Title);
}

function search() {
    const inputTag = document.getElementById("name");
    const movieName = inputTag.value.trim();
    
    if (!movieName) {
        alert('Please enter a movie title');
        return;
    }
    
    // Show loading spinner
    document.getElementById('loading').classList.add('visible');
    
    // Hide any previous results
    document.getElementById('movieInfo').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
    
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieName)}&plot=full`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movie => {
            // Hide loading spinner
            document.getElementById('loading').classList.remove('visible');
            
            if (movie.Response === "True") {
                displayMovieInfo(movie);
                addToSearchHistory(movieName);
                
                // Clear the search input after successful search
                inputTag.value = "";
            } else {
                document.getElementById('noResults').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
            document.getElementById('loading').classList.remove('visible');
            alert('An error occurred while searching for the movie');
        });
}

    
    

// Enhanced quickSearch function to display multiple movies for a category
function quickSearch(term) {
    // Check if term is a genre
    const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Adventure'];
    
    if (genres.includes(term)) {
        // Show loading spinner
        document.getElementById('loading').classList.add('visible');
        
        // Hide any previous results
        document.getElementById('movieInfo').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
        
        // Create a new section to display category results if it doesn't exist
        let categoryResults = document.getElementById('categoryResults');
        if (!categoryResults) {
            categoryResults = document.createElement('div');
            categoryResults.id = 'categoryResults';
            categoryResults.className = 'category-results';
            document.querySelector('.container').insertBefore(
                categoryResults, 
                document.getElementById('historySection')
            );
        }
        
        // Clear previous results
        categoryResults.innerHTML = '';
        
        // Add header
        const header = document.createElement('h2');
        header.textContent = `${term} Movies`;
        categoryResults.appendChild(header);
        
        // Create grid for movies
        const moviesGrid = document.createElement('div');
        moviesGrid.className = 'category-movies-grid';
        categoryResults.appendChild(moviesGrid);
        
        // Get movies for this genre
        const genreMovies = getMoviesByGenre(term);
        
        // Hide loading spinner
        document.getElementById('loading').classList.remove('visible');
        
        // Display the movies
        if (genreMovies.length > 0) {
            categoryResults.style.display = 'block';
            
            genreMovies.forEach(movie => {
                const movieCard = createMovieCard(movie);
                moviesGrid.appendChild(movieCard);
            });
        } else {
            // Show no results if no movies found
            document.getElementById('noResults').style.display = 'block';
        }
    } else {
        // For specific movie searches, use the existing functionality
        document.getElementById('name').value = term;
        search();
    }
}

// Helper function to get movies by genre
function getMoviesByGenre(genre) {
    // More comprehensive movie map with detailed info
    const genreMovieMap = {
        'Action': [
            { 
                title: 'Avengers: Infinity War', 
                poster: 'https://via.placeholder.com/200x300?text=Avengers',
                year: '2018',
                director: 'Anthony and Joe Russo',
                rated: 'PG-13'
            },
            { 
                title: 'Mad Max: Fury Road', 
                poster: 'https://via.placeholder.com/200x300?text=Mad+Max',
                year: '2015',
                director: 'George Miller',
                rated: 'R'
            },
            { 
                title: 'John Wick', 
                poster: 'https://via.placeholder.com/200x300?text=John+Wick',
                year: '2014',
                director: 'Chad Stahelski',
                rated: 'R'
            },
            { 
                title: 'The Dark Knight', 
                poster: 'https://via.placeholder.com/200x300?text=Dark+Knight',
                year: '2008',
                director: 'Christopher Nolan',
                rated: 'PG-13'
            },
            { 
                title: 'Thor: Ragnarok', 
                poster: 'https://via.placeholder.com/200x300?text=Thor+Ragnarok',
                year: '2017',
                director: 'Taika Waititi',
                rated: 'PG-13'
            },
            { 
                title: 'Black Panther', 
                poster: 'https://via.placeholder.com/200x300?text=Black+Panther',
                year: '2018',
                director: 'Ryan Coogler',
                rated: 'PG-13'
            }
        ],
        'Adventure': [
            { 
                title: 'Star Wars: The Last Jedi', 
                poster: 'https://via.placeholder.com/200x300?text=Star+Wars',
                year: '2017',
                director: 'Rian Johnson',
                rated: 'PG-13'
            },
            { 
                title: 'Jurassic World', 
                poster: 'https://via.placeholder.com/200x300?text=Jurassic+World',
                year: '2015',
                director: 'Colin Trevorrow',
                rated: 'PG-13'
            },
            { 
                title: 'Avatar', 
                poster: 'https://via.placeholder.com/200x300?text=Avatar',
                year: '2009',
                director: 'James Cameron',
                rated: 'PG-13'
            },
            { 
                title: 'Pirates of the Caribbean', 
                poster: 'https://via.placeholder.com/200x300?text=Pirates',
                year: '2003',
                director: 'Gore Verbinski',
                rated: 'PG-13'
            },
            { 
                title: 'Indiana Jones', 
                poster: 'https://via.placeholder.com/200x300?text=Indiana+Jones',
                year: '1981',
                director: 'Steven Spielberg',
                rated: 'PG'
            },
            { 
                title: 'The Hobbit', 
                poster: 'https://via.placeholder.com/200x300?text=The+Hobbit',
                year: '2012',
                director: 'Peter Jackson',
                rated: 'PG-13'
            }
        ],
        'Drama': [
            { 
                title: 'The Shawshank Redemption', 
                poster: 'https://via.placeholder.com/200x300?text=Shawshank',
                year: '1994',
                director: 'Frank Darabont',
                rated: 'R'
            },
            { 
                title: 'The Godfather', 
                poster: 'https://via.placeholder.com/200x300?text=Godfather',
                year: '1972',
                director: 'Francis Ford Coppola',
                rated: 'R'
            },
            { 
                title: 'Schindler\'s List', 
                poster: 'https://via.placeholder.com/200x300?text=Schindlers+List',
                year: '1993',
                director: 'Steven Spielberg',
                rated: 'R'
            },
            { 
                title: 'Forrest Gump', 
                poster: 'https://via.placeholder.com/200x300?text=Forrest+Gump',
                year: '1994',
                director: 'Robert Zemeckis',
                rated: 'PG-13'
            },
            { 
                title: 'The Green Mile', 
                poster: 'https://via.placeholder.com/200x300?text=Green+Mile',
                year: '1999',
                director: 'Frank Darabont',
                rated: 'R'
            },
            { 
                title: '12 Angry Men', 
                poster: 'https://via.placeholder.com/200x300?text=12+Angry+Men',
                year: '1957',
                director: 'Sidney Lumet',
                rated: 'NR'
            }
        ],
        'Comedy': [
            { 
                title: 'Deadpool', 
                poster: 'https://via.placeholder.com/200x300?text=Deadpool',
                year: '2016',
                director: 'Tim Miller',
                rated: 'R'
            },
            { 
                title: 'The Hangover', 
                poster: 'https://via.placeholder.com/200x300?text=Hangover',
                year: '2009',
                director: 'Todd Phillips',
                rated: 'R'
            },
            { 
                title: 'Superbad', 
                poster: 'https://via.placeholder.com/200x300?text=Superbad',
                year: '2007',
                director: 'Greg Mottola',
                rated: 'R'
            },
            { 
                title: 'Anchorman', 
                poster: 'https://via.placeholder.com/200x300?text=Anchorman',
                year: '2004',
                director: 'Adam McKay',
                rated: 'PG-13'
            },
            { 
                title: 'Bridesmaids', 
                poster: 'https://via.placeholder.com/200x300?text=Bridesmaids',
                year: '2011',
                director: 'Paul Feig',
                rated: 'R'
            },
            { 
                title: 'Ghostbusters', 
                poster: 'https://via.placeholder.com/200x300?text=Ghostbusters',
                year: '1984',
                director: 'Ivan Reitman',
                rated: 'PG'
            }
        ],
        'Sci-Fi': [
            { 
                title: 'Inception', 
                poster: 'https://via.placeholder.com/200x300?text=Inception',
                year: '2010',
                director: 'Christopher Nolan',
                rated: 'PG-13'
            },
            { 
                title: 'Blade Runner 2049', 
                poster: 'https://via.placeholder.com/200x300?text=Blade+Runner',
                year: '2017',
                director: 'Denis Villeneuve',
                rated: 'R'
            },
            { 
                title: 'Interstellar', 
                poster: 'https://via.placeholder.com/200x300?text=Interstellar',
                year: '2014',
                director: 'Christopher Nolan',
                rated: 'PG-13'
            },
            { 
                title: 'The Matrix', 
                poster: 'https://via.placeholder.com/200x300?text=Matrix',
                year: '1999',
                director: 'The Wachowskis',
                rated: 'R'
            },
            { 
                title: 'Dune', 
                poster: 'https://via.placeholder.com/200x300?text=Dune',
                year: '2021',
                director: 'Denis Villeneuve',
                rated: 'PG-13'
            },
            { 
                title: 'Arrival', 
                poster: 'https://via.placeholder.com/200x300?text=Arrival',
                year: '2016',
                director: 'Denis Villeneuve',
                rated: 'PG-13'
            }
        ]
    };
    
    return genreMovieMap[genre] || [];
}

// Helper function to create a movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = function() {
        document.getElementById('name').value = movie.title;
        search();
    };
    
    const imgElement = document.createElement('img');
    imgElement.src = movie.poster;
    imgElement.alt = movie.title;
    
    const infoElement = document.createElement('div');
    infoElement.className = 'movie-card-info';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = movie.title;
    
    const yearElement = document.createElement('p');
    yearElement.className = 'year';
    yearElement.textContent = movie.year;
    
    const detailsElement = document.createElement('p');
    detailsElement.className = 'details';
    detailsElement.textContent = `${movie.rated} | Dir: ${movie.director}`;
    
    infoElement.appendChild(titleElement);
    infoElement.appendChild(yearElement);
    infoElement.appendChild(detailsElement);
    
    card.appendChild(imgElement);
    card.appendChild(infoElement);
    
    return card;
}
// Display movie information
function displayMovieInfo(movie) {
    // Reset watchlist state for new movie
    isInWatchlist = checkWatchlist(movie.imdbID || movie.Title);
    updateWatchlistButton();
    
    // Basic movie info
    document.getElementById("movieName").textContent = movie.Title;
    document.getElementById("year").textContent = movie.Year;
    document.getElementById("duration").textContent = movie.Runtime;
    document.getElementById("rated").textContent = movie.Rated;
    document.getElementById("genre").textContent = movie.Genre;
    
    // Poster
    const posterElem = document.getElementById("poster");
    posterElem.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster+Available';
    posterElem.alt = `${movie.Title} poster`;
    
    // Plot and details
    document.getElementById("plot").textContent = movie.Plot;
    document.getElementById("director").textContent = movie.Director;
    document.getElementById("writer").textContent = movie.Writer;
    document.getElementById("language").textContent = movie.Language;
    document.getElementById("awards").textContent = movie.Awards;
    document.getElementById("actors").textContent = movie.Actors;
    
    // Handle ratings
    handleRatings(movie.Ratings || []);
    
    // Add box office info if available
    const detailsGrid = document.querySelector('.details-grid');
    
    // Look for existing box office element
    let boxOfficeItem = document.getElementById('boxOfficeItem');
    if (!boxOfficeItem && movie.BoxOffice && movie.BoxOffice !== 'N/A') {
        // Create box office element if it doesn't exist
        boxOfficeItem = document.createElement('div');
        boxOfficeItem.className = 'detail-item';
        boxOfficeItem.id = 'boxOfficeItem';
        
        const boxOfficeTitle = document.createElement('h4');
        boxOfficeTitle.textContent = 'Box Office';
        
        const boxOfficeValue = document.createElement('p');
        boxOfficeValue.id = 'boxOffice';
        boxOfficeValue.textContent = movie.BoxOffice;
        
        boxOfficeItem.appendChild(boxOfficeTitle);
        boxOfficeItem.appendChild(boxOfficeValue);
        detailsGrid.appendChild(boxOfficeItem);
    } else if (boxOfficeItem) {
        // Update existing box office element
        document.getElementById('boxOffice').textContent = movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'Not Available';
    }
    
    // Generate similar movies based on genre
    generateSimilarMovies(movie.Genre);
    
    // Setup streaming links (simulated)
    setupStreamingLinks(movie);
    
    // Show the movie info container
    document.getElementById('movieInfo').style.display = 'block';
}

// Handle displaying ratings and rating bars
function handleRatings(ratings) {
    // Set default "N/A" for all ratings and empty bars
    document.getElementById('imdbRating').textContent = 'N/A';
    document.getElementById('rtRating').textContent = 'N/A';
    document.getElementById('metaRating').textContent = 'N/A';
    
    document.getElementById('imdbBar').style.width = '0%';
    document.getElementById('rtBar').style.width = '0%';
    document.getElementById('metaBar').style.width = '0%';
    
    // Update with actual ratings if available
    ratings.forEach(rating => {
        if (rating.Source === 'Internet Movie Database') {
            const imdbValue = rating.Value;
            document.getElementById('imdbRating').textContent = imdbValue;
            
            // Convert IMDB rating (e.g., "7.5/10") to percentage
            const ratingValue = parseFloat(imdbValue.split('/')[0]);
            const percentage = (ratingValue * 10);
            document.getElementById('imdbBar').style.width = percentage + '%';
            
        } else if (rating.Source === 'Rotten Tomatoes') {
            const rtValue = rating.Value;
            document.getElementById('rtRating').textContent = rtValue;
            
            // Convert Rotten Tomatoes rating (e.g., "75%") to percentage
            const percentage = parseInt(rtValue);
            document.getElementById('rtBar').style.width = percentage + '%';
            
        } else if (rating.Source === 'Metacritic') {
            const metaValue = rating.Value;
            document.getElementById('metaRating').textContent = metaValue;
            
            // Convert Metacritic rating (e.g., "65/100") to percentage
            const percentage = parseInt(metaValue.split('/')[0]);
            document.getElementById('metaBar').style.width = percentage + '%';
        }
    });
}

// Generate similar movies based on genre
function generateSimilarMovies(genres) {
    const similarMoviesContainer = document.getElementById('similarMovies');
    similarMoviesContainer.innerHTML = '';
    
    // Parse genres into array
    const genreArray = genres ? genres.split(', ') : ['Drama'];  // Default to Drama if no genre
    
    // Find the primary genre that matches our quick search categories
    let primaryGenre = 'Drama'; // Default
    
    for (const genre of genreArray) {
        if (['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Adventure'].includes(genre)) {
            primaryGenre = genre;
            break;
        }
    }
    
    // More comprehensive movie map with better recommendations
    const genreMovieMap = {
        'Action': [
            { title: 'Avengers: Infinity War', poster: 'https://via.placeholder.com/150x225?text=Avengers' },
            { title: 'Mad Max: Fury Road', poster: 'https://via.placeholder.com/150x225?text=Mad+Max' },
            { title: 'John Wick', poster: 'https://via.placeholder.com/150x225?text=John+Wick' },
            { title: 'The Dark Knight', poster: 'https://via.placeholder.com/150x225?text=Dark+Knight' },
            { title: 'Thor: Ragnarok', poster: 'https://via.placeholder.com/150x225?text=Thor+Ragnarok' },
            { title: 'Black Panther', poster: 'https://via.placeholder.com/150x225?text=Black+Panther' }
        ],
        'Adventure': [
            { title: 'Star Wars: The Last Jedi', poster: 'https://via.placeholder.com/150x225?text=Star+Wars' },
            { title: 'Jurassic World', poster: 'https://via.placeholder.com/150x225?text=Jurassic+World' },
            { title: 'Avatar', poster: 'https://via.placeholder.com/150x225?text=Avatar' },
            { title: 'Pirates of the Caribbean', poster: 'https://via.placeholder.com/150x225?text=Pirates' },
            { title: 'Indiana Jones', poster: 'https://via.placeholder.com/150x225?text=Indiana+Jones' },
            { title: 'The Hobbit', poster: 'https://via.placeholder.com/150x225?text=The+Hobbit' }
        ],
        'Drama': [
            { title: 'The Shawshank Redemption', poster: 'https://via.placeholder.com/150x225?text=Shawshank' },
            { title: 'The Godfather', poster: 'https://via.placeholder.com/150x225?text=Godfather' },
            { title: 'Schindler\'s List', poster: 'https://via.placeholder.com/150x225?text=Schindlers+List' },
            { title: 'Forrest Gump', poster: 'https://via.placeholder.com/150x225?text=Forrest+Gump' },
            { title: 'The Green Mile', poster: 'https://via.placeholder.com/150x225?text=Green+Mile' },
            { title: '12 Angry Men', poster: 'https://via.placeholder.com/150x225?text=12+Angry+Men' }
        ],
        'Comedy': [
            { title: 'Deadpool', poster: 'https://via.placeholder.com/150x225?text=Deadpool' },
            { title: 'Thor: Ragnarok', poster: 'https://via.placeholder.com/150x225?text=Thor+Ragnarok' },
            { title: 'The Hangover', poster: 'https://via.placeholder.com/150x225?text=Hangover' },
            { title: 'Superbad', poster: 'https://via.placeholder.com/150x225?text=Superbad' },
            { title: 'Anchorman', poster: 'https://via.placeholder.com/150x225?text=Anchorman' },
            { title: 'Bridesmaids', poster: 'https://via.placeholder.com/150x225?text=Bridesmaids' }
        ],
        'Sci-Fi': [
            { title: 'Inception', poster: 'https://via.placeholder.com/150x225?text=Inception' },
            { title: 'Blade Runner 2049', poster: 'https://via.placeholder.com/150x225?text=Blade+Runner' },
            { title: 'Interstellar', poster: 'https://via.placeholder.com/150x225?text=Interstellar' },
            { title: 'The Matrix', poster: 'https://via.placeholder.com/150x225?text=Matrix' },
            { title: 'Dune', poster: 'https://via.placeholder.com/150x225?text=Dune' },
            { title: 'Arrival', poster: 'https://via.placeholder.com/150x225?text=Arrival' }
        ]
    };
    
    // Get movies based on primary genre
    const similarMovies = genreMovieMap[primaryGenre] || genreMovieMap['Drama'];
    
    // Create elements for each similar movie
    similarMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'similar-movie';
        movieElement.onclick = function() {
            document.getElementById('name').value = movie.title;
            search();
        };
        
        const imgElement = document.createElement('img');
        imgElement.src = movie.poster;
        imgElement.alt = movie.title;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'similar-movie-title';
        titleElement.textContent = movie.title;
        
        movieElement.appendChild(imgElement);
        movieElement.appendChild(titleElement);
        similarMoviesContainer.appendChild(movieElement);
    });
}

// Setup streaming availability (simulated)
function setupStreamingLinks(movie) {
    // Simulate streaming availability based on genre and release year
    const platforms = {
        netflixLink: false,
        amazonLink: false,
        huluLink: false,
        disneyLink: false
    };
    
    const year = parseInt(movie.Year);
    const genres = movie.Genre ? movie.Genre.toLowerCase() : '';
    
    // Simulate Netflix availability
    if (year > 2000 && (genres.includes('action') || genres.includes('drama'))) {
        platforms.netflixLink = true;
    }
    
    // Simulate Amazon availability (nearly everything is on Amazon)
    platforms.amazonLink = true;
    
    // Simulate Hulu availability
    if (year > 2010 && (genres.includes('comedy') || genres.includes('drama'))) {
        platforms.huluLink = true;
    }
    
    // Simulate Disney+ availability
    // For Guardians of the Galaxy (Marvel), it would be on Disney+
    if ((genres.includes('animation') || genres.includes('family')) || 
        (year > 2000 && (genres.includes('adventure') || movie.Title.includes('Marvel') || 
         movie.Title.includes('Guardians')))) {
        platforms.disneyLink = true;
    }
    
    // Update UI to show available platforms
    Object.keys(platforms).forEach(platformId => {
        const element = document.getElementById(platformId);
        if (platforms[platformId]) {
            element.style.opacity = "1";
            element.style.pointerEvents = "auto";
        } else {
            element.style.opacity = "0.3";
            element.style.pointerEvents = "none";
        }
    });
}

// Watchlist functionality
function toggleWatchlist() {
    const movieTitle = document.getElementById('movieName').textContent;
    const movieYear = document.getElementById('year').textContent;
    const moviePoster = document.getElementById('poster').src;
    const movieId = document.getElementById('movieName').textContent.replace(/\s+/g, '').toLowerCase() + movieYear;
    
    let watchlist = JSON.parse(localStorage.getItem('cinemaScope_watchlist') || '[]');
    
    if (isInWatchlist) {
        // Remove from watchlist
        watchlist = watchlist.filter(movie => movie.id !== movieId);
    } else {
        // Add to watchlist
        watchlist.push({
            id: movieId,
            title: movieTitle,
            year: movieYear,
            poster: moviePoster
        });
    }
    
    // Save updated watchlist
    localStorage.setItem('cinemaScope_watchlist', JSON.stringify(watchlist));
    
    // Toggle state
    isInWatchlist = !isInWatchlist;
    updateWatchlistButton();
}

// Check if movie is in watchlist
function checkWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem('cinemaScope_watchlist') || '[]');
    return watchlist.some(movie => movie.id === movieId);
}

// Update watchlist button text
function updateWatchlistButton() {
    const watchlistText = document.getElementById('watchlistText');
    if (isInWatchlist) {
        watchlistText.textContent = 'Remove from Watchlist';
    } else {
        watchlistText.textContent = 'Add to Watchlist';
    }
}

// Search history functionality
function addToSearchHistory(movieName) {
    // Get existing history
    let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    
    // Remove this movie if it already exists (to avoid duplicates)
    history = history.filter(item => item.toLowerCase() !== movieName.toLowerCase());
    
    // Add new search to beginning of array
    history.unshift(movieName);
    
    // Keep only the most recent 10 searches
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save back to localStorage
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    
    // Update the UI
    loadSearchHistory();
}

// Load and display search history
function loadSearchHistory() {
    const historyList = document.getElementById('searchHistory');
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    
    // Clear existing list
    historyList.innerHTML = '';
    
    // Show history section only if we have items
    document.getElementById('historySection').style.display = history.length ? 'block' : 'none';
    
    // Add each history item to the list
    history.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie;
        li.addEventListener('click', function() {
            document.getElementById('name').value = movie;
            search();
        });
        historyList.appendChild(li);
    });
}

// Clear search history
function clearHistory() {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    loadSearchHistory();
}

// Toggle between light and dark theme
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (currentTheme === 'dark') {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        currentTheme = 'light';
    } else {
        body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        currentTheme = 'dark';
    }
    
    // Save preference
    localStorage.setItem('cinemaScope_theme', currentTheme);
}