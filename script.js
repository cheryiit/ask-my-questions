class QuizApp {
    constructor() {
        this.questions = [];
        this.shuffledQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
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
        
        // Results elements
        this.finalScore = document.getElementById('final-score');
        this.totalScore = document.getElementById('total-score');
        this.scorePercentage = document.getElementById('score-percentage');
        this.correctCount = document.getElementById('correct-count');
        this.wrongCount = document.getElementById('wrong-count');
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

    startQuiz() {
        // Shuffle questions
        this.shuffledQuestions = this.shuffleArray(this.questions);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
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
        
        // Create options
        const options = Object.entries(question.options);
        options.forEach(([letter, text]) => {
            const optionElement = this.createOptionElement(letter, text);
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
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Mark as answered
        this.isAnswered = true;
        
        // Store user answer
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: selectedAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Style all options
        const allOptions = this.optionsContainer.querySelectorAll('.option');
        allOptions.forEach(option => {
            option.classList.add('disabled');
            const answer = option.dataset.answer;
            
            if (answer === correctAnswer) {
                option.classList.add('correct');
            } else if (answer === selectedAnswer && selectedAnswer !== correctAnswer) {
                option.classList.add('wrong');
            }
        });
        
        // If correct answer, auto-advance after a short delay
        // If wrong answer, require manual next button click
        if (isCorrect) {
            setTimeout(() => {
                this.nextQuestion();
            }, 1000); // 1 second delay to show the correct answer
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
        const totalQuestions = this.shuffledQuestions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        
        // Update results display
        this.finalScore.textContent = this.score;
        this.scorePercentage.textContent = `${percentage}%`;
        this.correctCount.textContent = this.score;
        this.wrongCount.textContent = totalQuestions - this.score;
        
        // Show results screen
        this.showScreen('results');
    }

    restartQuiz() {
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