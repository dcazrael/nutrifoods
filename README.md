# Nutrifoods

Nutrifoods is a full-stack solution for Nutritional Data and Recipes

It's my CS50 final project and I wanted to challenge myself to build a full application.

#### Tech stack

-   Django, Django Rest-Framework
-   React
-   tailwindcss

The backend is built using Django and Django Rest-Framework, using JWT to interact with authentication  
React is used for our frontend. Authentication is making use of JWT to explore authentication

The backend serves as our API, calling Nutritionix and Spoonacular APIs for our information, transforming data, and serving it to the frontend.

## Installation

### Requirements

-   Poetry
-   Node.js

Start by cloning this repo into a folder you ahve read, write and execute rights.

### Backend

Use the dependency manager "poetry" to install the backend component

```bash
cd backend
poetry shell
poetry install
```

We are using PostgreSQL for this project, so you need to have the prerequesits for "psycopg2" installed.

Copy the .env.example file and name it .env
Change the values to your appropriate values

Once your DB is created, you need to run migrations (from the backend folder)

```bash
python ./manage.py migrate
```

After that, we have some fixtures (data we want to load into the DB) for the nutritional daily values of nutrients and food components, as well as nutrient data

```bash
python ./manage.py loaddata api/fixtures/api_dailyvaluefoodcomponent.json api/fixtures/api_dailyvaluenutrient.json api/fixtures/api_nutrient.json
```

Once they are imported your backend is almost ready to run.
The last thing you want to check is in the settings.py

Make sure the keys are valid for your frontend, since it isn't running on the same port.
Example.

```python
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:8000",
]
```

### Frontend

The frontend will be installed using NPM

```bash
cd frontend
npm install
```

Copy the .env.example file and name it .env

The important key is "REACT_APP_API_URL"
This needs to point to your backends API endpoint
As an example your.server.com/api

The other keys are used in the footer for some templating
Add the keys you need and leave the ones out you don't

For local development, you need to proxy the requests for Axios.
The proxy is set to http://localhost:8000 (your django backend) when you clone the repo.

## Usage

Start backend server

```bash
cd backend
poetry shell (if you haven't started it already)
python ./manage.py runserver
```

Start frontend

```bash
cd frontend
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
