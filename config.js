import {iso8061RightNow} from "./Utils/iso8601Time.js";

// this is the map with all the servers along with their config
let register = new Map();
// to keep track of the last printed value from score feed
export let lastUpdate = iso8061RightNow();

// this is the config class (each server will have their own instance)
class Config {
    constructor() {
        this.channel = 0;
        this.region = "";
        this.enabled = true;
        this.roles = [];
    }
}


// function to get the correct channels when the bot is reset
export function relogChannels(client) {
    client.guilds.cache.forEach(guild => {

        // save the guild id and the config instance
        register.set(guild.id, new Config());

        // save the channelid
        guild.channels.cache.some(channel => {
            if (channel.type === 0) {
                register.get(guild.id).channel = channel.id;
                return true;
            }
            return false;
        });
    });
}


// get the correct channel to write to upon joining a new server
export function loadNewGuildChannel(guild) {
    register.set(guild.id, new Config());
    guild.channels.cache.some(channel => {
        if (channel.type === 0) {
            register.get(guild.id).channel = channel.id;
            return true;
        }
        return false;
    });
}

export function updateTime(time){
    lastUpdate = time;
}


// export the register with all the servers and their config
export default register;
