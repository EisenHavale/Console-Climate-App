const {readInput, inquirerMenu, inquirePause, cityOptionsMenu, visitedcitiesList} = require('./components/inquirer-interface');
const Search = require('./models/search');
/* TODO create a class to handle the process to get the information about the place and look for the climate related to it */
const search = new Search();
const dotenv = require('dotenv')
dotenv.config()
const {saveData, readData} = require('./components/save-data');

// TODO Create a method to save the data as .json file
const main = async () => {
    let userSelection = 0;
    const data = readData();
    if(data){
        search.loadHistory=data;
        console.log(data);
    }
    do{
        userSelection = await inquirerMenu();
        await menuSelection(userSelection);
        saveData(search.history);
        if(userSelection!==0) await inquirePause();
    }while(userSelection!==0);
    
}

const menuSelection = async (userSelection) => {
    switch(userSelection){
        case 0:
            console.log("Bye bye");
            break;
        case 1: 
            let tempInfo;
            //Receive the name of the place
            const searchTerm = await readInput('City:');
            // invoke the function to find the options found by searching the name and show the info
            const places = await search.findCityOptions(searchTerm);
            // Get the information from the option selected by the user and show it
            const placeSelected = await cityOptionsMenu(places);
            if(placeSelected!=0){
                tempInfo = await search.findCityTemperature(placeSelected.lat,placeSelected.lon);    
                //*Information */
                console.log('\n City Information\n'.green);
                console.log('City:',placeSelected.name);
                console.log('Lat:', placeSelected.lat);
                console.log('Lon:', placeSelected.lon);
                console.log('Current Temp:',tempInfo.temp);
                console.log('Min:',tempInfo.temp_min);
                console.log('Max:',tempInfo.temp_max);
                console.log('It feels like:',tempInfo.feels_like);
                search.handleHistory(
                    {
                        name: placeSelected.name, 
                        id: placeSelected.id, 
                        lat: placeSelected.lat, 
                        lon: placeSelected.lon,
                        temp:tempInfo.temp,
                        temp_desc:tempInfo.feels_like,
                    }
                    )
            }

            break;
        case 2: 
            // Show a list of maximum 6 different process
            const citiesInfo = search.historyData;
            const cityId = await visitedcitiesList(citiesInfo);
            if(cityId!=0) search.showCityStored(cityId);
            break;
    }

}


main();