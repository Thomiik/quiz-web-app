const express = require('express');
const volleyball = require('volleyball');
const db = require('monk')('localhost/quiz-site');
const yup = require('yup');
const  { nanoid } = require('nanoid');

const app = express();
app.use(volleyball)
app.use(express.json())

const quizzes = db.get('quizzes');

app.get('/', (req, res) => {
  res.json({
    message: '🎉 Quiz site backend server!'
  });
});

const create_schema = yup.object().shape({
  name: yup.string().trim().required(),
  reveal_answers: yup.boolean().required(),
});

const free_type_schema = yup.object().shape({
  q: yup.string().trim().required(),
  ca: yup.string().trim().required(),
  cs: yup.boolean().required(),
});

const multiple_choice_schema = yup.object().shape({
  q: yup.string().trim().required(),
  mc: yup.boolean().required(),
});

const question_schema = yup.object().shape({
  text: yup.string().trim().required(),
  correct: yup.boolean().required(),
});

app.post('/create', async (req, res, next) => {
  const quiz = req.body
  const name = req.body.name;
  const reveal_answers = req.body.reveal_answers
  const UID = nanoid(6)
  const questions = req.body.questions

  try {
    await create_schema.validate({
      name,
      reveal_answers,
    });

    for (var question in questions) {
      switch(req.body.questions[question].type) {
        case "free-type": {
          const q = req.body.questions[question].question;
          const ca = req.body.questions[question].correct_answer;
          const cs = req.body.questions[question].case_sensitive;
          await free_type_schema.validate({
            q,
            ca,
            cs,
          });
          break;
        }
        case "multiple-choice": {
          const q = req.body.questions[question].question;
          const mc = req.body.questions[question].multiple_correct;
          const choices = req.body.questions[question].choices
          await multiple_choice_schema.validate({
            q,
            mc,
          });

          if (Object.keys(choices).length === 0) {
            let error = new Error('❌ Choice is missing in question');
            error.status = 400
            throw error
          }

          for (var choice in choices) {
            const text = req.body.questions[question].choices[choice].text
            const correct = req.body.questions[question].choices[choice].correct
            await question_schema.validate({
              text,
              correct,
            });
          }
          break;
        }
        default: {
          let error = new Error('❌ Invalid question type');
          error.status = 400
          throw error
        }
      }
    }
  } catch (error) {
    return next(error);
  }

  quiz['UID'] = UID;

  const created = await quizzes.insert(quiz)


  res.json({
     message: 'Successfully created a quiz!',
     link: 'localhost:8080/quizzes/' + UID,
     UID: UID
    });
});

app.post('/answers/:id', (req, res) => {
  // TODO: Get peoples answers to your quiz using uid
  res.status(501)
  res.json({
    message: 'Not implemented yet'
  });
});

app.post('/play/:id', async (req, res) => {
  const questions = {}
  const { id: quizID } = req.params;
  quiz = await quizzes.findOne({ UID: quizID});

  for (var question in quiz.questions) {
    questions[question] = {}

    const type = quiz.questions[question].type;
    const question_text = quiz.questions[question].question;

    questions[question].type = type
    questions[question].question = question_text
    if (type === 'multiple-choice') {
      const multiple_correct = quiz.questions[question].multiple_correct
      questions[question].multiple_correct = multiple_correct
      for (var choice in quiz.questions[question].choices) {

      }
    }
  }

  console.log(questions)

  res.status(501)
  res.json({
    message: 'Not implemented yet'
  });
});

app.post('/finish/:id', (req, res) => {
  // TODO: Finish quiz with answers using uid
  res.status(501)
  res.json({
    message: 'Not implemented yet'
  });
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 3373;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});