// External packages
const inquirer = require('inquirer');
const axios = require('axios');
const util = require('util');
const fs = require('fs');
// Set the fs.writeFile function to use promises
const writeFileAsync = util.promisify(fs.writeFile);

let repoLang = [];

const licenseBadgeLinks = {
    "Mozilla Public License 2.0": "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)",
    "Apache License 2.0": "[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)",
    "MIT License": "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",
    "ISC License (ISC)": "[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)",
    "The Unlicense": "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)"
}

// Internal modules
const generateReadme = require('./utils/generateReadme.js');

// Prompts for user answers
const questions = [
    {
        type: 'confirm',
        message: "Do you wish to access your GitHub repo and get top language information to create repo badges? (Username must be exactly how it shows on GitHub and repo is public - Y/N)",
        name: 'showrepobadge',
        default: false,
    },
    {
        type: 'input',
        message: "Please enter your GitHuub username? (No @ needed - Must be valid)",
        name: 'username',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid GitHub username is required.");
            }
            return true;
        }
    },
    {
        type: 'input',
        message: "What is your name of your project (repo)? (Name must be identical to what is on Github. Also, project must be public on GitHub.)",
        name: 'reponame',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("A valid GitHub reponame is required.");
            }
            return true;
        }
    },

    {
        type: 'input',
        message: "Please provide an valid email address.",
        name: 'email',
        default: 'john.smith@abctheworld.com',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("An email address is required.");
            }
            return true;
        }
    },

    {
        type: 'input',
        message: "What is the title of your project?",
        name: 'title',
        default: 'Project Title',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Title is required.");
            }
            return true;
        }
    },
    
    {
        type: 'input',
        message: "Please provide a description of your project.",
        name: 'description',
        default: 'Project Description',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Description is required.");
            }
            return true;
        }
    },

    {
        type: 'input',
        message: "Supply command run line needed to install dependencies.",
        name: 'installation'
    },
    {
        type: 'input',
        message: "Please provide instructions & examples of your project in use for the Usage section.",
        name: 'usage'
    },
    {
        type: 'input',
        message: "Provide guidelines on how other developers can contribute to your project.",
        name: 'contributing'
    },
    {
        type: 'input',
        message: "If applicable, provide any tests written for your app and provide examples on how to run them.",
        name: 'tests'
    },
    {
        type: 'list',
        message: "Choose a license for your project.",
        choices: ['Mozilla Public License 2.0', 'Apache License 2.0', 'MIT License', 'ISC License (ISC)', 'The Unlicense'],
        name: 'license'
    }


];

async function getLang (userAnswers, repoLang) {
    /*     const url = "https://api.github.com/repos/jwright323/Weather-Dashboard/languages";
        const response = await fetch(url); */
        const queryUrl = `https://api.github.com/repos/${userAnswers.username}/${userAnswers.reponame}/languages`;
        
    
        try {
            // fetch data from a url endpoint
            const response = await axios.get(queryUrl);
    
            //make an Object of the languages returned
            repoLang = Object.keys(response.data);
        
            return repoLang;
          } catch (error) {
            console.log(`Not able to retrieve data for url ${queryUrl}.  Please try again.`);
            throw error;
          } 
    }

async function init() {
    try {

        // Prompt Inquirer questions
        const userAnswers = await inquirer.prompt(questions);
        userAnswers.licenseBadge = licenseBadgeLinks[userAnswers.license];

        // Call GitHub and determine the languages used in your repo.
        if (userAnswers.showrepobadge) {
            repoLang = await getLang(userAnswers, repoLang);
        }
    
        // Pass the answers to generateReadme
        console.log("Generating README...")
        const readme = await generateReadme(userAnswers, repoLang);
    
        // Write markdown to file
        await writeFileAsync(`${userAnswers.reponame}-README.md`, readme);
        console.log(`Your ${userAnswers.reponame}-README.md file has been generated.  Please rename your file to README.md when you are ready.`)

    } catch (error) {
        console.log(error)
        console.log("The readme file was not created.");
    }
};

init();