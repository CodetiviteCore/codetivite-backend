const resources = require('./roadmap-content.json')
const { ONE, TWO } = require("./status-codes");

exports.salaryPerSkillLevel = {
    junior: "$50,000",
    entrylevel: "$100,000",
    intermediate: "$150,000",
    advanced: "$200,000"
}

exports.careers = [
    "frontend",
    "backend",
    "product-design",
    // "solidity",
    // "blockchain",
    // "defi-dev",    
     "technical-writing",
    // "full-stack-dev",
    // "product-manager",
    // "community-manager",
    // "rust-dev",
    // "devops",
    // "graphic-des",
    // "smart-contract-dev"
];

exports.skillLevels = ["junior", "entrylevel", "intermediate", "advanced"];
exports.status = ["Pending", "Completed"];
exports.badges = ["fresher", "titan", "og"];
exports.levelDescriptions = {
    junior: "You're a tech newbie, just starting out on your exciting coding adventure! As a junior, you're like a sponge, soaking up knowledge and gaining your first taste of the tech world. You're eager to learn, grow, and make your mark, and that's exactly what this level is all about",
    entrylevel: "Alright, you're at the entry-level checkpoint now! You've got a solid foundation in tech skills and a bit of experience under your belt. Think of it as the beginning of your tech career journey. You're ready to dive into the real world, put your knowledge to the test, and explore all the awesome possibilities ahead!",
    intermediate: "You've leveled up to the intermediate stage, which means you're not a beginner anymore. You've gained some serious skills and experience in your chosen tech field. You're like a Jedi Padawan, honing your abilities and taking on more challenging tasks. The force is strong with you, and you're ready to take things to the next level!",
    advanced: "You're a tech wizard now! At the advanced level, you've unlocked a whole new realm of tech mastery. You're like the Gandalf of your domain, wielding powerful skills and knowledge. You've conquered numerous challenges, tackled complex projects, and become a go-to expert. You're trailblazing the tech landscape and making magic happen!"
}

exports.isTemporaryEmail = (email) => {
    const temporaryEmailProviders = [
        'yopmail.com',
        'guerrillamail.com',
        'tempmail.com',
        'mailinator.com',
        '10minutemail.com',
        'burnermail.io',
        'fakemailgenerator.com',
        'maildrop.cc',
        'getnada.com',
        'dispostable.com',
        'throwawaymail.com',
        'tempail.com',
        'mytemp.email',
        'mailnesia.com',
        'mailcatch.com',
        'mailnull.com',
        'moakt.com',
        'inboxalias.com',
        'spamgourmet.com',
        'anonemail.net',
    ];

    const domain = email.split('@')[ONE];
    return temporaryEmailProviders.some(provider => domain === provider);
}

// To get a new badge for user after completion of level
exports.getNextBadge = async (user) => {
    if (!checkIfLevelIsCompleted(user)) {
        return;
    }

    const earnedBadges = user.badgesEarned;

    for (const badge of exports.badges) {
        if (!earnedBadges.includes(badge)) {
            earnedBadges.push(badge)
            // return earnedBadges.length;
            return badge;
        }
    }
    return null;
}
// To check if user has completed a particular level
const checkIfLevelIsCompleted = (user) => {
    const completedProjects = user.completedProjects;
    const currentLevel = user.currentSkillLevel
    const careerPath = user.careerPath.toLowerCase()

    for (const career of resources) {
        if (career.careerPath.toLowerCase() === careerPath) {
            const level = career.levels.find(level => level[currentLevel]);

            if (level) {
                for (const projects of Object.values(level[currentLevel])) {
                    if (Array.isArray(projects)) {
                        for (const project of projects) {
                            const isCompleted = completedProjects.some(completedProject => completedProject.projectId === project.projectId);

                            if (!isCompleted) {
                                return false;
                            }
                        }
                    } else {
                        const isCompleted = completedProjects.some(completeProject => completeProject.projectId === projects.projectId)

                        if (!isCompleted) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

// To calculate daily activity of user
const calculateDailyLogin = (timestamps) => {
    const today = new Date();
    const dayStarts = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const loginsToday = timestamps.filter(timestamp => timestamp >= dayStarts)
    
    return loginsToday.length;
}

// To update user daily login activity
exports.updateDailyLoginActivity = async (user) => {
    const loginToday = calculateDailyLogin(user.loginActivity)
    user.dailyActivityScore = loginToday;
    await user.save();
}

// To assign activity status for the day
exports.assignDailyStatus = async (user) => {
    const activityToday = user.dailyActivityScore;

    return activityToday >= 3 ? 'high' : activityToday === 2 ? 'moderate' : activityToday === 1 ? 'low' : 'none';
}