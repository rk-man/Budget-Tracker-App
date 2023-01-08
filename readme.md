# Budget Tracker App

### To Use this backend

1. Clone you respository or download the zip file

2. create a virtual env and activate it

    - helps you use your django project in a seperate environment

3. go to the root folder -> pip install -r requirements.txt

    - This will install all the dependencies in your new environment

4. Run the below to migrate your database changes

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

5. Finally, `python manage.py runserver` to run the application

### To use frontend

1. create a .env file and set `REACT_APP_BACKEND_URL=http://localhost:8000`
2. go the root folder, run `npm install` to install the dependencies
3. `npm run start` to run the application
