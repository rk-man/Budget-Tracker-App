# Budget Tracker App

![Home Page](https://res.cloudinary.com/rk-man/image/upload/v1673756485/bxcsmc995w9wccr6oxqb.jpg)

### To Use this backend

1. Clone you respository or download the zip file

2. create a virtual env and activate it

    - helps you use your django project in a seperate environment

3. go to the root folder(backend) -> `pip install -r requirements.txt`

    - This will install all the dependencies in your new environment

4. Run the below to migrate your database changes

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

5. Finally, `python manage.py runserver` to run the application

### To use frontend

1. After cloning the repository, create a .env file and set `REACT_APP_BACKEND_URL=http://localhost:8000` on the root folder(frontend)
2. run `npm install` to install the dependencies
3. `npm run start` to run the application
