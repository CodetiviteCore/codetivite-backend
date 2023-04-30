const resourceUrls = require("./roadmap-content.json");
const { ZERO, ONE } = require("./status-codes");
const { projectModel } = require("../models/project-model");
const fs = require('fs');

let createProject = async (roadmap, skillLevel) => {
    const levels = resourceUrls.find(x => x.careerPath.toLowerCase() == roadmap.toLowerCase())?.levels ?? null;

    if (!levels) {
        throw new Error("Levels not found");
    }

    let item = [];

    for (const [i, x] of levels[0][skillLevel?.toLowerCase()].entries()) {
        console.log(x.resourceUrl, "resourceUrl");
        console.log(x.title ?? null, "title");

        let replaced = await populateProjects(x.resourceUrl);

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
            let word = `Project`
            let x = html.indexOf(word)
            let y = word.lastIndexOf(`t`) + ONE;

            const section = html.substring((x++) + y);

            const replaced = section.replace(/<\/?[^>]+(>|$)|&quot;/g, "")
            if (replaced.length <= MAX_CONTENT_LENGTH) {
                return replaced;
            }
            else {
                return null;
            }
        })
        .catch(error => console.error(error));
}

async function addProjectsToJson(skillLevel) {
    var resource = resourceUrls.map(async x => {
        let item = { ...x };
        item.levels[0] = await Promise.all(
            Object.entries(x.levels[0]).map(async y => {
                let skillLevel = y[0];
                let res = await Promise.all(
                    y[1].map(async (i, ind) => {
                        let projects = await projectModel.find({ skillLevel, roadmap: x.careerPath, index: ind });
                        if (projects.length > 0) {
                            var project = projects[0]._id;
                            i.projectId = project;
                            i.projectDescription = projects[0].description;
                            return i;
                        }
                    })
                );
                return [y[0], res];
            })
        );
        item.levels[0] = Object.fromEntries(item.levels[0])
        return item;
    });

    Promise.all(resource)
        .then(updatedResource => {
            fs.appendFile('index.json', JSON.stringify(updatedResource), (err) => {
                if (err)
                    console.log(`Content has not been appended to the file. ${x.title}`);
            });
            console.log(updatedResource[0], "UPDATED");
        })
        .catch(err => {
            console.error(err);
        });
}


module.exports = { addProjectsToJson, createProject }