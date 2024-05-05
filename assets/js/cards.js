document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentPage = 0;
    let currentQuestion = 0;
    let score = 0;
    let progressBarWidth = 0;

    //data.json will be stored here
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
        showInstructions('Title: '+ storyData.title.titleText)
        updateProgressBar();
    }

    function nextPage() {
        document.getElementById('storyTitle-image').style.display = 'none';
        if (currentPage < storyData.story.length) {
            const story = storyData.story[currentPage];
            document.getElementById('story-text').innerText = story.text;
            document.getElementById('story-image').src = story.imageUrl;
            document.getElementById('story-image').style.display = 'block';
            currentPage++;
            updateProgressBar(); // Update progress bar
            showInstructions('')
        }

        if (currentPage >= storyData.story.length) {
            showInstructions('Choose your best answer. Good Luck!.');
            document.getElementById('next-button').style.display = 'none';
            showQuiz();
        }

       
    }

    function showQuiz() {
        // Hide the story container
        document.getElementById('story-container').style.display = 'none';
    
        // Display the quiz container
        document.getElementById('quiz-container').style.display = 'block';
    
        // Start displaying the quiz questions
        nextQuestion();
    }

    function nextQuestion() {       
        if (currentQuestion < storyData.quiz.length) {
            const quiz = storyData.quiz[currentQuestion];
            document.getElementById('quiz-question').innerText = quiz.question;
            const ul = document.getElementById('quiz-options');
            ul.innerHTML = '';
            quiz.options.forEach(option => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.innerText = option.text;
                button.onclick = function() { checkAnswer(option.id);};
                li.appendChild(button);
                ul.appendChild(li);
            });
            currentQuestion++;
            currentPage++
        }
        
    }

    function checkAnswer(selectedId) {
        const correctId = storyData.quiz[currentQuestion - 1].correctAnswer;
        if (selectedId === correctId) {
            score++;
        }
        updateProgressBar(); // Update progress bar 
    
        if (currentQuestion < storyData.quiz.length) {
            nextQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        showInstructions('Congrats')
        document.getElementById('quiz-container').innerHTML = `<h2>Your Score: ${score} out of ${storyData.quiz.length}</h2>`;
    }

    function showInstructions(message) {
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = `<p>${message}</p>`;
    }

    function updateProgressBar() {
        progressBarWidth = ((currentPage) / (storyData.story.length+storyData.quiz.length)) * 100;
        document.getElementById('progress-bar-inner').style.width = progressBarWidth + '%';
    }
});
