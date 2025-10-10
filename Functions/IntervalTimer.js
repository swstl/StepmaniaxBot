import random from "../Utils/random.js";
import { scoreFeedEmbed } from '../Commands/Embeds.js';
import scoreFeedElement from '../Stepmania/Classes/ScoreFeedElement.js';
import { GetHistory } from '../Stepmania/Stepmaniax.js';
import iso8061ToEpoch, {iso8061RightNow} from '../Utils/iso8601Time.js';
import register, {lastUpdate, updateTime} from '../config.js'



export default async function startInterval(client, time) {

    let historyJson = await GetHistory();
    let embeds = [];

    // console.log("sending: " + time);
    // console.log(historyJson);

    if (historyJson && historyJson.history){

        // loops through the json data from stempaniax and creates an embed for each entry (stops at 10 entries)
        // since discord cant send more than 10 embeds at a time (not necessary either(yes ik i can send one at a time))
        for (let index = 0; (index < historyJson.history.length) && (embeds.length < 10); index++) {
                let scorefeed = new scoreFeedElement();
                scorefeed.parseJsonToValues(historyJson, index); 
                try {
                    if (lastUpdate                                                                     // last update exists
                        && iso8061ToEpoch(lastUpdate) >= iso8061ToEpoch(scorefeed.updated_at))         // last update is newer than the current scorefeed
                        break;
                    else if (scorefeed.user.country == "NO" ||                                         // the scorefeed is from Norway
                            scorefeed.user.country == "SJ" ||                                          // the scorefeed is from Svalbard
                            scorefeed.smx_system_id == 762){                                           // the scorefeed is from the Norwegian system
                                embeds.push(scoreFeedEmbed(scorefeed));
                                console.log(scorefeed);
                        }
                } catch(e){
                    console.log(e);
                }
            }





        // if the scorefeed has any new entries
        if (embeds.length > 0){

            // update the last recorded value to the last item in the score feed
            // console.log(lastUpdate);
            updateTime(historyJson.history[0].updated_at);


            // then we loop through each guild and send the new embeds
            for (const [_, config] of register) {
                // if guild has disabled the bot
                if (!config.enabled) continue;

                try {
                    console.log(`Sending message to channel ${config.channel}`);
                    const channel = await client.channels.fetch(config.channel);
                    await channel.send({embeds: embeds});
                } catch (error) {
                    console.error(`Failed to send message to channel ${config.channel}: ${error}`);
                }
            }
        }
    }

    setTimeout(async () => {
        await startInterval(client, random(28000, 48000)); // Recursively schedule the next execution (28 - 48 sek)
    }, time);

    console.log("Last check " + iso8061RightNow() + " with " + embeds.length + " new entries");
};
