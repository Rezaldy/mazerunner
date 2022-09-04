// import InvalidCommandByUserRecord from 'src/interfaces/InvalidCommandByUserRecord';

export default interface MazeCommandData {
  commandCount: number,
  invalidCommandCount: number,
  invalidCommands: {[key: string]: number},
  lastCommand: {
    user: string,
      command: string,
  },
}
