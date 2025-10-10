import register from '../config.js';
import { listEmbed } from './Embeds.js';

/** command types:
 * 1: SUB_COMMAND
 * 2: SUB_COMMAND_GROUP
 * 3: STRING
 * 4: INTEGER
 * 5: BOOLEAN
 * 6: USER
 * 7: CHANNEL
 * 8: ROLE
 * 9: MENTIONABLE
 * 10: NUMBER
 * 11: ATTACHMENT
 */

// difficulty ranges
const DIFFICULTY_RANGES = {
    wild: { min: 19, max: 27 },
    hard: { min: 12, max: 20 },
    normal: { min: 4, max: 14 },
    easy: { min: 1, max: 6 },
    full: { min: 7, max: 28 },
    dual: { min: 2, max: 21 }
};

export const commands = [
    {
        name: 'updatehistory',
        description: 'todo',
        options: [
            {
                name: 'task',
                description: 'The task to add',
                type: 3,
                required: true
            }
        ]
    },
    {
        name: 'disable',
        description: 'Disable the bot in the server',
    },
    {
        name: 'enable',
        description: 'Enable the bot in the server',
    },
    {
        name: 'region',
        description: 'change region using ISO 3166-1 alpha-2 format',
        options: [
            {
                name: 'region',
                description: 'The region to change to in ISO 3166-1 alpha-2 format',
                type: 3,
                required: true,
                choices: [
                    { name: 'United States', value: 'US' },
                    { name: 'Norway', value: 'NO' },
                    { name: 'United Kingdom', value: 'GB' },
                    { name: 'Canada', value: 'CA' },
                    { name: 'Japan', value: 'JP' },
                ]
            }
        ]
    },
    {
        name: 'pingrole',
        description: 'starts pinging the given role when someone is playing',
        options: [
            {
                name: 'role',
                description: 'The role that will be pinged',
                type: 8,
                required: true
            }
        ]
    },
    {
        name: 'list',
        description: 'list the worst PB song for each difficulty for a user',
        options: [
            {
                name: 'user',
                description: 'the user to check',
                type: 3,
                required: true
            },
            {
                name: 'difficulty',
                description: 'the difficulty to check',
                type: 3,
                required: false,
                choices: [
                    { name: 'Wild', value: 'wild' },
                    { name: 'Hard', value: 'hard' },
                    { name: 'Normal', value: 'normal' },
                    { name: 'Easy', value: 'easy' },
                    { name: 'Full', value: 'full' },
                    { name: 'Dual', value: 'dual' }
                ]
            }
        ]
    }
];


async function getWorstPBScores(username, difficulty) {
    const range = DIFFICULTY_RANGES[difficulty];
    if (!range) {
        throw new Error(`Invalid difficulty: ${difficulty}`);
    }

    const results = [];

    for (let diff = range.min; diff <= range.max; diff++) {
        const query = {
            "gamer.username": username,
            "chart.difficulty_name": difficulty,
            "chart.difficulty": diff,
            "_group_by": "song_chart_id",
            "_sort_by": "score",
            "_order": "asc",
            "_take": 1
        };

        const url = new URL('https://api.smx.573.no/scores');
        url.searchParams.append('q', JSON.stringify(query));

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.length > 0) {
                const score = data[0];
                results.push({
                    difficulty: score.chart.difficulty,
                    title: score.song.title,
                    score: score.score
                });
            }
        } catch (error) {
            console.error(`Error fetching difficulty ${diff}:`, error);
        }
    }

    return results;
}


export async function handleCommand(command) {
    switch (command.commandName) {
        case 'updatehistory':
            break;
        case 'disable':
            register.get(command.guildId).enabled = false;
            await command.reply('Bot disabled in this server.');
            break;
        case 'enable':
            register.get(command.guildId).enabled = true;
            await command.reply('Bot enabled in this server.');
            break;
        case 'region':
            register.get(command.guildId).region = command.options.getString('region').toUpperCase();
            await command.reply(`Region changed to ${command.options.getString('region').toUpperCase()}`);
            break;
        case 'pingrole':
            register.get(command.guildId).roles.push(command.options.getRole('role'));
            await command.reply(`Role ${command.options.getRole('role')} will now be pinged.`);
            break;
        case 'list':
            const username = command.options.getString('user');
            const difficulty = command.options.getString('difficulty') || 'wild';

            await command.deferReply();

            try {
                const results = await getWorstPBScores(username, difficulty);
                const embed = listEmbed(username, difficulty, results);
                await command.editReply({ embeds: [embed] });
            } catch (error) {
                console.error('Error fetching scores:', error);
                await command.editReply('An error occurred while fetching scores.');
            }
            break;
        default:
            break;
    }
}
