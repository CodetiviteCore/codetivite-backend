const { resourceUrls } = require("./roadmap-content");
const { ONE } = require("./status-codes");
const { projectModel } = require("../models/project-model");
const fs = require('fs');
const path = require('path');

let createProject = async (roadmap, skillLevel) => {
    //Get the levels where the careerPath is the same as the roadmap we passed 
    const levels = resourceUrls.find(x => x.careerPath.toLowerCase() == roadmap.toLowerCase())?.levels ?? null;

    if (!levels) {
        throw new Error("Levels not found");
    }

    let item = [];

    //For a particulr skillLevel in that roadmap, get all the title-resourceUrls 
    for (const [i, x] of levels[0][skillLevel?.toLowerCase()].entries()) {
        //For each item in that list
        console.log(x.resourceUrl, "resourceUrl");
        console.log(x.title ?? null, "title");

        //Pass the resourceUrl into the populateProjects
        let replaced = await populateProjects(x.resourceUrl);

        //If we fetch any valid item from populateProject, add it to the text file
        if (!replaced) {
            fs.appendFile('indexTre.txt', `${x.resourceUrl} , ${x.title} `, (err) => {
                if (err)
                    console.log(`Content has not been appended to the file. ${x.title}`);
            });
        }

        //Create a new project model  using what we just extracted
        let currentUser = new projectModel({
            title: x.title,
            skillLevel,
            roadmap,
            description: replaced ?? " ",
            index: i
        });

        //Add the project model to 
        item.push(currentUser);
    }

    console.log(item, "ITEM")
};

function populateProjects(url) {
    const MAX_CONTENT_LENGTH = 400;

    //Try to get the content of the URL
    return fetch(url)
        //Convert the content to text
        .then(response => response.text())
        .then(html => {
            //Declare a "Project" marker
            let word = `Project`
            //get the index of the marker in the content collected
            let x = html.indexOf(word)
            //Get the index of the last letter of Project
            let y = word.lastIndexOf(`t`) + ONE;

            //Get the part of the content starting from the end of the project keyword
            const section = html.substring((x++) + y);

            //replace any unwanted sections with an empty string
            const replaced = section.replace(/<\/?[^>]+(>|$)|&quot;/g, "");

            //If content is too long, it may be wrong content
            if (replaced.length <= MAX_CONTENT_LENGTH) {
                return replaced;
            }
            else {
                return null;
            }
        })
        .catch(error => console.error(error));
}

async function addProjectsToJson()  {
    var resource = resourceUrls.map(async x => {
        let item = { ...x }; //Copy the current roadmap item
        //console.log(item.levels[0])
        item.levels[0] = await Promise.all(
            //The levels array has only one item, convert that item to an array 
            Object.entries(x.levels[0]).map(async y => {
                //For each skill level, get the first item in the array which is the skill level
                let skillLevel = y[0];
                //The second item os the actual array that was attached to the skilllevel
                let res = await Promise.all(
                    //Each item in the skilllevel has title and resourceUrl
                    //Map through each of the items is the current index
                    y[1].map(async (i, ind) => {
                        
                        //Find a projectmodel where the skill level is the current skill level, the roadmap is the current roadmap and the index 
                        let projects = await projectModel.find({ skillLevel, roadmap: x.careerPath, index: ind });
                        //If any project is found
                        if (projects.length > 0) {
                            //Get the project id
                            var project = projects[0]._id;
                            //Add this Id to the title resourceUrl object as a projectId
                            i.projectId = project;
                            //Add this decription to the title resourceUrl object as a description
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
 
    const file = path.join(__dirname, 'index.json');
    Promise.all(resource)
        .then((updatedResource) => {
            const data = JSON.stringify(updatedResource);

            fs.access(file, fs.constants.F_OK, (err) => {
                if (err) {
                    // File doesn't exist, create it and write the data
                    fs.writeFile(file, data, (err) => {
                        if (err) {
                            console.error(`Error creating file: ${err}`);
                        } else {
                            console.log('File created and data appended successfully');
                        }
                    });
                } else {
                    // File exists, append the data
                    fs.writeFile(file, data, (err) => {
                        if (err) {
                            console.error(`Error appending data to file: ${err}`);
                        } else {
                            console.log('Data appended to file successfully');
                        }
                    });
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = { addProjectsToJson, createProject }