/// <reference path="jquery-3.6.0.js"/>

/**
 * A Promise that contains an ajax call using jQuery
 * @param  {string} url The url that will be used by the ajax function
 * @return {}      An object from an API
 */
function getPromise(url){
    return new Promise((resolve, reject)=>{
        $.ajax({
            method: "GET",
            url: url,
            success: data => resolve(data),
            error: reason => reject(reason),
        })
    })
}

/**
 * Shows a bunch of information about certain countries 
 * @param  {string} search The country that the user enters
 */
async function showStats(search){
    try{
        $("#error").css("display","none");
        $("#stats").html("");
        $("#countryStats").html("");
        $("#regionStats").html("");
        $("#currencyStats").html("");
        let countries;
        if(search){
            countries = await getPromise(`https://restcountries.com/v3.1/name/${search}`);
        }
        else
            countries = await getPromise("https://restcountries.com/v3.1/all");

        let counter = 0;
        let population = 0;
        let regions = [];
        let regionPop = {};
        let currencies = [];
        let currenciesUses = {};

        for(let c of countries){
            counter++;
            population += c.population;
            $("#countryStats").append(`
            <div class="country grid-item"> ${c.name.official} </div> 
            <div class="citizens grid-item"> ${c.population} </div>
            `);
            const region = c.region;
            if(!regions.includes(`${region}`)){
                regions.push(region);
                regionPop[region] = 1;
            }
            else
                regionPop[region]++;

            if(c.currencies){
                const currencyNames = Object.getOwnPropertyNames(c.currencies);
                for(let cur of currencyNames){
                    if(!currencies.includes(`${c.currencies[cur].name}`)){
                        currencies.push(`${c.currencies[cur].name}`);
                        currenciesUses[c.currencies[cur].name] = 1;
                    }
                    else
                        currenciesUses[c.currencies[cur].name]++
                }
            }
        }
        $("#stats").append(`
        <div class="globalStats">
            <div> Total countries result: ${counter} </div>
            <div> Total countries population: ${population} </div>
            <div> Average population: ${(population/counter).toFixed(2)} </div>
        </div>
        `);
        for(let r of regions){
            $("#regionStats").append(`
            <div class="grid-item"> ${r} </div>
            <div class="grid-item"> ${regionPop[r]} </div>
            `);
        }

        for(let curName of currencies){
            $("#currencyStats").append(`
            <div class="grid-item"> ${curName} </div>
            <div class="grid-item"> ${currenciesUses[curName]} </div>
            `);
        }
    }
    catch(e){
        $("#error").html("We couldnt find any country that has these letters").css("display","block");
    }
}

$("#submitBtn").on("click", ()=>{
    if($("#countryName").val())
        showStats($("#countryName").val());
    else
        $("#error").html("Please enter values before submiting").css("display","block");
});

$("#allBtn").on("click", ()=>{
    showStats(false);
});