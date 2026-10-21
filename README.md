# Workout App

Full-stack mobile app for logging workouts and tracking calories, with a custom CNN for photo-based food recognition.

| Folder | What it is | Stack |
| --- | --- | --- |
| [`frontend/`](frontend) | Mobile app: live workout logging, programs, meal tracking, calendar | React Native (Expo), TypeScript |
| [`backend/`](backend) | REST API: JWT auth, workouts, programs, meals, USDA food search | Node.js, Express, PostgreSQL |
| [`food-recognition-cnn/`](food-recognition-cnn) | Food image classifier for calorie tracking (in progress) | PyTorch, Jupyter |

## Getting started

```bash
git clone https://github.com/balloon083/workout-app
cd workout-app
```

Then follow the setup steps in [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).

This repo combines the earlier `workout-app-frontend`, `workout-app-backend`, and `food-recognition-cnn` repos, with their full commit history.
