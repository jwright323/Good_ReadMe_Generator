// Generate markdown for README
async function generateReadme(data, repoLang) {

    //Build the logic for the Top Language Badges for the repo
    let newBadge = "";

    for (let i = 0; i < repoLang.length; i++) {
        newBadge += "![Badge for GitHub repo top language(s)](https://img.shields.io/badge/-" + repoLang[i] + "-blue)  ";
    }

    // return markdown content
    return `# ${data.title}
${data.licenseBadge} ${newBadge}
## Description
${data.description}
## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)
## Installation
To install dependencies, run the following:
\`\`\`
${data.installation}
\`\`\`
## Usage
${data.usage}
## License
This repository is licensed by the ${data.license}.
${data.licenseBadge}
## Contributing
${data.contributing}
## Tests
To run tests, run the following:
\`\`\`
${data.tests}
\`\`\`
## Questions
Additional questions about this repository? Feel free to contact me directly at [${data.email}](mailto:${data.email}). Also, additional projects can be found on GitHub at [${data.username}](https://github.com/${data.username})
`;
}

module.exports = generateReadme;