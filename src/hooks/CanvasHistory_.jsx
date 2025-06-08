import  * as fabric  from 'fabric';

class CanvasHistory {
  constructor(canvas) {
    this.canvas = canvas;
    this.history = [];
    this.historyRedo = [];
    this._isClearingCanvas = false; // Flag to avoid tracking during canvas clearing
    this._isUndoRedoing = false; // Flag to prevent recursive state saving during undo/redo
    
    this._init();
  }

  _init() {
    if (!this.canvas) return;
    
    // Save initial state after a short delay to ensure canvas is initialized
    setTimeout(() => {
      this._saveCanvasState(); // Save initial state
    }, 300);
    
    // Automatically save canvas state on object changes
    this.canvas.on("object:added", () => {
      if (!this._isUndoRedoing && !this._isClearingCanvas) {
        this._saveCanvasState();
      }
    });
    
    this.canvas.on("object:modified", () => {
      if (!this._isUndoRedoing && !this._isClearingCanvas) {
        this._saveCanvasState();
      }
    });
    
    this.canvas.on("object:removed", () => {
      if (!this._isUndoRedoing && !this._isClearingCanvas) {
        this._saveCanvasState();
      }
    });
  }

  _saveCanvasState() {
    // Clone objects array to avoid reference issues
    const jsonCanvas = JSON.parse(JSON.stringify(this.canvas.toObject().objects));
    
    // Clear redo stack when a new action is performed
    if (!this._isUndoRedoing) {
      this.historyRedo = [];
    }
    
    this.history.push(jsonCanvas);
    
    // For debugging
    console.log(`History updated: ${this.history.length} states, ${this.historyRedo.length} redo states`);
  }

  _clearCanvas() {
    this._isClearingCanvas = true;
    this.canvas.remove(...this.canvas.getObjects());
    this._isClearingCanvas = false;
  }

  async undo() {
    if (this.history.length <= 1) return; // Prevent undoing beyond the initial state
    
    this._isUndoRedoing = true;
    this._clearCanvas();

    // Move current state to redo stack
    this.historyRedo.push(this.history.pop());
    
    // Get previous state
    const lastState = this.history[this.history.length - 1];
    
    try {
      // Restore objects from the previous state
      const objects = await fabric.util.enlivenObjects(lastState);
      this._applyState(objects);
    } catch (error) {
      console.error('Error during undo:', error);
    } finally {
      this._isUndoRedoing = false;
    }
    
    // For debugging
    console.log(`Undo: ${this.history.length} states, ${this.historyRedo.length} redo states`);
  }

  async redo() {
    if (this.historyRedo.length === 0) return;
    
    this._isUndoRedoing = true;
    this._clearCanvas();

    // Get state from redo stack
    const redoState = this.historyRedo.pop();
    // Add it back to history
    this.history.push(redoState);
    
    try {
      // Restore objects from the redo state
      const objects = await fabric.util.enlivenObjects(redoState);
      this._applyState(objects);
    } catch (error) {
      console.error('Error during redo:', error);
    } finally {
      this._isUndoRedoing = false;
    }
    
    // For debugging
    console.log(`Redo: ${this.history.length} states, ${this.historyRedo.length} redo states`);
  }

  _applyState(objects) {
    // Add all objects from the state
    objects.forEach((obj) => {
      this.canvas.add(obj);
    });
    
    this.canvas.renderAll();
  }
  
  // Getters for UI state
  canUndo() {
    return this.history.length > 1;
  }
  
  canRedo() {
    return this.historyRedo.length > 0;
  }
  
  getHistoryStatus() {
    return {
      undoStates: this.history.length,
      redoStates: this.historyRedo.length
    };
  }
}

export default CanvasHistory;