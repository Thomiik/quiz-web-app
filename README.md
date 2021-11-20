# Quiz site
```🎉 Coded by Tom```

## Project overview:

## Front-end todo:
* [ ] Create client directory
* [ ] Setup vue with plugins:
  * Router
  * Sass / Scss
  * Linter
* [ ] Configure linter 
## Back-end todo:
* [x] Setup node.js with express.js
* [x] Add modules
  * volleyball, monk, yup, nanoid
* [x] Create basic express app with error handler
* [x] Create custom routes
  * POST - /create
  * POST - /answers/:id
  * POST - /play/:id
  * POST - /finish/:id
* [ ] Make /create route
  * Validate json request
  * Add to database (mongodb)
  * Create quizzes UID
  * Handle missing parameters
  * Send JSON response back with message, link and UID
* [ ] Make /play/:id
  * Request quiz from database
  * Formate quiz questions
  * Send JSON response back with formatted questions
