const { resourceUrls } = require("./roadmap-content");
const { ZERO, ONE } = require("./status-codes");
const { projectModel } = require("../models/project-model");
const { userProjectModel } = require("../models/user-project-model");
const fs = require('fs');

let createProject = async (roadmap, skillLevel) => {
    var levels = resourceUrls.find(x => x.careerPath.toLowerCase() == roadmap.toLowerCase())?.levels ?? null;

    if (!levels) {
        throw new Error("Levels not found");
    }

    let item = [];

    for (const [i, x] of levels[0][skillLevel?.toLowerCase()].entries()) {
        console.log(x.resourceUrl, "resourceUrl");
        console.log(x.title ?? null, "title");

        var replaced = await populateProjects(x.resourceUrl);

        if (!replaced) {
            fs.appendFile('indexTre.txt', `${x.resourceUrl} , ${x.title} `, (err) => {
                if (err)
                    console.log(`Content has not been appended to the file. ${x.title}`);
            });
        }

        let currentUser = new projectModel({
            title: x.title,
            skillLevel,
            roadmap,
            description: replaced ?? " ",
            index: i
        });

        item.push(currentUser);
    }

    console.log(item, "ITEM")
};

function populateProjects(url) {
    const MAX_CONTENT_LENGTH = 400;

    return fetch(url)
        .then(response => response.text())
        .then(html => {
            // fs.writeFileSync('index.html', html)
            // console.log(html)

            let word = `Project`
            let x = html.indexOf(word)
            let y = word.lastIndexOf(`t`) + ONE;

            const section = html.substring((x++) + y);

            var replaced = section.replace(/<\/?[^>]+(>|$)|&quot;/g, "")
            if (replaced.length <= MAX_CONTENT_LENGTH) {
                return replaced;
            }
            else {
                return null;
            }
        })
        .catch(error => console.error(error));
}


//(async () => await createProject("product-design", 'Advanced'))();