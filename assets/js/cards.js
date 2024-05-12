document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const audioButton = new Audio('assets/audio/clickButton.mp3');;
    let currentPage = 0;
    let currentQuestion = 0;
    let score = 0;
    let progressBarWidth = 0;
    let quizModal = 1;
    let quizArray = 0;
    let quizProgress = 0;
    let contextText = '';
    let audioResult = null;

    // Retrieve the selected title from localStorage
    const selectedTitle = localStorage.getItem('selectedTitle');
    const selectedTitleImage = localStorage.getItem('selectedTitleImage');

    // Data.json store variable
    let storyData;

    fetch('data.json')
        .then((response) => response.json())
        .then(data => {
            storyData = data[selectedTitle]; // Use the selected title
            initializePage();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // Updated initializePage function to call displayTitle and display the fetched title
    function initializePage() {
        document.getElementById('storyTitle-image').src = selectedTitleImage;
        document.getElementById('storyTitle-image').style.display = 'block';
        // document.getElementById("nextBtn").addEventListener("click", nextPage);
        // document.getElementById("prevBtn").addEventListener("click", previousPage); // Add event listener for previous button
        document.getElementById("nextBtn").addEventListener("click", function(){
            nextPage();
            audioButton.play();
            });
            document.getElementById("prevBtn").addEventListener("click", function(){
            previousPage();
            audioButton.play();
            }); // Add event listener for previous button
        updateProgressBar();

        // Display the fetched title
        displayTitle(selectedTitle);

        // Add event listener to "Try Again?" button
        document.getElementById("back-to-first-page").addEventListener("click", function () {
            location.reload();
        });

    }
    
    // Added displayTitle function to display the fetched title
    function displayTitle(selectedTitle) {
        // Get the story title element
        const titleElement = document.getElementById('storyTitle-name');

        // Display the title element
        titleElement.style.display = 'block';

        // Update the title text
        titleElement.innerText = selectedTitle;
    }

   // Modified checkAnswer function to store the context text
    function checkAnswer(selectedId) {
        const audioWrong = new Audio('assets/audio/wrong.mp3');
        const audioCorrect = new Audio('assets/audio/Correct.mp3');
        const correctId = storyData.quiz[currentQuestion - 1].correctAnswer;
        const resultText = (selectedId === correctId) ? 'Correct!' : 'Incorrect!';
        const answerText = getAnswerText(quizArray, correctId);
        document.getElementById('result').innerText = resultText;
        if (selectedId !== correctId) {
            audioWrong.play();
            document.getElementById('result').style.color = "red";
            document.getElementById('result-answer').style.display = 'block';
            document.getElementById('result-answer').innerText = 'Correct Answer: ' + answerText;
        } else {
            audioCorrect.play();
            document.getElementById('result').style.color = "green";
        }

        // Store the context text
        contextText = storyData.quiz[currentQuestion - 1].context;

        // Display the context
        document.getElementById('context').innerText = contextText; // Display context

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
        quizArray++
    }

    function getAnswerText(quizIndex, correctId) {
        // Ensure quizIndex is within bounds
        if (quizIndex < 0 || quizIndex >= storyData.quiz.length) {
            console.error('Invalid quiz index.');
            return '';
        }
    
        // Get the quiz at the specified index
        const quiz = storyData.quiz[quizIndex];
    
        // Find the option that matches the correctId
        const option = quiz.options.find(option => option.id === correctId);
    
        // Return the text of the found option, or an empty string if not found
        return option ? option.text : '';
    }

    document.getElementById('continue-button').addEventListener('click', function() {
        audioButton.play();
        closeQuizModal(); // Close quiz modal
        nextPage();
        // Close quiz modal
        // closeQuizModal();
        document.getElementById('continue-button').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        contextText = '';
        document.getElementById('result-answer').style.display = 'none';
        quizProgress++;
        updateProgressBar();
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
        } else {
            // Show quiz results after the last slide of the story
            showResults();
            audioResult.play();

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

    // Updated showResults function to display the title on slides
    function showResults() {
        // Hide story content
        document.getElementById('story-container').style.display = 'none';
        // Show quiz scoring
        document.getElementById('quiz-scoring').style.display = 'block';
        // Show quiz results
        document.getElementById('quiz-results').style.display = 'block';
        // Show Try Again button
        document.getElementById('back-to-first-page').style.display = 'block';
        // Show Read More Button
        document.getElementById('read-more').style.display = 'block';
        // Show Title on Slides
        document.getElementById('storyTitle-name').style.display = 'block';

        const title = document.getElementById('storyTitle-name');
        title.innerText = '' // Set the title text here if needed

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
            audioResult = new Audio('assets/audio/perfect.mp3');
        } 
        else if (score >= storyData.quiz.length/2){
        quizResults.innerHTML += `<p>Nice! You have passed!</p>`;
        audioResult = new Audio('assets/audio/passing.mp3');
        }else {
            quizResults.innerHTML += `<p>Keep practicing to improve your score!</p>`;
            audioResult = new Audio('assets/audio/failing.mp3');
        }
    }
    
    function showInstructions(message) {
        const instructions = document.getElementById('instructions');
        instructions.innerHTML = `<p>${message}</p>`;
    }

    function updateProgressBar() {
        progressBarWidth = ((quizProgress) / (storyData.summary.length)) * 100;
        document.getElementById('progress-bar-inner').style.width = progressBarWidth + '%';
    }

    function showQuizModal() {
        const modal = document.getElementById('quiz-modal');
        modal.style.display = 'block';
        displayQuiz(currentQuestion);
    
        // Display the stored context text
        document.getElementById('context').innerText = contextText;
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
    
            // Clear previous context text
            document.getElementById('context').innerText = '';
    
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

const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#ffb56b",
  "#fdaf69",
  "#f89d63",
  "#f59761",
  "#ef865e",
  "#ec805d",
  "#e36e5c",
  "#df685c",
  "#d5585c",
  "#d1525c",
  "#c5415d",
  "#c03b5d",
  "#b22c5e",
  "#ac265e",
  "#9c155f",
  "#950f5f",
  "#830060",
  "#7c0060",
  "#680060",
  "#60005f",
  "#48005f",
  "#3d005e"
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();