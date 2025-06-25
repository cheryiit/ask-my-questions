class QuizApp {
    constructor() {
        this.questions = [];
        this.shuffledQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        this.currentShuffledMapping = {};
        this.startTime = null;
        this.timerInterval = null;
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
    }

    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Buttons
        this.startTestBtn = document.getElementById('start-test-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Quiz elements
        this.progressFill = document.getElementById('progress-fill');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsCounter = document.getElementById('total-questions-counter');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        
        // Timer elements
        this.timerDisplay = document.getElementById('timer-display');
        
        // Results elements
        this.finalScore = document.getElementById('final-score');
        this.totalScore = document.getElementById('total-score');
        this.scorePercentage = document.getElementById('score-percentage');
        this.correctCount = document.getElementById('correct-count');
        this.wrongCount = document.getElementById('wrong-count');
        this.timeTaken = document.getElementById('time-taken');
        this.completionMessage = document.getElementById('completion-message');
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            this.questions = data.questions;
            
            // Update total questions in UI
            document.getElementById('total-questions').textContent = this.questions.length;
            this.totalQuestionsCounter.textContent = this.questions.length;
            this.totalScore.textContent = this.questions.length;
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Error loading questions. Please check if questions.json exists.');
        }
    }

    bindEvents() {
        this.startTestBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerDisplay.textContent = timeString;
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startQuiz() {
        // Shuffle questions
        this.shuffledQuestions = this.shuffleArray(this.questions);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Start timer
        this.startTimer();
        
        // Switch to quiz screen
        this.showScreen('quiz');
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.shuffledQuestions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update question counter
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        
        // Display question text
        this.questionText.textContent = question.question;
        
        // Clear previous options
        this.optionsContainer.innerHTML = '';
        
        // Shuffle options while keeping track of correct answer
        const options = Object.entries(question.options);
        const shuffledOptions = this.shuffleArray(options);
        
        // Store the mapping for this question
        this.currentShuffledMapping = {};
        
        // Create shuffled options with new letters
        const letters = ['a', 'b', 'c', 'd', 'e'];
        shuffledOptions.forEach(([originalLetter, text], index) => {
            const newLetter = letters[index];
            this.currentShuffledMapping[newLetter] = originalLetter;
            
            const optionElement = this.createOptionElement(newLetter, text);
            this.optionsContainer.appendChild(optionElement);
        });
        
        // Reset state
        this.isAnswered = false;
        this.nextBtn.disabled = true;
        this.nextBtn.textContent = this.currentQuestionIndex === this.shuffledQuestions.length - 1 ? 'Show Results' : 'Next Question';
    }

    createOptionElement(letter, text) {
        const option = document.createElement('div');
        option.className = 'option';
        option.dataset.answer = letter;
        
        option.innerHTML = `
            <div class="option-letter">${letter.toUpperCase()}</div>
            <div class="option-text">${text}</div>
        `;
        
        option.addEventListener('click', () => this.selectOption(option, letter));
        
        return option;
    }

    selectOption(selectedOption, selectedAnswer) {
        if (this.isAnswered) return;
        
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        const correctAnswer = question.correct;
        
        // Map the selected shuffled answer back to original
        const originalSelectedAnswer = this.currentShuffledMapping[selectedAnswer];
        const isCorrect = originalSelectedAnswer === correctAnswer;
        
        // Find which shuffled letter corresponds to the correct answer
        let correctShuffledAnswer = null;
        for (const [shuffledLetter, originalLetter] of Object.entries(this.currentShuffledMapping)) {
            if (originalLetter === correctAnswer) {
                correctShuffledAnswer = shuffledLetter;
                break;
            }
        }
        
        // Mark as answered
        this.isAnswered = true;
        
        // Store user answer (using original letters for consistency)
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: originalSelectedAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Style all options based on shuffled positions
        const allOptions = this.optionsContainer.querySelectorAll('.option');
        allOptions.forEach(option => {
            option.classList.add('disabled');
            const answer = option.dataset.answer;
            
            if (answer === correctShuffledAnswer) {
                option.classList.add('correct');
            } else if (answer === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // If correct answer, auto-advance after a short delay
        // If wrong answer, require manual next button click
        if (isCorrect) {
            setTimeout(() => {
                this.nextQuestion();
            }, 300); // 0.3 second delay to show the correct answer
        } else {
            // Enable next button for wrong answers (manual advance)
            this.nextBtn.disabled = false;
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.shuffledQuestions.length) {
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        // Stop timer
        this.stopTimer();
        
        const totalQuestions = this.shuffledQuestions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const elapsedTime = this.getElapsedTime();
        const timeString = this.formatTime(elapsedTime);
        
        // Update results display
        this.finalScore.textContent = this.score;
        this.scorePercentage.textContent = `${percentage}%`;
        this.correctCount.textContent = this.score;
        this.wrongCount.textContent = totalQuestions - this.score;
        this.timeTaken.textContent = timeString;
        
        // Update completion message based on performance
        let message = '🎊 Congratulations! You completed the quiz!';
        if (percentage >= 90) {
            message = `🏆 Excellent! You completed the quiz in ${timeString} with ${percentage}% accuracy!`;
        } else if (percentage >= 70) {
            message = `👍 Well done! You completed the quiz in ${timeString} with ${percentage}% accuracy!`;
        } else if (percentage >= 50) {
            message = `📚 Good effort! You completed the quiz in ${timeString}. Keep studying!`;
        } else {
            message = `💪 You completed the quiz in ${timeString}. More practice will help!`;
        }
        this.completionMessage.textContent = message;
        
        // Show results screen
        this.showScreen('results');
    }

    restartQuiz() {
        // Reset timer
        this.stopTimer();
        this.startTime = null;
        this.timerDisplay.textContent = '00:00';
        
        this.showScreen('welcome');
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        switch (screenName) {
            case 'welcome':
                this.welcomeScreen.classList.add('active');
                break;
            case 'quiz':
                this.quizScreen.classList.add('active');
                break;
            case 'results':
                this.resultsScreen.classList.add('active');
                break;
        }
    }
}

// Initialize the quiz app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
}); 