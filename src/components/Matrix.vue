<template>
  <div id="matrix" v-if="currentPosition.toString() !== endPosition.toString()">
    <div class="matrixRow" v-for="(row, rowIndex) in matrix" :key="rowIndex">
      <tile
        v-for="(tile, tileIndex) in row"
        :type="getType(tile, rowIndex, tileIndex)"
        :key="tileIndex"
      />
    </div>
    <div v-if="commandData.maze.invalidCommandCount">Biggest bozo: {{getMostInvalidCommands().user}} with {{getMostInvalidCommands().count}} bozo command{{getMostInvalidCommands().count > 1 ? 's':''}}.</div>
    <div v-else>No bozos here!</div>

    <div v-if="commandData.maze.lastCommand.user.length">Last command: <span class="text-weight-bold">{{ commandData.maze.lastCommand.user }}</span>: {{ commandData.maze.lastCommand.command}}</div>
    <div v-else>No command submitted yet. Use !maze up/down/left/right to move!</div>
  </div>
  <div v-else id="completed">
    <div>{{ commandData.maze.commandCount }} commands executed</div>
    <div>{{ commandData.maze.invalidCommandCount }} Walls were run into.</div>
    <div v-if="getMostInvalidCommands()">{{ getMostInvalidCommands().user }} had no idea what they were doing <span class="text-weight-bold">{{getMostInvalidCommands().count}} times</span></div>
  </div>
</template>

<script lang="ts" setup>
import { client, prefix } from 'boot/tmi';
import MazeCommand from 'src/enums/MazeCommand';
import {computed, reactive} from 'vue';
import InvalidCommandRecord from 'src/interfaces/InvalidCommandRecord';

const matrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Set start position in matrix
const startPosition = [0, 1]; // (x,y) representation of startPosition
matrix[startPosition[1]][startPosition[0]] = 2;

// Set end position in matrix
const endPosition = [20,21];
matrix[endPosition[1]][endPosition[0]] = 3;

// Init current position using start position coordinates
let currentPosition = reactive(Array.from(startPosition));
let commandData = reactive({
  maze: {
    commandCount: 0,
    invalidCommandCount: 0,
    invalidCommands: <InvalidCommandRecord>{

    },
    lastCommand: {
      user: '',
      command: '',
    },
  }
});

const incrementInvalidCommandByUser = (username: string | undefined) => {
  if (!username)
    return;

  commandData.maze.invalidCommands[username] = commandData.maze.invalidCommands[username] ?
    commandData.maze.invalidCommands[username] + 1 : 1;
}

const getMostInvalidCommands = () => {
  return [...Object.entries(commandData.maze.invalidCommands).map((invalidCommandByUser) => {
    return {
      user: invalidCommandByUser[0],
      count: invalidCommandByUser[1],
    }
  }).sort((a, b) => b.count - a.count)].shift();
}

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  if (message.startsWith(prefix)) {
    // Removes the prefix from the command and creates an array of strings from the message
    // Example: ["maze", "left"]
    const context = message.slice(prefix.length).split(/ +/);

    // Returns the first item in the array
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const commandName = context.shift().toLowerCase();

    // Maze command called
    if (commandName === 'maze') {
      // Ignore if maze is completed
      if (currentPosition.toString() === endPosition.toString()) {
        return;
      }
      // Check matrix before doing anything
      else if (!matrix.length) {
        return;
      } else {
        matrix.forEach((array) => {
          // Check all array lengths
          if (!array.length) {
            return;
          }
        });
      }

      const commandText = context[0].toLowerCase();
      if (Object.values(MazeCommand).includes(<MazeCommand>commandText)) {
        // Command is found and valid, do whatever logic here
        let [xPos, yPos] = [currentPosition[0], currentPosition[1]];
        commandData.maze.lastCommand.user = <string>tags.username;
        commandData.maze.lastCommand.command = commandText;

        switch (commandText) {
          // UP command
          case MazeCommand.Up:
            /**
             * Don't go out of bounds
             * Don't go into walls
             */
            if (yPos === 0 || matrix[yPos - 1][xPos] === 1) {
              commandData.maze.invalidCommandCount++;
              incrementInvalidCommandByUser(tags.username);
              break;
            }
            yPos--;
            break;
          // DOWN command
          case MazeCommand.Down:
            /**
             * Don't go out of bounds
             * Don't go into walls
             */
            if (yPos === matrix.length - 1 || matrix[yPos + 1][xPos] === 1) {
              commandData.maze.invalidCommandCount++;
              incrementInvalidCommandByUser(tags.username);
              break;
            }
            yPos++;
            break;
          // LEFT command
          case MazeCommand.Left:
            if (xPos === 0 || matrix[yPos][xPos - 1] === 1) {
              commandData.maze.invalidCommandCount++;
              if(tags.username) {
                incrementInvalidCommandByUser(tags.username);
              }
              break;
            }
            xPos--;
            break;
          // RIGHT command
          case MazeCommand.Right:
            if (xPos === matrix.length - 1 || matrix[yPos][xPos + 1] === 1) {
              commandData.maze.invalidCommandCount++;
              incrementInvalidCommandByUser(tags.username);
              break;
            }
            xPos++;
            break;
          case MazeCommand.Restart:
            const badges = tags.badges ?? {};
            if (badges.broadcaster || badges.moderator) {
              currentPosition = Array.from(startPosition);
              commandData.maze = {
                commandCount: 0,
                invalidCommandCount: 0,
                invalidCommands: {

                },
                lastCommand: {
                  user: '',
                  command: '',
                },
              }
            }
            return;
          default:
            break;
        }

        // Set new position
        [currentPosition[0], currentPosition[1]] = [xPos, yPos];

        // Increment command count
        commandData.maze.commandCount++;
      }
    }
  }
});

/**
 * Return the type and check if the tile is equal to the current position
 * @param type
 * @param rowIndex The Y position
 * @param tileIndex The X position
 */
const getType: (type: number, rowIndex: number, tileIndex: number) => number = (
  type: number,
  rowIndex: number,
  tileIndex: number
) => {
  return isCurrentPosition(rowIndex, tileIndex) ? 4 : type;
};
/**
 * Check if tile is equal to currentPosition of player
 * @param rowIndex
 * @param tileIndex
 */
const isCurrentPosition: (rowIndex: number, tileIndex: number) => boolean = (
  rowIndex: number,
  tileIndex: number
) => {
  return rowIndex === currentPosition[1] && tileIndex === currentPosition[0];
};
</script>

<script lang="ts">
import tile from 'components/Tile.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Matrix',
  components: { tile },
});
</script>

<style scoped>
#matrix {
  display: inline-block;
  border: 3px solid #f9b233;
  background-image: url('/logo.png');
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
}

#completed {
  width: 200px;
  height: 200px;
  background-image: url('/peepoCheer.gif');
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
}

.matrixRow {
  display: flex;
}
</style>
