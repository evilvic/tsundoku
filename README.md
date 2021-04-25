# TSUNDOKU

Stack your books!

**Tsundoku** is my capstone project for the *Cloud Developer Udacity Nanodegree*. It's a cloud-based app build with serverless framework, react and AWS. **Tsundoku** let you create a collection of the books you have stack in your house.

## Screens

<img src="https://raw.githubusercontent.com/evilvic/tsundoku/main/screens/screen_01.png" alt="screen 01" width="200"/>
<img src="https://raw.githubusercontent.com/evilvic/tsundoku/main/screens/screen_02.png" alt="screen 02" width="200"/>
<img src="https://raw.githubusercontent.com/evilvic/tsundoku/main/screens/screen_03.png" alt="screen 03" width="200"/>
<img src="https://raw.githubusercontent.com/evilvic/tsundoku/main/screens/screen_04.png" alt="screen 04" width="200"/>
<img src="https://raw.githubusercontent.com/evilvic/tsundoku/main/screens/screen_05.png" alt="screen 05" width="200"/>


## Download the project

```
git clone https://github.com/evilvic/tsundoku.git
cd tsundoku
```

### Run client

```
cd client
npm i
npm run start
```

### Run backend

```
cd backend
npm i
sls deploy -v
```

## Backend API

https://hktglmw1d2.execute-api.us-east-1.amazonaws.com/dev

Authetication: 'Bearer token'

## Postman collection

https://github.com/evilvic/tsundoku/blob/main/tsundoku.postman_collection.json