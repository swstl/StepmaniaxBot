
export default class user {
    constructor() {
        this.id             = 0;
        this.username       = 0;
        this.country        = "";
        this.hex_color      = "";
        this.picture        = "";
        this.description    = "";
        this.rival          = 0;
    }

    parseJsonToValues(json, historyID){
        if (!json) return;

        // get the user id from the history object
        const userid        = json.history[historyID].gamer_id;

        // get just the user object from the json
        const user          = json.gamers[userid];

        this.id             = user.id;
        this.username       = user.username;
        this.country        = user.country;
        this.hex_color      = user.hex_color;
        this.picture        = user.picture_path;
        this.description    = user.description;
        this.rival          = user.rival;

    }
}
