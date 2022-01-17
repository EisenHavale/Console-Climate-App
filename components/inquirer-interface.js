/*This case I'm doing same as in message, but using a new module. 
It's called inquirer, Ii brings a lot of facilities talking about 
console apps and navegation.
another positive aspect related to inquirer options is that, those work using promises, It's simple
implement the async command.
*/

const inquirer = require('inquirer')
require('colors');

//Creating the data to add into prompt section
const questions = [ // This is an array with objects where I define some questions to use in the inquirer
    { // This are the attributes related to the question object 
        type:'list', // Type of presentation
        name:'option', // Just the name
        message: 'What are you looking for', // The question itsel
        /*choices: ['option1','option2', 'option1'],  List of choices there are some other attributes 
        this way is no a good one because it's simple to identify the selection.
        The best way will be to associete every element with a value, that value will be used to identify easily 
        any possible situation*/
        choices:[
            {
            value: 1,
            name: `${'1'.green}.Find a city information`,
            },
            {
            value: 2,
            name: `${'2'.green}.History of search`,
            },
            {
            value: 0,
            name: `${'0'.green}.Exit`,
            },

        ]
    },
];

//Lets create the menu 
const inquirerMenu = async()=>{ // the async let me use this method as a promise return. 
    console.clear();
    console.log(" ================================ ".cyan);
    console.log("         Choose an option         ");
    console.log(" ================================ ".cyan);
    const {option} = await inquirer.prompt(questions); // This methond from inquirer receive question. 
    return option;

}

const inquirePause = async()=>{
    const confirmation = [ // This is an array with objects where I define some questions to use in the inquirer
        { // This are the attributes related to the question object 
            type:'input', // Type of presentation
            name:'confirmation', // Just the name
            message: `Press ${'Enter'.blue} to continue`, 
        }
    ]
    await inquirer.prompt(confirmation);
}

const readInput = async(message)=>{
    const questionShell =     {
        type: "input",
        name: "description",
        message, // This declareation is used to get the value from the other method.
        validate(value)
        {
            if(value.length==0)
            {
                return "Please submit a valid input";
            }
            return true;
        }
    }
    const{description} = await inquirer.prompt(questionShell);
    return description;
}

const cityOptionsMenu = async (places = []) =>{

    const choices = places.map((place,index)=>{
        const i = index+1;
        return {
            value: place.id,
            name: `${i}`.green +` ${place.name}`,
        }
    })
    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancel',
    })

    const listCityQuestion = [ // This is an array with objects where I define some list to use in the inquirer
        { // This are the attributes related to the question object 
            type:'list', // Type of presentation
            name: 'placeInfo', // Just the name
            message: 'Place Selected', 
            choices,
        }
    ]
    console.clear();
    console.log(" ================================ ".cyan);
    console.log("         Choose an option         ");
    console.log(" ================================ ".cyan);
    const {placeInfo} = await inquirer.prompt(listCityQuestion);
    if(placeInfo!=0){
        return places.find(place=> place.id === placeInfo);
    }else{
        console.log('Information Not submited')
        return 0;
    }

}


const visitedcitiesList = async (citiesInfo=[])=> { //** Here i'll create a checkbox section with all the pending tasks */
    const choices = citiesInfo.map((city)=>{
        return {
            value: city.id,
            name:  `${city.name}`,
        }
        
    })
    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancel',
    })
    const visitedCities = [
        {
            type:'list',
            name: 'history',
            message:'Visited cities',
            choices,
        }
    ]
    console.clear();
    console.log(" ================================ ".cyan);
    console.log("          Select options          ");
    console.log(" ================================ ".cyan);
    const {history} = await inquirer.prompt(visitedCities);
    if(history!=0){
        return history;
    }else{
        console.log("Not city selected");
        return 0
    }

}
module.exports={
    inquirerMenu,
    inquirePause,
    readInput,
    cityOptionsMenu,
    visitedcitiesList,
}