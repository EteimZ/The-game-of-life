/**
 * @class Cell represents individual cell in game of life 
 */
class Cell{
    /**
     * set the size for each cell
     * @static
     * @property {number} width - width of the cell 
     * @property {number} height - height of the cell
     */
    static width = 10;
    static height = 10;

    /**
     * 
     * @param {CanvasRenderingContext2D} context - Canvas rendering context
     * @param {number} gridX - X position of the cell in the grid
     * @param {number} gridY - Y position of the cell in the grid
     */
    constructor(context, gridX, gridY){
        /**
         * Canvas rendering context
         * @member {CanvasRenderingContext2D}
         */
        this.context = context;

      /**
         * X position of the cell in the grid
         * @member {number} gridX
         * Y position of the cell in the grid
         * @member {number} gridY
         * 
         */
        this.gridX = gridX;
        this.gridY = gridY;

        /**
         * Determines if the cell is alive or dead
         * @member {boolean} alive
         */
        this.alive = Math.random() > 0.5;

        /**
         * Next state of the cell after checking the surrounding
         * @member {boolean} nextAlive
         */
        this.nextAlive = null;
    }


    /**
     * Draws the cell on the canvas
     * @method
     */
    draw() {
        // Draw a square and let the state determine its color
        this.context.fillStyle = this.alive ? 'black' : 'white';
        this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
    }
}

/**
 * @class GameWorld
 * @extends EventTarget
 */
export class GameWorld extends EventTarget{
    /**
     * @static
     * @property {number} numColumns - number of columns in the game world
     * @property {number} numRows - number of rows in the game world
     */

    static numColumns = 75;
    static numRows = 40;

    /**
     * @constructor
     * @param {string} canvasId - ID of the canvas element to be used as the game world
     */

    constructor(canvasId){

        super();

        /**
         * Canvas element used as the game world
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.getElementById(canvasId);
        
        /**
         * Canvas rendering context
         * @type {CanvasRenderingContext2D}
         */
        this.context = this.canvas.getContext('2d');

        /**
         *The array of game objects in the game world.
         *@type {Array<Cell>}
        */
        this.gameObjects = [];
        
        this.createGrid();

         /**
         * The number of generations
         * @type {number}
         */
        this.nGenerations = 0;
    }

     /**
     * Starts the game loop
     * @returns {void}
     */
    start(){
        this.animation = window.requestAnimationFrame( () => this.gameLoop() );
    }

    /**
     * Stops the game loop
     * @returns {void}
     */
    stop() {
        window.cancelAnimationFrame(this.animation);
        this.animation = null;
    }

    /**
     * Resets the game
     * @returns {void}
     */
    reset(){
        this.gameObjects = [];
                
        this.createGrid();

        this.nGenerations = 0;
    }


    /**
     * Creates the grid
     * @returns {void}
     */
    createGrid()
    {
        for (let y = 0; y < GameWorld.numRows; y++){
            for (let x = 0; x < GameWorld.numColumns; x++){
                this.gameObjects.push(new Cell(this.context, x, y));
            }
        }
    }

    /**
     * Check if the cell at the specified position is alive
     * @param {number} x - The x position of the cell
     * @param {number} y - The y position of the cell
     * @returns {number} - 1 if the cell is alive, 0 otherwise
     */
    isAlive(x, y)
    {
        if ( x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows){
            return false;
        }

        return this.gameObjects[this.gridToIndex(x, y)].alive?1:0;
    }

    /**
     * Converts a grid position to an index
     * @param {number} x - The x position of the cell
     * @param {number} y - The y position of the cell
     * @returns {number} - The index positions the grid
     */
    gridToIndex(x, y){
        return x + (y * GameWorld.numColumns);
    }

    /**
     * Check the cells surrounding and determine if it will survive to the next generation.
     * @returns {void}
     */
    checkSurrounding()
    {
        // Loop over all cells
        for (let x = 0; x < GameWorld.numColumns; x++){
            for (let y =0; y < GameWorld.numRows; y++){
                // Count the nearby population
                let numAlive = this.isAlive(x - 1, y - 1) + 
                               this.isAlive(x, y - 1) + 
                               this.isAlive(x + 1, y - 1) + 
                               this.isAlive(x - 1, y) + 
                               this.isAlive(x + 1, y) + 
                               this.isAlive(x - 1, y + 1) + 
                               this.isAlive(x, y + 1) + 
                               this.isAlive(x + 1, y + 1);
            
            
                let centerIndex = this.gridToIndex(x, y);
                
                // The rules of game of life 
                if (numAlive == 2){
                    // Do nothing
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                }else if (numAlive == 3){
                    // Come to live
                    this.gameObjects[centerIndex].nextAlive = true;
                }else{
                    // Die!
                    this.gameObjects[centerIndex].nextAlive = false;
                }

            }
        }

        // Apply the new state to the cells
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
        }

    }

    /**
     * Initiate the game and put it in a loop
     * @returns {void}
     */
    gameLoop()
    {
        // Check the surrounding of each cell
        this.checkSurrounding();

        // Clear the screen
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all the game objects
        for (let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].draw();
        }

        // increment generation
        this.nGenerations += 1;

        // dispatch current generation
        this.dispatchEvent(new CustomEvent("gen", {detail: this.nGenerations}));       

        // request new animation frame
        setTimeout( () => {
            if (this.animation) {
                this.animation = window.requestAnimationFrame(() => this.gameLoop());
            }
        }, 500);
    }
}