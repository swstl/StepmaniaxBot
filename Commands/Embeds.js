import { EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();


// this is just an exampel embed from https://discordjs.guide/popular-topics/embeds.html#embed-preview
export const historyEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });






export const scoreFeedEmbed = (scorefeed) => {
    if (!scorefeed) return null;

    let embedColor    = 'ffffff';
    const createdTime = new Date(scorefeed.created_at).toString().split(' ');

    switch (scorefeed.difficulty) {
        case 'Beginner':
        case 'Normal':
            embedColor = '#ffff00';
            break;
        case 'Easy':
            embedColor = '#00ff00';
            break;
        case 'hard':
            embedColor = '#ff0000';
            break;
        case 'wild':
            embedColor = '#ff00ff';
            break;
        case 'dual':
            embedColor = '#0000ff';
            break;
        case 'full':
            embedColor = '#00ffff';
            break;
    }

    return new EmbedBuilder()
        .setTitle(scorefeed.user.username)
        .setDescription(scorefeed.song?.title + ": " + scorefeed.score?.toString())
        .setColor(embedColor)
        .setAuthor({name: scorefeed.song?.artist, iconURL: process.env.EP_BASE + scorefeed.song?.cover_thumb,  url: process.env.EP_SCORE_BASE + scorefeed.id})
        // .addFields({ name: 'Details ', value:   scorefeed.song?.bpm + ' BPM'},
        //            { name: '\u200B', value: '\u200B' })
        // .addFields({ name: 'Score', value: scorefeed.score?.toString()},
        //            { name: '\u200B', value: '\u200B' })
        .addFields({ name: 'Difficulty', value: scorefeed.difficulty,  inline: true },
                    { name: 'Level', value: scorefeed.song.difficulty?.toString(), inline: true },
                    { name: 'Details', value: scorefeed.song?.bpm + ' BPM', inline: true })
        .setImage(process.env.EP_SCORE_BASE + '/image/' + scorefeed.id)
        .setThumbnail(scorefeed.user?.picture ? process.env.EP_BASE + scorefeed.user?.picture : process.env.defaultPFP)
        .setFooter({text: createdTime[1] + " " + createdTime[2] + " " + createdTime[4], iconURL: process.env.EP_BASE + scorefeed.song?.cover_thumb});
        // .setTimestamp();
        // .addFields({ name: 'Perfect!!', value: scorefeed.perfect.toString(),  inline: true },
        //             { name: 'Perfect', value: scorefeed.semiperfect.toString(), inline: true },
        //             { name: 'Late', value: scorefeed.late.toString(), inline: true },
        //             { name: 'Early', value: scorefeed.early.toString(), inline: true },
        //             { name: 'Miss', value: scorefeed.misses.toString(), inline: true })
}


export const listEmbed = (username, difficulty, results) => {
    if (!results || results.length === 0) {
        return new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('No Results')
            .setDescription(`No scores found for ${username} on ${difficulty} difficulty.`);
    }

    // Color based on difficulty
    const difficultyColors = {
        wild: '#ff00ff',
        hard: '#ff0000',
        normal: '#ffff00',
        easy: '#00ff00',
        full: '#00ffff',
        dual: '#0000ff'
    };

    const embed = new EmbedBuilder()
        .setColor(difficultyColors[difficulty] || '#ffffff')
        .setTitle(`Worst Best Scores - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`)
        .setDescription(`Showing lowest personal bests for **${username}**`)
        .setTimestamp();

    // Add fields for each result (max 25 fields in Discord)
    results.forEach(result => {
        embed.addFields({
            name: `Difficulty ${result.difficulty}`,
            value: `${result.title}\nScore: **${result.score}**`,
            inline: true
        });
    });

    return embed;
};
