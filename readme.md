# Projet ChatBot Services Web

## Installation
You need to install all the node packages in both Bots and Server folder.
Go to each folder and use the command : `npm i`   in your shell.

In a shell, use `nodemon ./Server/app.js` in the ChatBot folder to 
start the main server.

## Usage 
To discuss with bot on Discord, please join [this discord server](https://discord.gg/a2M5raVDkD).

In the general channel, type `!start` to set the bot and begin chatting.
(The brain selection does not work, you have to set one with `!select <number>`.
Get the number with `!brains`)
You can change the brain during the conversation.

To discuss with bots or access the admin pannel, open your browser to the url : http://localhost:port/

The port is set in the dotenv file. It is by default port = 3000 (So if running, [this](http://localhost:3000/) will be the homepage).

## Sign in / Sign up
Now you are on the website. You must login. You can create a new account with the signup button, or use one of the pre-created accounts :

| Role  | Email | Password |
| ------------- |:-------------:| -------------- |
| User | test@google.fr      | azerty     |
| Admin | admin@google.fr      | admin     |

Users accounts cannot access the admin pages such as modifying a bot, adding or deleting one. Only an admin account can do those actions.

There is currently only one admin account. The only way to gain admin privileges is to
enable them directly in the database.
