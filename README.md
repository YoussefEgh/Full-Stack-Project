# 🚀 Full-Stack Fitness Application

## 📖 Setup Guide

**New to the project? Start here!**

👉 **[Click here for the COMPLETE SETUP GUIDE](./COMPLETE_SETUP_GUIDE.md)** 👈

This comprehensive guide will walk you through:
- Installing all prerequisites
- Setting up Firebase (backend & frontend)
- Configuring the Django backend
- Setting up the React frontend
- Avoiding common login errors
- Troubleshooting tips

**Quick Start:**
1. Clone the repository: `git clone https://github.com/YoussefEgh/Full-Stack-Project.git`
2. Follow the [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
3. Run backend: `cd backend && source venv/bin/activate && python manage.py runserver`
4. Run frontend: `cd frontend/fitness-app && npm run dev`

---

# Logistics  

**Q1:** At what time in the week would your group be available to meet online?  
We can meet after class on Tuesdays and Thursdays after class 12-2 PM. As well as on weekends on Zoom 9AM - 5PM. 
Our weekly meeting will be Saturday 12-1PM. 

---

# Timeline: Weekly Meeting Goals  

**Q2:** What is your goals that your group want to achieve in each weekly meeting?  
Week 1 (10/7 - 10/13):
Finalize app features (profiles, buddy finder, workout forum, groups, messaging)
Finalize data structures to be used in application
Design the models (Users, Workouts, Groups, Events, Messages)
Set up Django project and REST API using Django REST Framework
Begin user authentication (sign-up and login)

Week 2 (10/14 – 10/20):
Set up React project with routing and pages for:
User profiles
Workout forum
Buddy finder
Group creation and events
Finalize Figma layout

Week 3 (10/21 – 10/23):
Continue backend and frontend work
Incorporate required data structures into application
Should have decent progress for sign-up/login, profile updates, posting workouts, finding buddies, creating groups
Fix major bugs and minor UI issues
Prepare app for peer review/demo

Week 4 (10/28 – 11/4): 
Incorporate peer review feedback from Milestone 3
Improve social features (messaging, encouragements, group interactions)
Improve progress charts and add filters (by time range, muscle group, etc.)
Test caching system for ExerciseDB for the API rate limits
Prepare for testing and additional feature polishing for Milestone 4

Week 5–6 (11/5 – 11/20):
Complete any remaining features and fix bugs reported during Milestone 4 review
Finish charts and make UI improvements
Prepare project for final presentation (Week 15), including demo workflow and documentation

---

# Communication  

**Q3a:** How can your group communicate when doing the Full Stack Group Project?  
**Q3b:** What are the usernames of each group member on that platform?  
**Q3c:** What is your group’s expected response time to messages?  

3a. We will use iMessage for communication
3b. Just our contact information or our full names:
Kyle Mayuga
Piotr Brozek
Dominic Aidoo
Youssef Elghawabi
3c. Our expected response time will be within the same day anywhere between 6-12 hours. We are all flexible and understand if there may be occasional delayed responses, however.

---

Norms
Q4a: How will your group handle situations when there is conflict in your group?
Q4b: How will your group handle situations when a member is not contributing enough?

4a. When there is a conflict, we will have a discussion through iMessage and weigh both the pros and cons to our differing opinions on where the project should go. We are all very flexible, but in the event that this conversation does not resolve the issue, then we will have a unanimous vote. However, we hope to remain very flexible and open to different options so that it does not have to require a vote.
4b. If a member is not contributing enough we will need to have an intervention meeting to openly discuss all of our expectations of the group and explain why productive collaboration is important, without necessarily making that group member feel bad. We all understand that we can get busy throughout the semester with other coursework or unexpected life events. Therefore, we will discuss ways that we can help our teammate be successful in their part of the project so we can continue with no issue. If they continue not to do their work then we will have another discussion to make sure they begin being more productive.

Roles
Q5: How will your group divide your role in the Group Project?

Example:
Youssef - Backend
Dom - Backend
Kyle - Frontend
Piotr - Frontend


Tech Stacks
Q6: Which tech stacks will your group use? Django + React 

Full Stack Group Project Track
Track 1: Tackling Generative AI Consequences
Problem 1: 
Solution 1: 

Track 2: Technology for Public Goods
Problem 2: UIC students who are interested in fitness often struggle to find workout partners, stay motivated and consistent, or track their progress and meet their fitness goals. This is especially true if they are completely new to the gym and do not feel comfortable approaching other lifters in real life, or just do not know where to start their weightlifting journey in general. Without having a sense of community or a place to start, many UIC students may miss out on the potential to better themselves physically while also building friendships through the gym.
Solution 2: A fitness app that allows UIC students to create their own profile, log their workout sessions (exercises, sets, reps, and weight), and visualize their progress over time with charts. The app would also let students connect with peers, share milestones, and encourage each other through a social page, as well as form workout groups if they are beginners or want to lift with other people.

Problem 3: 
Solution 3: 

Track 3: Creative Coding and Cultural Expression
Idea - Story - Inspiration 4:
Implementation 4:

Idea - Story - Inspiration 5:
Implementation 5:

Q7. Idea Finalization
From 5 project ideas you have above, please choose one of the projects that you are going with for the rest of the semester. Explain why you are going with that project.
We are going with Track 2 Problem 2 (fitness social app) because it is a concept that could benefit many people. I always see students looking for workout partners that are wanting to get into fitness on the UIC Reddit and this application would be a great way for them to connect with other students, especially if they are at similar starting points in their fitness journey (beginner, intermediate, advanced). A lot of new lifters are afraid of going to the gym because they fear judgement or don’t know where to start, and this app acts as the perfect solution to their problems. They could find other users with similar goals and interests as them outside of gym and be able to become lifting partners through the application. Not only that, they could get a visual representation of how much they are improving in the gym through charts and data, and thus be proud of their progress and continue to stay committed and disciplined in that way. Finally, they could learn about new exercises and what muscle groups they target and see if they would benefit from performing those exercises.



# Extra Credit (Only do this if you are done with Idea Finalization)

## Database Design

**Q1: What database are you using for your project (SQLite, PostgreSQL, noSQL, MongoDB,...), and why do you choose it?**
We plan to use PostgreSQL because our team has experience with using this database, and it will be easier to program using this database and also good for storing lots of workout data from the user. Not only will our fitness app need to allow for students to log workouts and track progress but also interact with other students and add motivational or goal-related posts, which is why PostgreSQL would be more ideal due to its power and reliability compared to the other options.

**Q2: How will database be helpful to your project? How will you design your database to support your application features?**
Since the entire application is built upon the idea of retrieving, storing, and displaying fitness data from the user, the database will have tables for things such as: user information (profile info, year, major, etc.), exercises (squat, bench, deadlift, etc.), workout sessions (sets, reps, weight), progress (display history through charts), and student groups. The database design of these several tables will support our application features by being able to query a student’s workout history seamlessly, build charts that displays how much the user has improved overtime, and connect students through posts and groups.

## Third-Party API Integration

**Q3: Which third-party API(s) will you integrate into your project? What data will you pull from the API(s), and how will you use it in your application?**
We were thinking that our project would benefit heavily from the ExerciseDB API because it can be used to build an exercise library within the application that can tell the user about new exercises or variations they can try. It would also be good to be able to find workouts based on what muscles they target if the user has any specific goals in mind, see what equipment is required for that workout and if they have access to such equipment, and also be told any tips with that particular exercise before they attempt to do it themselves. We want our project to also emphasize good form and technique as well as many options to choose from for students that are new to lifting.

**Q4: Does your API key has limitations such as rate limits or downtime? How are you going to deal with that?**
ExerciseDB has a rate limit of 1000 requests per hour. Since ExerciseDB’s data is fixed for things like the name of the exercise, muscle group, equipment, etc. we could handle this by using PostgreSQL to cache the data and check there first. If it’s not already in the database then the exercise and its specific details could then be saved after accessing the ExerciseDB API. This helps for common exercises that are frequently looked up that will be readily available in the database. We could also implement a way to handle the rate limit if it is getting close to reaching it (which is unlikely).

## Authentication and Security

**Q5: What authentication method will you use (e.g., username/password, OAuth, JWT)?**
We will be using username/password and Firebase as our authentication method.

**Q6: How will you store and protect sensitive user data (e.g., passwords, tokens)?**
With the use of Firebase, we would be able to store and protect user sensitive data like passwords and tokens. Our team has experience with using Firebase so it felt like the best option. Sensitive user info (passwords, tokens) will never be stored in the database, and only handled securely by Firebase, so we hope that it will be reliable and an effective way to store and protect sensitive user data. The backend will verify the password or token before allowing access to PostgreSQL for workout logging, progress charts, and social features.

## Deployment

**Q7: Where will you deploy your project (e.g., Heroku, AWS, Render)? How will you manage environment variables and secrets during deployment?**
We plan on using Render to deploy our project and also use it to manage environment variables and secrets during deployment. Render can automatically update the live app whenever we push changes to GitHub. In terms of sensitive info, we will use Render’s environment variables to keep them safe and separate from our code.

**Q8: How will you ensure your deployment is reliable and easy to update?**
We will use Render's feature of being able to automatically deploy from Git and also implement health checks. Any changes we push to GitHub will update the live app. We will also test the app regularly to make sure everything works. PostgreSQL backups and monitoring will help prevent data loss and keep the app running smoothly. This makes the app reliable and easy to update as well as maintain.

## Meetings

**Week 1: Thursday, Oct. 9**
Today the group finalized our ideas for the group project, including the exact features that we are going to include in our application and specifically what each of those features will entail. We settled on having the following main pages:
Login Page: This will be the first page the user sees when opening our application. They will be able to log in or create a new account here.
Progress Page: This will be the main page of our program upon the user logging in. They will be able to see a graphical display of their PRs per workout.
Workout Page: This will be a separate page that will allow the user to log their workout for the day.
Messages Page: This will allow UIC students to connect with other UIC students by direct message and discuss their fitness goals, and schedule times to meet and work in with others.
Communities Page: This will allow UIC students to connect with groups of UIC students that share common fitness goals and create posts about their progress, similar to how Twitter's communities feature works.
We also finalized our roles today, and for the next meeting we established a goal to have the data structures we will use to be finalized as well as the Figma portion of the project.

**Week 2: Thursday, Oct. 16**
Today the group made some changes on the ideas for our project. First of all, the following modifications were made to our page ideas upon more discussion:
Progress Page: We specified that the user will be able to display their lifting progress by past 3 days, past 7 days, past month, and all-time. Additionally, they will be able to select whether their graphical data is shown by PR per workout or total volume lifted for that exercise. Furthermore, they may also want to know their total volume lifted for the total day in the gym and compare it to past results, so they will be allowed to do this as well.
Communities Page: We decided to modify slightly the way this page works, and in order to keep the entire application related to fitness content only, we will make it so that this page works as a forum regarding various topics that the user can post in. For example, there will be one for milestones or goals reached, meal prepping and diet and wellness, form tips, and another topic to post their routines for certain muscle groups.
We also continued working on the Figma project, and we finalized which pages should be worked on in Figma by each group member to keep everything as organized and structured as possible. For our next meeting, we want to have an application skeleton working, meaning that all pages have been set up and are able to be reached by the user. From there, we will continue working on both frontend and backend components based on our assigned roles, specifically expanding the data structure implementations in the backend and continuing adding text fields, input buttons, and such in the frontend.