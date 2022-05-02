<template>
  <div id="matrix" v-if="currentPosition.toString() !== endPosition.toString()">
    <div class="matrixRow" v-for="(row, rowIndex) in matrix" :key="rowIndex">
      <tile
        v-for="(tile, tileIndex) in row"
        :type="getType(tile, rowIndex, tileIndex)"
        :key="tileIndex"
      />
    </div>
  </div>
  <div v-else id="completed"/>
  <div>{{ commandData.maze.count }}</div>
</template>

<script lang="ts" setup>
import { client, prefix } from 'boot/tmi';
import MazeDirection from 'src/enums/MazeDirection';
import {reactive} from 'vue';

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
    count: 0
  }
});

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
      // Check matrix before doing anything
      if (!matrix.length) {
        return;
      } else {
        matrix.forEach((array) => {
          // Check all array lengths
          if (!array.length) {
            return;
          }
        });
      }
      const commandText = context.join(' ').toLowerCase();
      if (Object.values(MazeDirection).includes(<MazeDirection>commandText)) {
        // Command is found and valid, do whatever logic here
        let [xPos, yPos] = [currentPosition[0], currentPosition[1]];

        switch (commandText) {
          // UP command
          case MazeDirection.Up:
            /**
             * Don't go out of bounds
             * Don't go into walls
             */
            if (yPos === 0 || matrix[yPos - 1][xPos] === 1) {
              break;
            }
            yPos--;
            break;
          // DOWN command
          case MazeDirection.Down:
            /**
             * Don't go out of bounds
             * Don't go into walls
             */
            if (yPos === matrix.length - 1 || matrix[yPos + 1][xPos] === 1) {
              break;
            }
            yPos = yPos + 1;
            break;
          // RIGHT command
          case MazeDirection.Right:
            if (xPos === matrix.length - 1 || matrix[yPos][xPos + 1] === 1) {
              break;
            }
            xPos++;
            break;
          // LEFT command
          case MazeDirection.Left:
            if (xPos === 0 || matrix[yPos][xPos - 1] === 1) {
              break;
            }
            xPos--;
            break;
        }

        // Set new position
        [currentPosition[0], currentPosition[1]] = [xPos, yPos];
        // Increment command count
        commandData.maze.count++;
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
