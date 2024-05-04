document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => initializePage(data));
});

let currentPage = 0;
let currentQuestion = 0;
let score = 0;  // user's score

function initializePage(data) {
    window.storyData = data; // Store data globally
}

function nextPage() {
    const story = window.storyData.story[currentPage];
    if (story) {
        document.getElementById('story-text').innerText = story.text;
        document.getElementById('story-image').src = story.imageUrl;
        document.getElementById('story-image').style.display = 'block';
        currentPage++;
        if (currentPage >= window.storyData.story.length) {
            document.querySelector('#story-container button').onclick = showQuiz;
            document.querySelector('#story-container button').innerText = 'Start Quiz';
        }
    } else {
        document.getElementById('story-container').style.display = 'none';
        showQuiz();
    }
}

function showQuiz() {
    document.getElementById('quiz-container').style.display = 'block';
    nextQuestion();
}

function nextQuestion() {
    const quiz = window.storyData.quiz[currentQuestion];
    if (quiz) {
        document.getElementById('quiz-question').innerText = quiz.question;
        const ul = document.getElementById('quiz-options');
        ul.innerHTML = '';
        quiz.options.forEach(option => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.innerText = option.text;
            button.onclick = function() { checkAnswer(option.id); };
            li.appendChild(button);
            ul.appendChild(li);
        });
        currentQuestion++;
    } else {
        showResults(); //Show the final score
    }
}

function checkAnswer(selectedId) {
    const correctId = window.storyData.quiz[currentQuestion - 1].correctAnswer;
    if (selectedId === correctId) {
        score++; // Increment score 
    }
    if (currentQuestion < window.storyData.quiz.length) {
        nextQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-container').innerHTML = `<h2>Your Score: ${score} out of ${window.storyData.quiz.length}</h2>`;
}