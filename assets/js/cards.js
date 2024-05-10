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
        document.getElementById('storyTitle-image').src = storyData.titleImageUrl;
        document.getElementById('storyTitle-image').style.display = 'block';
        document.getElementById("nextBtn").addEventListener("click", nextPage);
        document.getElementById("prevBtn").addEventListener("click", previousPage); // Add event listener for previous button
        document.getElementById("nextBtn").addEventListener("click", nextPage); // Add event listener for next button

        showInstructions('Title: ' + storyData.titleText);
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
        document.getElementById('storyTitle-image').style.display = 'none';
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
        }
    }

    function previousPage() {
        // Hide the story title image
        document.getElementById('storyTitle-image').style.display = 'none';
    
        // Decrement the currentPage to go to the previous page
        if (currentPage > 0) {
            currentPage--;
    
            // If the current page is a quiz modal, close it and decrement quizModal
            if (currentPage === quizModal) {
                closeQuizModal();
                quizModal--;
            }
    
            // Access the story data for the previous page
            const story = storyData.summary[currentPage];
            document.getElementById('story-text').innerText = story.text;
            document.getElementById('story-image').src = story.imageUrl;
            document.getElementById('story-image').style.display = 'block';
    
            // Update progress bar and instructions
            updateProgressBar();
            showInstructions('');
        }
    }     

    function showResults() {
        showInstructions('CONGRATULATIONS, YOU GOT');
        document.getElementById('story-container').innerHTML = `<h3 id='final-score'>${score}/${storyData.quiz.length}</h3>`;
        document.getElementById('storyTitle-name').innerText = ''
        document.getElementById('quiz-finished').innerText = 'YOU HAVE FINISHED!'
        if (score < storyData.quiz.length) {
            document.getElementById('quiz-result-greeting').innerHTML = `<p id='quiz-result-text'>Every choice is a step forward in learning. Keep exploring, keep growing!</p>`;
        }
        if (score == storyData.quiz.length) {
            document.getElementById('quiz-result-greeting').innerHTML = `<p id='quiz-result-text'>Perfect score! Keep up the fantastic effort :)<p>`;
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

    // Function to show quiz modal
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

    // Function to close quiz modal
    function closeQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'none';
    }

    // Event listener for the exit button
    document.getElementById('exit-close').addEventListener('click', function() {
        closeQuizModal(); // Close quiz modal

        // Decrement currentQuestion and quizModal to go back to the previous question
        currentQuestion = currentQuestion - 1;
        quizModal = quizModal - 1;

        // Reset quiz options
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = false; // Enable quiz options
        });
    });

    
    /*=============== DARK LIGHT THEME ===============*/ 
    const themeButton = document.getElementById('theme-button')
    const darkTheme = 'dark-theme'
    const iconTheme = 'ri-sun-line'

    // Previously selected topic (if user selected)
    const selectedTheme = localStorage.getItem('selected-theme')
    const selectedIcon = localStorage.getItem('selected-icon')

    // We obtain the current theme that the interface has by validating the dark-theme class
    const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

    // We validate if the user previously chose a topic
    if (selectedTheme) {
      // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
      document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
      themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
    }

    // Activate / deactivate the theme manually with the button
    themeButton.addEventListener('click', () => {
        // Add or remove the dark / icon theme
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })

    // Script to set the title based on the query parameter
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get the title from the query parameter
    const title = getQueryParam("title");

    // Set the title in the document
    document.getElementById("storyTitle-name").innerText = title;
});
