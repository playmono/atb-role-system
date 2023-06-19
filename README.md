# Active Time Battle Role System

## Run the game
This game has two parts: the game itself and the server. In order to run the full project, you must run two processes.

1. Download the source code
2. Run the backend (AKA the server)
```bash
cd backend
cp .env.dist .env
npm install
npm run start
```
3. Run the frontend (AKA the game)
```bash
cd frontend
cp .env.dist .env
npm install
npm run start:dev
# Run `npm run` to check all the commands
```

## Thanks to
1. [Universitat Oberta de Catalunya](https://www.uoc.edu)
2. [PhaserJS](https://phaser.io/)
3. [James Skemp's phaser3-vsc-typescropt-nodejs template repository](https://github.com/JamesSkemp/phaser-3-vsc-typescript-nodejs)
