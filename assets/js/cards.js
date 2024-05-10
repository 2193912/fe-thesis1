document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentPage = 0;
    let currentQuestion = 0;
    let score = 0;
    let progressBarWidth = 0;
    let quizModal = 1;

    // Retrieve the selected title from localStorage
    const selectedTitle = localStorage.getItem('selectedTitle');

    // Data.json store variable
    let storyData;

    fetch('data.json')
        .then((response) => response.json())
        .then(data => {
            storyData = data[selectedTitle]; // Use the selected title
            initializePage();
        });

    function initializePage() {
        document.getElementById("nextBtn").addEventListener("click", nextPage);
        document.getElementById("prevBtn").addEventListener("click", previousPage); // Add event listener for previous button

        updateProgressBar();
    }

    function checkAnswer(selectedId) {
        const correctId = storyData.quiz[currentQuestion - 1].correctAnswer;
        const resultText = (selectedId === correctId) ? 'Correct!' : 'Incorrect!';
        document.getElementById('result').innerText = resultText;

        // Disable all options in the mcq after user clicks a choice
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = true;
        });

        // Show continue button and result
        document.getElementById('result').style.display = 'block';
        document.getElementById('continue-button').style.display = 'block';

        if (selectedId === correctId) {
            score++;
        }

        if (currentQuestion == storyData.quiz.length) {
            showResults();
        }
    }

    document.getElementById('continue-button').addEventListener('click', function() {
        closeQuizModal(); // Close quiz modal
        nextPage();
        document.getElementById('continue-button').style.display = 'none';
        document.getElementById('result').style.display = 'none';
    });

    function nextPage() {
        if (currentPage === quizModal) {
            showQuizModal();
            quizModal++;
            return; // wait for quiz submission
        }

        if (currentPage < storyData.summary.length) {
            const story = storyData.summary[currentPage];
            document.getElementById('story-text').innerText = story.text;
            document.getElementById('story-image').src = story.imageUrl;
            document.getElementById('story-image').style.display = 'block';
            currentPage++;
            updateProgressBar(); // Update progress bar
            showInstructions('')
        } else {
            // Show quiz results after the last slide of the story
            showResults();
        }
    }

    function previousPage() {
        if (currentPage > 0) {
            currentPage--;

            if (currentPage === quizModal) {
                closeQuizModal();
                quizModal--;
            }

            const story = storyData.summary[currentPage];
            document.getElementById('story-text').innerText = story.text;
            document.getElementById('story-image').src = story.imageUrl;
            document.getElementById('story-image').style.display = 'block';

            updateProgressBar();
            showInstructions('');
        }
    }

    function showResults() {
        // Hide story content
        document.getElementById('story-container').style.display = 'none';
        // Show quiz scoring
        document.getElementById('quiz-scoring').style.display = 'block';
        // Show quiz results
        document.getElementById('quiz-results').style.display = 'block';
        // Show Try Again button
        document.getElementById('back-to-first-page').style.display = 'block';
        //Show Title on Slides
        document.getElementById('storyTitle-name').style.display = 'block';

        const title = document.getElementById('storyTitle-name');
        title.innerText = ''
    
        // Remarks for the quiz taker
        const remarks = document.getElementById('quiz-result-greeting');
        remarks.style.display = 'block'; // Show the quiz greeting
        remarks.innerHTML = `<h3>Quiz Results</h3>`;
    
        // Populate quiz scoring content
        const scoring = document.getElementById('quiz-scoring');
        scoring.innerHTML = `<p>You scored ${score}/${storyData.quiz.length}!</p>`;
    
        // Populate quiz result content
        const quizResults = document.getElementById('quiz-results');
        quizResults.innerHTML = ''; // Clear previous content
        if (score == storyData.quiz.length) {
            quizResults.innerHTML += `<p>Congratulations! You got a perfect score!</p>`;
        } else {
            quizResults.innerHTML += `<p>Keep practicing to improve your score!</p>`;
        }
    }
    
    
    

    function showInstructions(message) {
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = `<p>${message}</p>`;
    }

    function updateProgressBar() {
        progressBarWidth = ((currentPage) / (storyData.summary.length)) * 100;
        document.getElementById('progress-bar-inner').style.width = progressBarWidth + '%';
    }

    function showQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'block';
        displayQuiz(currentQuestion);
    }

    function displayQuiz() {
        if (currentQuestion < storyData.quiz.length) {
            const quiz = storyData.quiz[currentQuestion];
            document.getElementById('quiz-question').innerText = quiz.question;
            const ul = document.getElementById('quiz-options');
            ul.innerHTML = '';
            quiz.options.forEach(option => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.classList.add('quiz-option');
                button.innerText = option.text;
                button.onclick = function() { checkAnswer(option.id); };
                button.setAttribute('id', 'quiz-button')
                li.appendChild(button);
                ul.appendChild(li);
            });
            currentQuestion++;
        }
    }

    function closeQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'none';
    }

    document.getElementById('exit-close').addEventListener('click', function() {
        closeQuizModal(); // Close quiz modal

        currentQuestion = currentQuestion - 1;
        quizModal = quizModal - 1;

        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = false; // Enable quiz options
        });
    });

    // Dark/Light Theme functionality
    const themeButton = document.getElementById('theme-button')
    const darkTheme = 'dark-theme'
    const iconTheme = 'ri-sun-line'
    const selectedTheme = localStorage.getItem('selected-theme')
    const selectedIcon = localStorage.getItem('selected-icon')

    const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

    if (selectedTheme) {
        document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
        themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
    }

    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })

    // Set the title in the document
    const title = getQueryParam("title");
    document.getElementById("storyTitle-name").innerText = title;
});
