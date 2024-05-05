document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentPage = 0;
    let currentQuestion = 0;
    let score = 0;
    let progressBarWidth = 0;
    let quizModal = 1;

    // Data.json store variable
    let storyData;

    fetch('data.json')
        .then((response) => response.json())
        .then(data => {
            storyData = data;
            initializePage();
        });

    function initializePage() {
        document.getElementById('storyTitle-image').src = storyData.title.titleImageUrl;
        document.getElementById('storyTitle-image').style.display = 'block';
        document.getElementById('next-button').addEventListener('click', nextPage);
        showInstructions('Title: ' + storyData.title.titleText);
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

        if (currentPage < storyData.story.length) {
            const story = storyData.story[currentPage];
            document.getElementById('story-text').innerText = story.text;
            document.getElementById('story-image').src = story.imageUrl;
            document.getElementById('story-image').style.display = 'block';
            currentPage++;
            updateProgressBar(); // Update progress bar
            showInstructions('')
        }
    }

    function showResults() {
        showInstructions('Congrats');
        document.getElementById('story-container').innerHTML = `<h2>Your Score: ${score} out of ${storyData.quiz.length}</h2>`;
    }

    function showInstructions(message) {
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = `<p>${message}</p>`;
    }

    function updateProgressBar() {
        progressBarWidth = ((currentPage) / (storyData.story.length)) * 100;
        document.getElementById('progress-bar-inner').style.width = progressBarWidth + '%';
    }

    // Function to show quiz modal
    function showQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'block';
        displayQuiz(currentQuestion);
    }

    function displayQuiz(index) {
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

});
