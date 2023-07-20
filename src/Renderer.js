class Renderer {

    constructor(){

        this.canvas = document.createElement("canvas");
        this.refId = 0;
        this.frameCount = -1;
        this.timeDelta = -1;
        this.camera = null;

        let lastTimeStamp = -1;

        this.frameCallback = (timestamp) => {
            this.timeDelta = lastTimeStamp == -1 ? 0 : timestamp - lastTimeStamp;
            lastTimeStamp = timestamp;
            
            this.refId = requestAnimationFrame(this.frameCallback);
            this.frameCount++;

            this.beforeFrame(timestamp, this.timeDelta);
            this.OnFrame(timestamp, this.timeDelta);
        };

        
        this.resizeCallback = (event) => {
            const scalar = Math.min(devicePixelRatio, 1.5);

            this.canvas.width = this.canvas.clientWidth * scalar;
            this.canvas.height = this.canvas.clientHeight * scalar;

            if(this.canvas.width == 0 || this.canvas.height == 0){
                return;
            }

            const aspect = this.canvas.width / this.canvas.height;

            this.OnResize(this.canvas.width, this.canvas.height);
        }

        this.keydownCallback = (event) => {
            if(event.keyCode == 65){
                // A
                this.camera.processMovement(0, this.timeDelta);
            }
            if(event.keyCode == 68){
                // D
                this.camera.processMovement(1, this.timeDelta);
            }
            if(event.keyCode == 87){
                // W
                this.camera.processMovement(2, this.timeDelta);
            }
            if(event.keyCode == 83){
                // S
                this.camera.processMovement(3, this.timeDelta);
            }
        }

    }


    start(){
        window.addEventListener('resize', this.resizeCallback);
        window.addEventListener('keydown', this.keydownCallback);
        this.resizeCallback();
        this.refId = requestAnimationFrame(this.frameCallback);
    }


    async init(){
        // Override with renderer-specific resize logic.
    }

    OnResize(width, height){
        // Override with renderer-specific logic.
    }

    beforeFrame(){
        // Override with renderer-specific logic.
    }
    
    OnFrame(){
        // Override with renderer-specific logic.
    }

}

export {Renderer}