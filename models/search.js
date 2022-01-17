 //*Here I'll get the name of the places, then ask about the information of those places.
 //*Also we have a history section which shouldn't stored over 6 different results.*//
// To find the information, our app will make a http request using the module axios
// *Important to remember that to use http requests, It's useful implement the try and catch
// *This is the source to be used to find those cities https://www.mapbox.com/
const axios = require('axios');


 

class Search{   
    
    

    constructor(){
        this.history = [];
        Search.MAX_CITIES_STORED = 10;
        //TODO Need to take the information from the database

    }
    get cityParameters(){
        return {
            types:'place',
            language:'es',
            access_token:process.env.mapbox_key,
        }
    }
    get temperatureParameters(){
        return {
            appid: process.env.openweather_key,
            units: 'metric',
            
        }
    }

    get historyData(){
        return this.history.map(city=>
            ({
                name: city.name,
                id: city.id
            })
        )
    }
    set loadHistory(data){
        this.history = data;
    }

    async findCityOptions(place = ''){ /* This method is on charge of make http requests. hence it's async
    To make requests, will be using axios*/
    //*As mentioned above, try and catch is important, now we ignored it cause it's a test but to the real use of the app it's too important */
       /* const respond = await axios.get('https://reqres.in/api/users?page=2'); /* This case is a simple test
        from https://reqres.in/ to practice how to make requests. 
        console.log(respond.data.per_page); // the return from the get works as a instance of a class, so I can access tp his attributes */
        try{
            // !To use axios appropriately is quite useful create an instance of it so you can dive the parts of a url
            const axiosInstance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.cityParameters,
            });

            const respond = await axiosInstance.get();
            return respond.data.features.map(cityInfo=>({
                id: cityInfo.id,
                name: cityInfo.place_name,
                lat:cityInfo.center[1],
                lon:cityInfo.center[0],
            }))
            
        }catch(error){
            console.log('No result found using the name submited', place);
            return [];
        }
    }

    async findCityTemperature(lat, lon){
        try{
            const axiosInstance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.temperatureParameters, lat, lon}
            })
            const respond = await axiosInstance.get();
            return respond.data.main

        }catch(error){
            console.log('Temperature not found');
        }
    }

    handleHistory(cityInformation = {}){        
        //TODO Create a validation to avoid store duplicated elements
        const isFirstTime = (this.history.length==0) ? true : false;
        let isStored = false;
        if(!isFirstTime){
            for(let city of this.historyData){
                if(cityInformation.id==city.id){
                    isStored = true;
                    break;        
                }
            }
        }
        console.log(isStored, this.historyData, isFirstTime);
        if(!isStored || isFirstTime)
        {
            if(this.history.length<Search.MAX_CITIES_STORED){
                this.history.push(cityInformation);
            }else{
                this.history.pop();
                this.history.push(cityInformation);
            }
            
        }
    }


    showCityStored(cityId){
        console.log(this.history.find(city => city.id === cityId));
    }


}

module.exports = Search;