# Alice Adventure 2019

## Prerequisite

1. Install [Node.js](https://nodejs.org/en/) (10.15.0LTS is recommended)
2. Install [Yarn](https://yarnpkg.com/lang/en/) (v1.13.0 is recommended)
3. Restart computer to add `node` and `yarn` into `PATH`

## Get Started

1. Clone this project

```
git clone git@github.com:AliceAdventure2019/AliceAdventure2019.git
```

2. Install dependencies

```
cd AliceAdventure/app
yarn install
```

3. Run the project

```
yarn start
```

## Set up development environment (for VS Code users)

1. Install extensions: Prettier, ESLint
2. Go to File -> Preferences -> Settings:
   1. Change Format On Save to True
   2. Change ESLint: Package Manager to Yarn
   3. Change Prettier: Single Quote to True

## Build the project

This project can be built on multiple platforms, like Windows, Linux and OS X. To build the project into standable executables, you will need to:

**For Windows**

```
yarn distWin
```

**For Linux**

```
yarn distLinux
```

**For OS X** (do it on OS X)

```
yarn distMac
```

The project will be packaged and bundled into a folder (a portable version) and a installer. The result can be found in `dist/` folder.

## MuseumLab Version

We also have a version for the museum setting, where the computers in the museum will be protected from exposing the file system to the user. To get that version, download the project from `MuseumLab` branch.

Before running the project in museum computers, you will need to create a folder called 'AliceGames' under `C:\`, this is the default save location. The staff can collect all the games made by the visitors from that folder.

### Run the games on Android devices (like Promethean Board)

Due to the security policy explained below, the games are not playable directly. To put the games onto the Android devices, the museum will need to host the games on a web server. Then, the Android devices can access the games from the web browser.

## Play the games

When a game project is built, it will create a build folder in the same location with the `.aap` project file. Inside of the folder, you will see a `chrome.bat` file and a `index.html` file. If you are using Chrome on the computer, double click the `chrome.bat` to play the game. Otherwise, just double click the `index.html`.

We are using `chrome.bat` because of the security policy of Chrome. It by default disables CORS access, thus we have to use a batch file to add some start up arguments to Chrome temporarily.
