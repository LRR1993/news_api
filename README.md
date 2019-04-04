# News API

The news api allows access to the news accessing various topics and articles relating those topics.

## Table of Contents :book:

1.  [Getting Started](#Getting-Started)
    1.  [Prerequisites](#Prerequisites)
    2.  [Installing](#Installing)
    3.  [Running the tests](#Running-the-tests)
2.  [Deployment](#Deployment)
3.  [Built With](#Built-With)
4.  [Versioning](#Versioning)
5.  [Authors](#Authors)
6.  [License](#license)
7.  [Acknowledgments](#Acknowledgments)

## Getting-Started :running:

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Folder structure below :open_file_folder:

```
 ├── models/
 │  └──── xx.js
 ├── routes/
 │  └──── xx.js
 ├─── node_modules/
 ├─── controllers/
 │  └──── xx.js
 ├─── ultis/
 │  └──── ultils.js
 ├─── erros/
 │  └──── index.js
 ├─── spec/
 │  └──── app.spec.js
 │  └──── ultils.spec.js
 ├─── db/
 │  └──── connection.js <-- node-postrgres connection configuration
 │  └──── seeds
 │    └──── seed.sql
 │  └──── migrations
 │    └──── xx.js
 │  └──── test-data
 │    └──── ...-data
 │  └──── dev-data
 │    └──── ...-data
 │  └──── setup.sql <-- database creation
 ├── app.js
 ├── listen.js
 ├── knexfile.js <-- database info (port/host/database name)
 ├── .gitignore
 ├── package-lock.json
 ├── prettierrc
 ├── .eslintrc.js <-- style formmatter
 ├── Procfile
 ├── README.md
```

### Prerequisites

Please install the software below, description of how to install them (with links are below)
**Assume user is using an OSX**

Requirements:

```
Node
NPM
GIT
Postgresql
```

if you already have these installed skip to [Installing](#Installing).

#### Install Homebrew

```
Run this command on your terminal application to install Homebrew:

~/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Update Homebrew:

brew update
```

#### Install Git

```
See if you already have Git by running:

git --version

'If you already have Git it will tell you a version number.'

'If you do not see a version number, install Git with Homebrew:'

brew install git

$ git --version

'again to confirm Git has been installed'.
```

#### Install NVM (Node Version Manager) and Node

So far you could only run JavaScript code on a web browser, attached to an HTML page. Node.js allows us to run JavaScript code directly from our terminal. We'll use Node.js extensively during the course and on the Precourse so it's important to have an up-to-date version installed.

```
Run this command in your terminal to install Node Version Manager which allows you to easily download the latest version of Node, and switch between versions at a later date if you need to:

`$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`

Check it has installed correctly by typing this command on the terminal:

`$ nvm --version`

Again, if you see a version number you are good.

Now install Node using NVM:

`$ nvm install node`

`$ nvm use node`

`$ source ~/.nvm/nvm.sh`

You may need to quit and reopen your terminal application before you see it has been successful. To check success, type:

`$ node --version`

If you have an earlier version than 6, type:

`$ nvm install 8.6.0`

`$ nvm use 8.6.0`

`$ node --version`

Now you should see that you are using Node version 8.6.0
```

#### Install PostgreSQL

PostgreSQL is another database we'll use during the course. Again, don't worry if this doesn't seem to go as you planned, you won't need it for the Precourse and we can sort you out at the install session!

Install the Postgres app by going here and downloading it:

[Get Postgres.app](https://postgresapp.com/)

### Installing

A step by step series of examples that tell you how to get a development env running

1. create a directory to save your app in.

```
mkdir your-folder-name
```

2. save files and sub folders in the folder you just craeted
3. Open the package JSON for information on requirements and dependencies
4. Install the packages

```
npm i
```

(will install information from the package.json)

5. App created and ready to run.

## Running-the-tests

1. Testing the app and database: run `npm t` to test all the enpoints and routes, if more endpoints are added please test before deployment.

2. Development Env: Refer to [README_scripts](README_scripts.md) for scripts to update and test the database. Refer to `package.json` for testing scripts to be run.

### Coding style and testing tests

ESLint and Prettirt used to format the code. Open [eslintrc.js](.eslintrc.js) & [prettierrc](.prettierrc) for more infomration. Update these files to change any code formatting issues.

To update code style

```
npm run lint
```

Note: this will format all the files in the directory.

## Deployment

Before live deployment ensure pre commit hooks are installed. This app uses husky and eslint to esnure consistent code. If these arent installed please use the commands below and update the package json to include.

```
npm i husky
```

```js
// package.json
 "scripts": {
    "lint": "eslint ./ --fix",
    "posttest": "npm run lint"
 },
   "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }

```

This app is currentely hosted on Heroku,
Link: [nc_news_letisha](https://nc-news-letisha.herokuapp.com/api/)

## Built-With

- [Express](https://expressjs.com/) - The web framework used
- [Postgresql](https://www.postgresql.org/) - Open source relational database
- [Knex](Knex.js) - SQL Query Builder

## Contributing

Please see [contributors](https://github.com/LRR1993/news_api/graphs/contributors) on this project for more information.

## Versioning

[GitHub](https://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/LRR1993/news_api/tags).

## Authors

- **Tish Richardson** - _Initial work_ - [LRR1993](https://github.com/LRR1993)

See also the list of [contributors](https://github.com/LRR1993/news_api/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License

## Acknowledgments

- Northcoders :smile: :stuck_out_tongue: :star2:
