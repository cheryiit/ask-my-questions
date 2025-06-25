# Occupational Health & Safety Quiz

A modern, interactive quiz application for testing knowledge on Occupational Health and Safety topics.

## Features

- 🔀 **Random Question Order**: Questions are shuffled for each quiz attempt
- 🎯 **Instant Feedback**: Immediate visual feedback for correct/incorrect answers
- 📊 **Progress Tracking**: Real-time progress bar and question counter
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **Retake Quiz**: Option to restart and try again

## How to Use

1. Click the "Start Test" button to begin
2. Read each question carefully
3. Select your answer by clicking on one of the options
4. After selecting, you'll see immediate feedback:
   - ✅ Correct answers are highlighted in green
   - ❌ Wrong answers are highlighted in red
5. Click "Next Question" to continue
6. View your final score at the end
7. Option to retake the quiz with questions in a new random order

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality with classes and modules
- **JSON**: Question data storage

## Project Structure

```
├── index.html          # Main HTML file
├── style.css           # All styling and responsive design
├── script.js           # Quiz functionality and logic
├── questions.json      # Question database
└── README.md          # Project documentation
```

## Features in Detail

### Quiz Logic
- Questions are randomly shuffled using Fisher-Yates algorithm
- Immediate answer validation
- Score tracking throughout the quiz
- Comprehensive results display

### User Interface
- Clean, modern design with purple gradient theme
- Smooth transitions and hover effects
- Progress indicator
- Mobile-responsive layout
- Accessibility considerations

### Question Format
Each question includes:
- Unique ID
- Question text
- Multiple choice options (a, b, c, d, e)
- Correct answer designation

## Running the Project

1. Clone this repository
2. Open `index.html` in your web browser
3. Start taking the quiz!

*Note: For local development, you may need to serve the files through a local server to avoid CORS issues with the JSON file.*

## Contributing

Feel free to contribute by:
- Adding more questions
- Improving the UI/UX
- Adding new features
- Fixing bugs

## License

This project is open source and available under the MIT License. 