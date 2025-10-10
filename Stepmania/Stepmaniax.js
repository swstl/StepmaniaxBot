import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });



export async function GetHistory(){
    // const filePath = '/home/Pinestone/Documents/Stepmania/Stepmania/example.json';

    // try {
    //     const jsonData = fs.readFileSync(filePath, 'utf-8');
    //     const data = JSON.parse(jsonData);
    //     return data;

    // } catch (error) {
    //     console.error(error);
    //     return null;
    // }





    let returnData = null;
    const url = process.env.EP_HISTORY;
    const body = {
        "apiVersion": process.env.ApiVersion,
        "auth_gamer": process.env.AuthGamer,
        "auth_token": process.env.AuthGamerToken,
        "last_score_id": null
      };

      try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'StepManiaX/1 CFNetwork/1492.0.1 Darwin/23.3.0',
                'Accept-Language': 'en-GB,en;q=0.9', 
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        returnData = await response.json(); // Parses JSON response into native JavaScript objects
        // console.log(returnData.history()); // Logging the data
    } catch (error) {
        console.error('Error:', error); // Handling the error
    }

    return returnData;
}
