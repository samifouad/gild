import { sleep, serve, $ } from 'bun'
import { createSpinner } from 'nanospinner'
import data from '#/package.json' with { type: 'json' }
import { sysinfo } from '!/utils'
import base64url from 'base64url'

export async function login() {
    let spinner = createSpinner(' task: initiate login flow for fromafri.ca').start();

    const port = 55555;
    let isAuthorized = false;

    // Start the local server to handle the OAuth redirect
    const server = serve({
        port: port,
        async fetch(req) {
            const url = new URL(req.url);
            const params = new URLSearchParams(url.search);

            if (url.pathname === '/callback') {
                const authCode = params.get('code');
                if (authCode) {
                    spinner2.success({ text: `Received OAuth code: ${authCode}`})
                    isAuthorized = true;
                    // Send the response
                    const response = new Response("Login successful! You can close this window.");
                    
                    // Allow some time for the response to be sent
                    setTimeout(() => {
                        server.stop(); // Stop the server 
                        process.exit(0); // Exit
                    }, 100); // Adjust the delay as needed
                    
                    return response;
                    
                } else {
                     // Send the response
                    const response = new Response("No OAuth code received.");
                    
                    // Allow some time for the response to be sent
                    setTimeout(() => {
                        server.stop(); // Stop the server 
                        process.exit(1); // Exit with failure code
                    }, 100); // Adjust the delay as needed
                    
                    return response;
                }

                
            }

            return new Response("Not Found", { status: 404 });
            server.stop(); // Stop the server 
            process.exit(1); // Exit with failure code
        },
    });

    let params = [
        { client: `${data.name}_v${data.version}`},
        { redirect_uri: `http://localhost:${port}/callback`},
        { response_type: 'code'},
    ]

    const client_info = await sysinfo()

    params.push(...client_info)

    params = await base64url(JSON.stringify(params))

    const authUrl = `http://localhost:3000/cli?a=${params}`;

    spinner.success();

    let browser_spinner = createSpinner(' task: launch browser').start();

    // Attempt to open the browser
    try {
        if (process.platform === 'win32') {
            await $`start ${authUrl}`.quiet();
            browser_spinner.success();
        } else if (process.platform === 'darwin') {
            await $`open ${authUrl}`.quiet();
            browser_spinner.success();
        } else if (process.platform === 'linux') {
            await $`xdg-open ${authUrl}`.quiet();
            browser_spinner.success();
        } else {
            throw new Error('unsupported platform');
        }
    } catch (error) {
        console.log('\nautomatic browser launch failed');
        browser_spinner.error({ text: 'Browser launch failed' });
    }

    console.log(`\nyou can use this URL if your browser didn't open:\n\n${authUrl}`);
    console.log('\n');

    let spinner2 = createSpinner(' task: waiting for login...').start();

    // Set a timeout for 15 seconds (15000 ms)
    const timeout = setTimeout(() => {
        if (!isAuthorized) {
            server.stop(); // Stop the server on timeout
            spinner2.error({ text: 'Login failed: timeout' });
            process.exit(1); // Exit with failure code
        }
    }, 30000);
}
