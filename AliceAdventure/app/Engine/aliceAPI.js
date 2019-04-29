const Alice = {
  Application: PIXI.Application,
  Object: PIXI.Sprite,
  Container: PIXI.Container,
  Texture: PIXI.Texture,
  Scene: PIXI.Container,
  Ticker: PIXI.ticker.Ticker,
  Text: PIXI.Text,
  AnimatedObject: PIXI.extras.AnimatedSprite,
  Sound: PIXI.sound
};

const baseURL = {
  requireAssets: './Resources/Assets/require/',
  nomalAssets: './Resources/Assets/'
};

class DebugSystem {
  constructor(_open) {
    this.open = _open;
  }

  log(info) {
    if (this.open) {
      window.console.log(info);
    }
  }
}

const debug = new DebugSystem(true);

class AliceReactionSystem {
  constructor(_game) {
    this.game = _game;
  }

  transitToScene(_sceneIndex) {
    this.game.sceneManager.jumpToScene(_sceneIndex);
  }

  addToInventory(_obj) {
    this.game.inventory.add(_obj);
    _obj.menu.removeAction('Get');
    if (this.game.clickToUse) {
      _obj.menu.addAction('Use', () => {
        _obj.isInUse = true;
        _obj.menu.setVisible(false);
        this.game.utilities.toFrontLayer(_obj);
      });
    }
  }

  removeObject(obj) {
    if (!obj.parent) return;
    obj.prevParent = obj.parent;
    obj.prevParent.removeChild(obj);
    obj.inInventory = false;
  }

  setObjInteractivity(obj, interactivity) {
    obj.interactive = interactivity;
    obj.buttonMode = interactivity;
  }

  makeInteractive(obj) {
    if (obj.interactive) return;
    this.setObjInteractivity(obj, true);
    // If clickToUse is true, then using invetory item will be
    // click, choose "use" option, then apply to the target. The
    // item will follow the mouse cursor.
    // If false, then using inventory item will be drag and drop.
    if (this.game.clickToUse) {
      obj
        .on('pointerdown', this.game.utilities.onMouseDownClick.bind(this, obj))
        .on('pointerup', this.game.utilities.onMouseUpClick.bind(this, obj))
        .on(
          'pointermove',
          this.game.utilities.onMouseMoveClick.bind(this, obj)
        );
    } else {
      obj
        .on('pointerdown', this.game.utilities.onMouseDown.bind(this, obj))
        .on('pointerup', this.game.utilities.onMouseUp.bind(this, obj))
        .on('pointermove', this.game.utilities.onMouseMove.bind(this, obj));
    }
  }

  makeNonInteractive(obj) {
    if (!obj.interactive) return;
    this.setObjInteractivity(obj, false);
    if (this.game.clickToUse) {
      obj
        .off(
          'pointerdown',
          this.game.utilities.onMouseDownClick.bind(this, obj)
        )
        .off('pointerup', this.game.utilities.onMouseUpClick.bind(this, obj))
        .off(
          'pointermove',
          this.game.utilities.onMouseMoveClick.bind(this, obj)
        );
    } else {
      obj
        .off('pointerdown', this.game.utilities.onMouseDown.bind(this, obj))
        .off('pointerup', this.game.utilities.onMouseUp.bind(this, obj))
        .off('pointermove', this.game.utilities.onMouseMove.bind(this, obj));
    }
  }

  updateObjInteractivity(obj) {
    if (obj.dragable || obj.clickable) {
      this.makeInteractive(obj);
    } else {
      this.makeNonInteractive(obj);
    }
  }

  makeClickable(obj) {
    obj.clickable = true;
    this.updateObjInteractivity(obj);
  }

  makeUnClickable(obj) {
    obj.clickable = false;
    this.updateObjInteractivity(obj);
  }

  makeDraggable(obj) {
    obj.dragable = true;
    this.updateObjInteractivity(obj);
  }

  makeUnDraggable(obj) {
    obj.dragable = false;
    this.updateObjInteractivity(obj);
  }

  // Add 'look at' option for the object which has description.
  showObjectDescription(obj) {
    if (obj.description !== '' && obj.description !== null) {
      this.game.puzzleSystem.createMenu.call(this, obj);
      obj.menu.addAction('LookAt', () => {
        myGame.messageBox.startConversation([obj.description], null);
        obj.menu.setVisible(false);
      });

      obj.on('pointerover', () => {
        obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
      });
      obj.on('pointerout', () => {
        obj.filters = [];
      });
    }
  }

  // Add 'talk to' option for the object which has conversation.
  showObjectConversation(obj) {
    if (obj.conversation !== '' && obj.conversation !== null) {
      this.game.puzzleSystem.createMenu.call(this, obj);
      obj.menu.addAction('TalkTo', () => {
        myGame.messageBox.startConversation(
          [`<gameObj>${obj.name}</gameObj>: ${obj.conversation}`],
          null
        );
        obj.menu.setVisible(false);
      });

      obj.on('pointerover', () => {
        obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
      });
      obj.on('pointerout', () => {
        obj.filters = [];
      });
    }
  }
}

class AlicePuzzleSystem {
  constructor(_game) {
    this.game = _game;
  }

  // If a puzzle is set as winning condition, this method will call
  showWinningState(sceneIndex) {
    setTimeout(() => {
      this.game.soundManager.play('win');
      const win = new Alice.Object.fromImage(`${baseURL.requireAssets}win.png`);
      win.name = 'Win';
      win.anchor.set(0.5, 0.5);
      win.x = 512;
      win.y = 288;
      win.scale.set(0.8, 0.8);
      this.game.reactionSystem.makeClickable(win);
      this.game.reactionSystem.makeUnDraggable(win);
      if (sceneIndex >= 0) this.game.scene(sceneIndex).addChild(win);
    }, 2000);
  }

  // Create menu for obj.
  createMenu(obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, 'menu')) {
      obj.menu = new Menu(this.game, obj);
      this.game.stage.addChild(obj.menu.holder);
      obj.DIY_CLICK = () => {
        if (!obj.menu.holder.visible) {
          obj.menu.setVisible(true);
          obj.menu.resetPos(
            obj,
            obj.x,
            obj.y
            //this.game.renderer.plugins.interaction.mouse.global
          );
        }
      };
    }
  }

  // Puzzle of go to a scene through an unlocked door.
  doorPuzzle(toSceneId, doorObj, isWinning = false, sound = null) {
    this.game.puzzleSystem.createMenu.call(this, doorObj);
    doorObj.menu.addAction('Enter', () => {
      this.game.reactionSystem.transitToScene(toSceneId);
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      doorObj.menu.setVisible(false);
      if (isWinning) {
        this.showWinningState(toSceneId);
      }
    });

    doorObj.on('pointerover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('pointerout', () => {
      doorObj.filters = [];
    });
  }

  // Puzzle of go to a scene through a key-locked door.
  keyLockDoorPuzzle(
    toSceneId,
    doorObj,
    keyObj,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, doorObj);
    doorObj.locked = true;
    doorObj.menu.addAction('Enter', () => {
      if (doorObj.locked) {
        this.game.messageBox.startConversation([
          `<gameObj>${doorObj.name}</gameObj> is locked.`
        ]);
      } else {
        this.game.reactionSystem.transitToScene(toSceneId);
        // Play sound
        if (isWinning) {
          this.showWinningState(toSceneId);
        }
      }
      doorObj.menu.setVisible(false);
    });
    this.game.eventSystem.addUsedEvent(keyObj, doorObj, () => {
      doorObj.locked = false;
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      this.game.reactionSystem.removeObject(keyObj);
      this.game.messageBox.startConversation([
        `<gameObj>${doorObj.name}</gameObj> is unlocked.`
      ]);
    });

    doorObj.on('pointerover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('pointerout', () => {
      doorObj.filters = [];
    });
  }

  // Puzzle of go to a scene through a password-locked door.
  passwordLockDoorPuzzle(
    toSceneId,
    doorObj,
    password,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, doorObj);
    doorObj.locked = true;
    const passwordInput = new PasswordInput(this.game);
    const input = passwordInput.input;
    this.game.stage.addChild(passwordInput.holder);

    doorObj.menu.addAction('Enter', () => {
      if (doorObj.locked) {
        if (!passwordInput.holder.visible) {
          passwordInput.setVisible(true);
          input._onSurrogateFocus();
        } else {
          passwordInput.setVisible(false);
        }
      } else {
        this.game.reactionSystem.transitToScene(toSceneId);
        // Play sound
        if (isWinning) {
          this.showWinningState(toSceneId);
        }
      }
      doorObj.menu.setVisible(false);
    });
    input.on('keydown', event => {
      let flag = false;
      if (event === 13) {
        if (input.text === password) {
          input.placeholder = 'Correct!';
          input._placeholderColor = 0x00ff00;
          flag = true;
        } else {
          input.placeholder = 'Incorrect!';
          input._placeholderColor = 0xff0000;
        }
        input.text = '';
        input.disabled = true;
        setTimeout(() => {
          if (flag) {
            passwordInput.setVisible(false);
            doorObj.locked = false;
            if (sound === null) this.game.soundManager.play('good');
            else this.game.soundManager.play(sound);
            this.game.messageBox.startConversation([
              `<gameObj>${doorObj.name}</gameObj> is unlocked.`
            ]);
          }
          input.disabled = false;
          input._placeholderColor = 0xa9a9a9;
          input.placeholder = 'Enter Password:';
          input._onSurrogateFocus();
        }, 500);
      }
    });
    this.game.stage.removeChild(input.holder);
    // delete(input);

    doorObj.on('pointerover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('pointerout', () => {
      doorObj.filters = [];
    });
  }

  // Puzzle of go to a scene through a guarded door.
  bribeGuardDoorPuzzle(
    toSceneId,
    doorObj,
    guardObj,
    itemToBribe,
    isWinning = false,
    sound = false
  ) {
    this.game.puzzleSystem.createMenu.call(this, doorObj);
    doorObj.guarded = true;
    doorObj.menu.addAction('Enter', () => {
      if (doorObj.guarded) {
        this.game.messageBox.startConversation([
          `${guardObj.name}: You can't go through this <gameObj>${
            doorObj.name
          }</gameObj>.`
        ]);
      } else {
        this.game.reactionSystem.transitToScene(toSceneId);
        // Play sound
        if (isWinning) {
          this.showWinningState(toSceneId);
        }
      }
      doorObj.menu.setVisible(false);
    });
    this.game.eventSystem.addUsedEvent(itemToBribe, guardObj, () => {
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      this.game.messageBox.startConversation([
        `${guardObj.name}: OK, you can go through this <gameObj>${
          doorObj.name
        }</gameObj> now.`
      ]);
      this.game.reactionSystem.removeObject(itemToBribe);
      this.game.reactionSystem.removeObject(guardObj);
      doorObj.guarded = false;
    });

    guardObj.on('pointerover', () => {
      guardObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    guardObj.on('pointerout', () => {
      guardObj.filters = [];
    });

    doorObj.on('pointerover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('pointerout', () => {
      doorObj.filters = [];
    });
  }

  // Puzzle of go to a scene through a switch-locked door.
  switchDoorPuzzle(
    toSceneId,
    doorObj,
    switchObj,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, doorObj);
    doorObj.locked = true;
    doorObj.menu.addAction('Enter', () => {
      if (doorObj.locked) {
        this.game.messageBox.startConversation([
          `<gameObj>${doorObj.name}</gameObj> is locked.`
        ]);
      } else {
        this.game.reactionSystem.transitToScene(toSceneId);
        // Play sound
        if (isWinning) {
          this.showWinningState(toSceneId);
        }
      }
      doorObj.menu.setVisible(false);
    });

    this.game.puzzleSystem.createMenu.call(this, switchObj);
    switchObj.menu.addAction('Use', () => {
      doorObj.locked = false;
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      this.game.messageBox.startConversation([
        `<gameObj>${doorObj.name}</gameObj> is unlocked.`
      ]);
      switchObj.menu.setVisible(false);
    });

    doorObj.on('pointerover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('pointerout', () => {
      doorObj.filters = [];
    });

    switchObj.on('pointerover', () => {
      switchObj.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    switchObj.on('pointerout', () => {
      switchObj.filters = [];
    });
  }

  // Puzzle of destroy an object. Not used in current version.
  destroyObjectPuzzle(objToDestroy, destroyer) {
    // TO DO: has not been updated for a long time. Use other working puzzle methods as reference.
    this.game.eventSystem.addUsedEvent(destroyer, objToDestroy, () => {
      this.game.reactionSystem.removeObject(objToDestroy);
      this.game.reactionSystem.removeObject(destroyer);
    });
  }

  // Puzzle of let a character say something. Not used in current version.
  letCharacterSayPuzzle(charObj, itemToGive, dialogueToSay) {
    // TO DO: has not been updated for a long time. Use other working puzzle methods as reference.
    this.game.puzzleSystem.createMenu.call(this, charObj);
    this.game.eventSystem.addUsedEvent(itemToGive, charObj, () => {
      this.game.messageBox.startConversation([dialogueToSay]);
      this.game.reactionSystem.removeObject(itemToGive);
      charObj.menu.addAction('TalkTo', () => {
        this.game.messageBox.startConversation([dialogueToSay]);
        this.game.reactionSystem.removeObject(itemToGive);
        charObj.menu.setVisible(false);
      });
    });
  }

  // Puzzle of get an item by picking it up.
  getItemPuzzle(obj, isWinning = false, sound = null) {
    this.game.puzzleSystem.createMenu.call(this, obj);
    obj.menu.addAction('Get', () => {
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      this.game.reactionSystem.addToInventory(obj);
      obj.menu.setVisible(false);
      if (isWinning) {
        const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
          this.game.sceneManager.getCurrentScene()
        );
        this.showWinningState(sceneIndex);
      }
    });

    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });
  }

  // Puzzle of get an item from an unlocked container.
  getItemFromContainerPuzzle(obj, container, isWinning = false, sound = null) {
    this.game.puzzleSystem.createMenu.call(this, container);
    container.collected = false;
    container.menu.addAction('Open', () => {
      if (container.content.length !== 0) {
        container.content.forEach(c => {
          if (c === obj) {
            this.game.puzzleSystem.createMenu.call(this, c);
            if (sound === null) this.game.soundManager.play('good');
            else this.game.soundManager.play(sound);
            this.game.reactionSystem.addToInventory(c);
            container.content.splice(container.content.indexOf(obj), 1);
          }
        });
        container.collected = true;
        if (isWinning) {
          const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
            this.game.sceneManager.getCurrentScene()
          );
          this.showWinningState(sceneIndex);
        }
      } else if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `<gameObj>${container.name}</gameObj> is empty.`
        ]);
      container.menu.setVisible(false);
    });

    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });

    container.on('pointerover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('pointerout', () => {
      container.filters = [];
    });
  }

  // Puzzle of get an item from a key-locked container.
  getItemFromKeyLockContainerPuzzle(
    obj,
    container,
    keyObj,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, container);
    let locked = true;
    container.collected = false;
    container.menu.addAction('Open', () => {
      if (locked) {
        if (this.game.messageBox.messageBuffer.length === 0)
          this.game.messageBox.startConversation([
            `<gameObj>${container.name}</gameObj> is locked.`
          ]);
      } else if (
        container.content.length === 0 &&
        this.game.messageBox.messageBuffer.length === 0
      )
        this.game.messageBox.startConversation([
          `<gameObj>${container.name}</gameObj> is empty.`
        ]);
      container.menu.setVisible(false);
    });
    this.game.eventSystem.addUsedEvent(keyObj, container, () => {
      locked = false;
      this.game.reactionSystem.removeObject(keyObj);
      if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `<gameObj>${container.name}</gameObj> is unlocked.`
        ]);
      container.content.forEach(c => {
        if (c === obj) {
          if (sound === null) this.game.soundManager.play('good');
          else this.game.soundManager.play(sound);
          this.game.puzzleSystem.createMenu.call(this, c);
          this.game.reactionSystem.addToInventory(c);
          container.content.splice(container.content.indexOf(obj), 1);
        }
      });
      container.collected = true;
      if (isWinning) {
        const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
          this.game.sceneManager.getCurrentScene()
        );
        this.showWinningState(sceneIndex);
      }
    });

    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });

    container.on('pointerover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('pointerout', () => {
      container.filters = [];
    });
  }

  // Puzzle of get an item from a password-locked container.
  getItemFromPasswordLockContainerPuzzle(
    obj,
    container,
    password,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, container);
    let locked = true;
    container.collected = false;
    let input = null;
    if (container.passwordInput === undefined) {
      container.passwordInput = new PasswordInput(this.game);
      input = container.passwordInput.input;
      this.game.stage.addChild(container.passwordInput.holder);
      container.menu.addAction('Open', () => {
        if (locked) {
          if (!container.passwordInput.holder.visible) {
            container.passwordInput.setVisible(true);
            input._onSurrogateFocus();
          } else {
            container.passwordInput.setVisible(false);
          }
        } else if (
          container.content.length === 0 &&
          this.game.messageBox.messageBuffer.length === 0
        )
          this.game.messageBox.startConversation([
            `<gameObj>${container.name}</gameObj> is empty.`
          ]);
        container.menu.setVisible(false);
      });
      input.on('keydown', event => {
        let flag = false;
        if (event === 13) {
          if (
            Object.keys(container.passwordInput.passwords).find(
              p => p === input.text
            )
          ) {
            input.placeholder = 'Correct!';
            input._placeholderColor = 0x00ff00;
            flag = true;
          } else {
            input.placeholder = 'Incorrect!';
            input._placeholderColor = 0xff0000;
          }
          const p = input.text;
          input.text = '';
          input.disabled = true;

          setTimeout(() => {
            if (flag) {
              container.passwordInput.setVisible(false);
              if (this.game.messageBox.messageBuffer.length === 0)
                this.game.messageBox.startConversation([
                  `<gameObj>${container.name}</gameObj> is unlocked.`
                ]);
              for (
                let i = 0;
                i < container.passwordInput.passwords[p].length;
                i += 1
              ) {
                const contentObj = container.passwordInput.passwords[p][i];
                container.content.forEach(c => {
                  if (c === contentObj) {
                    if (sound === null) this.game.soundManager.play('good');
                    else this.game.soundManager.play(sound);
                    this.game.puzzleSystem.createMenu.call(this, c);
                    this.game.reactionSystem.addToInventory(c);
                    container.content.splice(
                      container.content.indexOf(contentObj),
                      1
                    );
                  }
                });
              }
              if (container.content.length === 0) {
                locked = false;
              }
              if (isWinning) {
                const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
                  this.game.sceneManager.getCurrentScene()
                );
                this.showWinningState(sceneIndex);
              }
            }
            input.disabled = false;
            input._placeholderColor = 0xa9a9a9;
            input.placeholder = 'Enter Password:';
            input._onSurrogateFocus();
          }, 500);
        }
      });
    } else {
      input = container.passwordInput.input;
    }
    if (Object.keys(container.passwordInput.passwords).includes(password)) {
      container.passwordInput.passwords[password].push(obj);
    } else {
      container.passwordInput.passwords[password] = [obj];
    }
    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });

    container.on('pointerover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('pointerout', () => {
      container.filters = [];
    });
  }

  // Puzzle of get an item from a guarded container.
  getItemFromBribeGuardContainerPuzzle(
    obj,
    container,
    guardObj,
    itemToBribe,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, container);
    container.guarded = true;
    container.collected = false;
    container.menu.addAction('Open', () => {
      if (
        container.guarded &&
        this.game.messageBox.messageBuffer.length === 0
      ) {
        this.game.messageBox.startConversation([
          `${guardObj.name}: You can't touch this <gameObj>${
            container.name
          }</gameObj>.`
        ]);
      } else if (container.content.length !== 0) {
        container.content.forEach(c => {
          if (c === obj) {
            if (sound === null) this.game.soundManager.play('good');
            else this.game.soundManager.play(sound);
            this.game.puzzleSystem.createMenu.call(this, c);
            this.game.reactionSystem.addToInventory(c);
            container.content.splice(container.content.indexOf(obj), 1);
          }
        });
        container.collected = true;
        if (isWinning) {
          const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
            this.game.sceneManager.getCurrentScene()
          );
          this.showWinningState(sceneIndex);
        }
      } else if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `<gameObj>${container.name}</gameObj> is empty.`
        ]);
      container.menu.setVisible(false);
    });
    this.game.eventSystem.addUsedEvent(itemToBribe, guardObj, () => {
      if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `${guardObj.name}: OK, you can open the <gameObj>${
            container.name
          }</gameObj> now.`
        ]);
      this.game.reactionSystem.removeObject(itemToBribe);
      this.game.reactionSystem.removeObject(guardObj);
      container.guarded = false;
    });

    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });

    container.on('pointerover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('pointerout', () => {
      container.filters = [];
    });

    guardObj.on('pointerover', () => {
      guardObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    guardObj.on('pointerout', () => {
      guardObj.filters = [];
    });
  }

  // Puzzle of get an item from a switch-locked container.
  getItemFromSwitchContainerPuzzle(
    obj,
    container,
    switchObj,
    isWinning = false,
    sound = null
  ) {
    this.game.puzzleSystem.createMenu.call(this, container);
    let locked = true;
    container.collected = false;
    container.menu.addAction('Open', () => {
      if (locked) {
        if (this.game.messageBox.messageBuffer.length === 0)
          this.game.messageBox.startConversation([
            `<gameObj>${container.name}</gameObj> is locked.`
          ]);
      } else if (container.content.length !== 0) {
        container.content.forEach(c => {
          if (c === obj) {
            if (sound === null) this.game.soundManager.play('good');
            else this.game.soundManager.play(sound);
            this.game.puzzleSystem.createMenu.call(this, c);
            this.game.reactionSystem.addToInventory(c);
            container.content.splice(container.content.indexOf(obj), 1);
          }
        });
        container.collected = true;
        if (isWinning) {
          const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
            this.game.sceneManager.getCurrentScene()
          );
          this.showWinningState(sceneIndex);
        }
      } else if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `<gameObj>${container.name}</gameObj> is empty.`
        ]);
      container.menu.setVisible(false);
    });

    this.game.puzzleSystem.createMenu.call(this, switchObj);
    switchObj.menu.addAction('Use', () => {
      locked = false;
      if (sound === null) this.game.soundManager.play('good');
      else this.game.soundManager.play(sound);
      if (this.game.messageBox.messageBuffer.length === 0)
        this.game.messageBox.startConversation([
          `<gameObj>${switchObj.name}</gameObj> is toggled.`
        ]);
      switchObj.menu.setVisible(false);
    });

    obj.on('pointerover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      obj.filters = [];
    });

    container.on('pointerover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('pointerout', () => {
      container.filters = [];
    });

    switchObj.on('pointerover', () => {
      switchObj.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    switchObj.on('pointerout', () => {
      switchObj.filters = [];
    });
  }

  // Puzzle of get an item by trading with a character.
  getItemFromTradeCharacterPuzzle(
    obj,
    charObj,
    tradeObj,
    isWinning = false,
    sound = null
  ) {
    this.game.eventSystem.addUsedEvent(tradeObj, charObj, () => {
      if (charObj.content.length !== 0) {
        for (const c of charObj.content) {
          if (c === obj) {
            this.game.messageBox.startConversation([
              `Thanks! Here is your <gameObj>${obj.name}</gameObj>.`
            ]);
            if (sound === null) this.game.soundManager.play('good');
            else this.game.soundManager.play(sound);
            this.game.reactionSystem.removeObject(tradeObj);
            this.game.puzzleSystem.createMenu.call(this, c);
            this.game.reactionSystem.addToInventory(c);
            charObj.content.splice(charObj.content.indexOf(obj), 1);
            break;
          }
        }
        if (isWinning) {
          const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
            this.game.sceneManager.getCurrentScene()
          );
          this.showWinningState(sceneIndex);
        }
      }
    });

    obj.on('pointerover', () => {
      charObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('pointerout', () => {
      charObj.filters = [];
    });
  }

  // Puzzle of get an item by combining two items. Not used in current version.
  combineItemPuzzle(product, ingredient1, ingredient2) {
    // TO DO: has not been updated for a long time. Use other working puzzle methods as reference.
    this.game.puzzleSystem.createMenu.call(this, product);
    this.game.eventSystem.addCombineEvent(ingredient1, ingredient2, () => {
      this.game.reactionSystem.addToInventory(product);
      this.game.reactionSystem.removeObject(ingredient1);
      this.game.reactionSystem.removeObject(ingredient2);
      product.visible = true;
    });

    product.on('pointerover', () => {
      product.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    product.on('pointerout', () => {
      product.filters = [];
    });
  }
}

class AliceEventSystem {
  constructor() {
    this.template = {
      use: ' is used on ',
      combine: ' is combined with ',
      observe: ' is observed ',
      state: ' is changed to ',
      transit: ' transit to '
    };

    this.emptySprite = new Alice.Object();
    this.eventMessageList = {};
  }

  addEvent(msg, fn) {
    debug.log(`msg: ${msg}`);
    this.eventMessageList[msg] = true;
    this.emptySprite.on(msg, fn);
  }

  addUsedEvent(objA, objB, fn) {
    const eventMessage = `${objA.name}${this.template.use}${objB.name}`;
    this.addEvent(eventMessage, fn);
  }

  addCombineEvent(objA, objB, fn) {
    const eventMessageA = `${objA.name}${this.template.combine}${objB.name}`;
    this.addEvent(eventMessageA, fn);
    const eventMessageB = `${objB.name}${this.template.combine}${objA.name}`;
    this.addEvent(eventMessageB, fn);
  }

  addObserveEvent(obj, fn) {
    const eventMessage = `${obj.name}${this.template.observe}`;
    this.addEvent(eventMessage, fn);
  }

  addStateEvent(fromState, toState, fn) {
    const eventMessage = `${fromState}${this.template.state}${toState}`;
    this.addEvent(eventMessage, fn);
  }

  addSceneTransitEvent(scene, fn) {
    const eventMessage = `${this.template.transit}${scene}`;
    this.addEvent(eventMessage, fn);
  }

  checkEventExist(msg) {
    if (
      this.eventMessageList[msg] === undefined ||
      this.eventMessageList[msg] === false
    ) {
      return false;
    }
    return true;
  }

  callEvent(msg) {
    this.emptySprite.emit(msg);
  }
}

class Inventory {
  constructor(game) {
    this.game = game;
    this.inventory_area = {
      x1: game.screenWidth,
      x2: game.screenWidth + game.inventoryWidth,
      y1: 0,
      y2: game.screenHeight
    };

    // Size numbers
    this.inventory_w = game.inventoryWidth;
    this.inventory_size = game.inventorySize;
    this.gridStartY = game.inventoryWidth / 2;
    this.baseX = game.screenWidth + this.inventory_w / 2;
    this.baseY =
      game.screenHeight / (this.inventory_size + 1) / 2 + this.gridStartY;

    // What is this?
    this.magic_scale = 0.8;

    // Pixi elements
    this.inventoryContainer = new PIXI.Container();
    this.inventoryBackgroundGrp = new PIXI.Container();
    const backgroundScale = this.inventory_w / 144;

    this.inventUp = Alice.Object.fromImage(`${baseURL.requireAssets}up.png`);
    this.inventUp.scale.set(backgroundScale);
    this.inventUp.x = game.screenWidth;
    this.inventUp.y = 0;
    this.inventUp.interactive = true;
    this.inventUp.buttonMode = true;
    this.inventUp.on('click', () => {
      game.inventory.prevPage();
    });
    this.inventoryBackgroundGrp.addChild(this.inventUp);

    for (let i = 0; i < this.inventory_size; i += 1) {
      const inventBack = Alice.Object.fromImage(
        `${baseURL.requireAssets}inventory.png`
      );
      inventBack.scale.set(backgroundScale);
      inventBack.x = game.screenWidth;
      inventBack.y = this.gridStartY + i * this.inventory_w;
      this.inventoryBackgroundGrp.addChild(inventBack);
    }

    this.inventDown = Alice.Object.fromImage(
      `${baseURL.requireAssets}down.png`
    );
    this.inventDown.scale.set(backgroundScale);
    this.inventDown.x = game.screenWidth;
    this.inventDown.y =
      this.gridStartY + this.inventory_size * this.inventory_w;
    this.inventDown.interactive = true;
    this.inventDown.buttonMode = true;
    this.inventDown.on('click', () => {
      game.inventory.nextPage();
    });
    this.inventoryBackgroundGrp.addChild(this.inventDown);

    this.page = 0;

    this.update();
  }

  scaleDown(tool) {
    // When scene object is added to the inventory, scale it.
    tool.scale.set(1);
    const scale = Math.min(
      this.inventory_w / tool.width,
      this.inventory_w / tool.height
    );
    tool.scale.set(scale * this.magic_scale);
  }

  isInsideInventory(tool) {
    if (
      this.inventoryContainer.children.findIndex(
        element => element.name === tool.name
      ) < 0
    ) {
      return false;
    }
    return true;
  }

  add(tool) {
    if (this.isInsideInventory(tool)) {
      return;
    }
    // remove tool from the original scene and add to inventory container
    this.inventoryContainer.addChild(tool); // [INTERESTING: remove it from the original container]
    this.scaleDown(tool);
    if (!this.game.clickToUse) this.game.reactionSystem.makeDraggable(tool);

    tool.inInventory = true;
    this.page = Math.floor((this.countValidObj() - 1) / 5);
    this.update();
    this.game.messageBox.startConversation([
      `You got <gameObj>${tool.name}</gameObj>.`
    ]);
  }

  update() {
    // Weird
    let count = 0;
    this.inventoryContainer.children.forEach(element => {
      if (!element.visible) return;

      element.x = this.baseX;
      const offset = count % 5;
      const inPage = Math.floor(count / 5);
      element.y =
        this.baseY +
        offset * this.inventory_w -
        (this.page - inPage) * this.game.screenHeight;
      element.inventPos = { x: element.x, y: element.y };
      count += 1;
    });
    this.updateArrow();
  }

  countValidObj() {
    return this.inventoryContainer.children.filter(element => element.visible)
      .length;
  }

  hasNextPage() {
    return this.countValidObj() > (this.page + 1) * this.inventory_size;
  }

  hasPrevPage() {
    return this.page > 0;
  }

  nextPage() {
    if (this.hasNextPage) {
      this.page += 1;
      this.update();
    }
  }

  prevPage() {
    if (this.hasPrevPage) {
      this.page -= 1;
      this.update();
    }
  }

  updateArrow() {
    this.inventUp.interactive = this.hasPrevPage();
    this.inventDown.interactive = this.hasNextPage();
  }
}

class SoundManager {
  constructor() {
    this.sound = PIXI.sound;
    this.baseURL = './Resources/Assets/require/sound/';
    this.initSystemSound();
  }

  initSystemSound() {
    this.sound.add('add', `${this.baseURL}add.wav`);
    this.sound.add('good', `${this.baseURL}use_good.wav`);
    this.sound.add('bad', `${this.baseURL}use_bad.wav`);
    this.sound.add('win', `${this.baseURL}win.wav`);
  }

  play(name, loop) {
    this.sound.play(name, { loop });
  }

  stop(name) {
    this.sound.stop(name);
  }

  load(name, url) {
    this.sound.add(name, url);
  }
}

// For password related puzzle, the input text box for it.
class PasswordInput {
  constructor(_game) {
    this.game = _game;
    this.passwords = {};
    this.input = new PIXI.TextInput(
      {
        fontSize: '18px',
        padding: '11px',
        width: '150px',
        color: '#26272E'
      },
      {
        default: {
          fill: 0xffffff,
          rounded: 16,
          stroke: { color: 0xbfbfbf, width: 4 }
        },
        focused: {
          fill: 0xffffff,
          rounded: 16,
          stroke: { color: 0xbfbfbf, width: 4 }
        },
        disabled: { fill: 0xdbdbdb, rounded: 16 }
      }
    );

    this.input.placeholder = 'Enter Password';
    this.input.x = this.game.screenWidth / 2 - 75;
    this.input.y = this.game.screenHeight / 2;

    this.pointArea = new PIXI.Sprite();
    this.pointArea.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.screenWidth + this.game.inventoryWidth,
      this.game.screenHeight
    );
    this.pointArea.interactive = true;
    this.pointArea.buttonMode = true;
    this.pointArea.on('pointerdown', () => {
      this.setVisible(false);
    });

    this.holder = new Alice.Container();
    this.holder.addChild(this.pointArea);
    this.holder.addChild(this.input);
    this.holder.visible = false;
  }

  setPassword(_password) {
    this.password = _password;
  }

  setVisible(_visible) {
    this.holder.visible = _visible;
    this.input.text = '';
  }
}

// The menu of interactable objects in the scene.
class Menu {
  // obj = the object to interact with
  constructor(game, obj) {
    this.game = game;
    this.obj = obj;
    this.actions = {};

    this.pointArea = new PIXI.Sprite();
    this.pointArea.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.screenWidth + this.game.inventoryWidth,
      this.game.screenHeight
    );
    this.pointArea.interactive = true;
    this.pointArea.buttonMode = true;
    this.pointArea.on('pointerdown', () => {
      this.setVisible(false);
    });

    this.holder = new Alice.Container();
    this.holder.addChild(this.pointArea);

    // Add menu options here. Order will affect the options order in game.
    this.createActionPanel('LookAt', './Resources/Assets/require/look_at.png');
    this.createActionPanel('Get', './Resources/Assets/require/get.png');
    this.createActionPanel('Use', './Resources/Assets/require/use.png');
    this.createActionPanel('Open', './Resources/Assets/require/open.png');
    this.createActionPanel('Enter', './Resources/Assets/require/enter.png');
    this.createActionPanel('TalkTo', './Resources/Assets/require/talk_to.png');

    this.holder.visible = false;
  }

  // name: name of the menu option. must be unique.
  // imageLoc: image directory of this menu option.
  createActionPanel(name, imageLoc) {
    const action = new PIXI.Sprite.fromImage(imageLoc);
    action.anchor.x = 0.5;
    action.anchor.y = 0.5;
    action.interactive = true;
    action.buttonMode = true;
    action.visible = false;
    this.actions[name] = action;
    this.holder.addChild(this.actions[name]);
  }

  addAction(actionName, callback) {
    switch (actionName) {
      case 'Get':
        this.actions.Get.addListener('pointerdown', callback);
        this.actions.Get.visible = true;
        break;
      case 'Use':
        this.actions.Use.addListener('pointerdown', callback);
        this.actions.Use.visible = true;
        break;
      case 'Open':
        this.actions.Open.addListener('pointerdown', callback);
        this.actions.Open.visible = true;
        break;
      case 'Enter':
        this.actions.Enter.addListener('pointerdown', callback);
        this.actions.Enter.visible = true;
        break;
      case 'LookAt':
        this.actions.LookAt.addListener('pointerdown', callback);
        this.actions.LookAt.visible = true;
        break;
      case 'TalkTo':
        this.actions.TalkTo.addListener('pointerdown', callback);
        this.actions.TalkTo.visible = true;
        break;
      default:
        console.log(`${actionName} Invalid action verb`);
        break;
    }
  }

  // Only make the option invisible but not actually remove it.
  removeAction(actionName) {
    switch (actionName) {
      case 'Get':
        this.actions.Get.visible = false;
        break;
      case 'Use':
        this.actions.Use.visible = false;
        break;
      case 'Open':
        this.actions.Open.visible = false;
        break;
      case 'Enter':
        this.actions.Enter.visible = false;
        break;
      case 'LookAt':
        this.actions.LookAt.visible = false;
        break;
      case 'TalkTo':
        this.actions.TalkTo.visible = false;
        break;
      default:
        console.log('Invalid action verb');
        break;
    }
  }

  setVisible(_visible) {
    this.holder.visible = _visible;
  }

  resetPos(obj, posX, posY) {
    let offsetIndex = 0;
    let increment = 1;
    if (this.game.inventory.isInsideInventory(obj)) increment = -1;

    // Remember to sort reversely after if is inside inventory.
    // Not yet implemented. Otherwise the order of options for object
    // in inventory will be reversed.

    for (const action in this.actions) {
      if (this.actions[action].visible) {
        this.actions[action].position = new PIXI.Point(
          posX + offsetIndex * 102,
          posY
        );
        offsetIndex += increment;
      }
    }
  }
}

class SceneManager {
  constructor(game) {
    this.currentScene = {};
    this.game = game;
    this.sceneContainer = new PIXI.Container();
  }

  getCurrentScene() {
    return this.currentScene;
  }

  getSceneByIndex(index) {
    return this.sceneContainer.getChildAt(index);
  }

  createScenes(num) {
    for (let i = 0; i < num; i += 1) {
      this.addScene(new Alice.Scene());
    }
  }

  addScene(scene) {
    this.sceneContainer.addChild(scene);
    scene.visible = false;
  }

  jumpToScene(sceneIndex) {
    this.game.messageBox.stopConversation();
    const message = `${this.game.eventSystem.template.transit}${sceneIndex}`;
    this.game.eventSystem.callEvent(message);

    const toScene = this.sceneContainer.getChildAt(sceneIndex);
    if (this.currentScene) {
      this.currentScene.visible = false;
    }
    toScene.visible = true;
    this.currentScene = toScene;
  }

  start(index) {
    this.jumpToScene(index);
  }
}

class Utilities {
  constructor(game) {
    this.game = game;

    // click and drag mouse events
    this.onMouseDown = (obj, event) => {
      if (obj.mouseIsDown) return;
      obj.data = event.data;

      obj.mouseIsDown = true;
      obj.original = [obj.x, obj.y];
      obj.offset = {
        x: obj.data.getLocalPosition(obj.parent).x - obj.x,
        y: obj.data.getLocalPosition(obj.parent).y - obj.y
      };
      obj.dragStart = false;
    };

    this.onMouseDownClick = (obj, event) => {
      if (obj.mouseIsDown) return;
      obj.mouseIsDown = true;
      if (obj.isInUse) {
        game.utilities.toOriginalLayer(obj);
        obj.isInUse = false;
        game.emitDropEventOfObj(obj);
        game.inventory.update();
        obj.alpha = 1;
      }
    };

    this.onMouseMove = obj => {
      if (obj.mouseIsDown && obj.dragable) {
        obj.newPosition = obj.data.getLocalPosition(obj.parent);
        const toX = obj.newPosition.x - obj.offset.x;
        const toY = obj.newPosition.y - obj.offset.y;

        if (
          game.utilities.distance(toX, toY, obj.original[0], obj.original[1]) >
          5
        ) {
          obj.alpha = 0.5;
          obj.x = obj.newPosition.x - obj.offset.x;
          obj.y = obj.newPosition.y - obj.offset.y;
          if (!obj.dragStart) {
            obj.dragStart = true;
            game.utilities.toFrontLayer(obj);
            if (obj.DIY_DRAG !== undefined) obj.DIY_DRAG();
          }
        }
      }
    };

    this.onMouseMoveClick = obj => {
      if (obj.isInUse) {
        obj.alpha = 0.5;
        obj.position = this.game.renderer.plugins.interaction.mouse.global;
      }
    };

    this.onMouseUp = (obj, e) => {
      if (!obj.mouseIsDown) return;

      if (obj.dragStart) game.utilities.toOriginalLayer(obj);

      obj.alpha = 1;
      obj.mouseIsDown = false;
      obj.data = null;

      // debug.log("mouseUp")

      if (!obj.dragStart) {
        [obj.x, obj.y] = obj.original;
        debug.log(`click: ${obj.name}`);
        if (obj.clickable) {
          if (obj.DIY_CLICK !== undefined) obj.DIY_CLICK();
        }
      } else {
        game.emitDropEventOfObj(obj);

        [obj.x, obj.y] = obj.original;
        game.inventory.update();
      }
    };

    this.onMouseUpClick = (obj, e) => {
      if (!obj.mouseIsDown) return;
      obj.mouseIsDown = false;
      debug.log(`click: ${obj.name}`);
      if (obj.clickable && !obj.isInUse) {
        if (obj.DIY_CLICK !== undefined) obj.DIY_CLICK();
      }
    };

    this.registerBasicEvents();
  }

  checkObjInsideWindow(obj) {
    return (
      obj.x > 0 &&
      obj.x < this.game.size[0] &&
      obj.y > 0 &&
      obj.y < this.game.size[1]
    );
  }

  distance(x1, y1, x2, y2) {
    return ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) ** 0.5;
  }

  hitTestRectangle(r1, r2) {
    // Define the variables we'll need to calculate
    let hit;
    // hit will determine whether there's a collision
    hit = false;

    // Find the center points of each sprite
    r1.centerX = r1.x; // + r1.width / 2;
    r1.centerY = r1.y; // + r1.height / 2;
    r2.centerX = r2.x; // + r2.width / 2;
    r2.centerY = r2.y; // + r2.height / 2;

    // Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    // Calculate the distance vector between the sprites
    const vx = r1.centerX - r2.centerX;
    const vy = r1.centerY - r2.centerY;

    // Figure out the combined half-widths and half-heights
    const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    const combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    // Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      // A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        // There's definitely a collision happening
        hit = true;
      } else {
        // There's no collision on the y axis
        hit = false;
      }
    } else {
      // There's no collision on the x axis
      hit = false;
    }

    // `hit` will be either `true` or `false`
    return hit;
  }

  toFrontLayer(obj) {
    obj.temp = new Alice.Object();
    obj.originalParent = obj.parent;
    obj.originalParent.addChild(obj.temp);
    obj.originalParent.swapChildren(obj, obj.temp);
    this.game.topContainer.addChild(obj);
  }

  toOriginalLayer(obj) {
    obj.originalParent.addChild(obj);
    obj.originalParent = null;
    obj.parent.swapChildren(obj, obj.temp);
    obj.parent.removeChild(obj.temp);
    obj.temp = null;
  }

  pointInArea(p, area) {
    return p.x > area.x1 && p.x < area.x2 && p.y > area.y1 && p.y < area.y2;
  }

  registerBasicEvents() {
    document.addEventListener('mousewheel', ev => {
      if (ev.wheelDelta > 0) {
        this.game.inventory.prevPage();
      } else if (ev.wheelDelta < 0) {
        this.game.inventory.nextPage();
      }
    });

    // 2.window resize
    window.onresize = event => {
      this.game.resize();
    };
  }
}

class MessageBox {
  constructor(background, avatarEnable, game) {
    this.game = game;

    // the original background asset is built for 1280*720 screen
    this.backgronud = Alice.Object.fromImage(background.url);
    this.backgronud.anchor.set(0.5);

    // horizontal center
    this.backgronud.x = background.w / 2;
    this.backgronud.alpha = 0.8;

    const scale = (this.game.screenWidth / 1280) * 0.7;

    this.backgronud.scale.set(scale);
    this.backgronud.y = background.h - (220 * scale) / 2 - 10 * scale;

    this.pointArea = new PIXI.Sprite();
    this.pointArea.hitArea = new PIXI.Rectangle(
      0,
      0,
      this.game.screenWidth + this.game.inventoryWidth,
      this.game.screenHeight
    );
    this.pointArea.interactive = true;
    this.pointArea.buttonMode = true;
    this.pointArea.on('pointerdown', () => {
      if (game.messageBox) {
        game.messageBox.nextConversation();
      }
    });

    this.defaltStyle = new PIXI.TextStyle({
      fontFamily: 'Segoe UI',
      fontSize: 40 * scale,
      fontWeight: 'normal',
      wordWrap: true,
      wordWrapWidth: 1051 * scale * 0.9
    });

    // MultiStyleText is for text highlighting.
    // For details, please refer to the documentation
    // of this plugin.
    // Usage: add <tagName></tagName> between texts
    // you want to highlight.
    this.currentMsg = new MultiStyleText('', {
      default: {
        fontFamily: 'Segoe UI',
        fontSize: 40 * scale,
        fontWeight: 'normal',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.9
      },
      gameObj: {
        fontFamily: 'Segoe UI',
        fontSize: 40 * scale,
        fontWeight: 'normal',
        fill: '#16E584',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.9
      },
      sceneObj: {
        fontFamily: 'Segoe UI',
        fontSize: 40 * scale,
        fontWeight: 'normal',
        fill: '#FFA929',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.9
      }
    });
    this.currentMsg.anchor.set(0.5);
    this.currentMsg.x = this.backgronud.x;
    this.currentMsg.y = this.backgronud.y;
    this.currentMsg.text = '';

    this.holder = new Alice.Container();
    this.holder.addChild(this.pointArea);
    this.holder.addChild(this.backgronud);
    this.holder.addChild(this.currentMsg);
    this.holder.visible = false;

    this.messageBuffer = [];
    this.currentMsgIndex = 0;

    this.callBack = () => {};
  }

  nextConversation() {
    this.currentMsgIndex += 1;
    if (this.currentMsgIndex < this.messageBuffer.length) {
      this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
    } else {
      this.messageBuffer = [];
      this.currentMsg.text = '';
      this.currentMsgIndex = 0;
      this.holder.visible = false;
      this.callBack();
    }
  }

  addMessage(msg) {
    this.messageBuffer.push(msg);
  }

  addMessages(msgs) {
    this.messageBuffer = this.messageBuffer.concat(msgs);
  }

  // Rename required
  startConversation(msgs, fn = null) {
    // this.startConversation();
    if (msgs.length === 0) {
      return;
    }
    if (this.messageBuffer.length > 0) {
      this.addMessages(msgs);
      return;
    }
    if (fn) {
      this.callBack = fn;
    }
    this.messageBuffer = msgs;
    this.currentMsgIndex = 0;
    this.currentMsg.text = this.messageBuffer[this.currentMsgIndex];
    this.holder.visible = true;
  }

  stopConversation() {
    this.messageBuffer = [];
    this.currentMsg.text = '';
    this.currentMsgIndex = 0;
    this.holder.visible = false;
    this.callBack = () => {};
  }
}

class GameManager {
  constructor() {
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.inventorySize = 0;
    this.inventoryWidth = 0;

    this.inventory = {};
    this.sceneManager = {};
    this.topContainer = {};
    this.messageBox = {};
    this.eventSystem = {};
    this.reactionSystem = {};
    this.puzzleSystem = {};
    this.soundManager = {};
    this.utilities = {};

    this.size = [0, 0];
    this.ratio = 0;
    this.stage = new PIXI.Stage(0x333333, true);
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1], null);
  }

  init(width, height, inventorySize) {
    if (inventorySize < 5) {
      inventorySize = 5;
    }
    this.screenWidth = width;
    this.screenHeight = height;
    this.inventorySize = inventorySize;
    this.inventoryWidth = height / (inventorySize + 1);

    this.size = [this.screenWidth + this.inventoryWidth, this.screenHeight];
    this.ratio = this.size[0] / this.size[1];
    this.stage = new PIXI.Stage(0x333333, true);
    this.renderer = PIXI.autoDetectRenderer(this.size[0], this.size[1], null);
    document.body.appendChild(this.renderer.view);

    this.sceneManager = new SceneManager(this);
    this.inventory = new Inventory(this);
    this.topContainer = new Alice.Container();

    this.messageBox = new MessageBox(
      {
        w: width,
        h: height,
        scale: 1,
        url: `${baseURL.requireAssets}textbox.png`,
        a: 1
      },
      false,
      this
    );

    this.eventSystem = new AliceEventSystem();
    this.reactionSystem = new AliceReactionSystem(this);
    this.puzzleSystem = new AlicePuzzleSystem(this);
    this.soundManager = new SoundManager();
    this.utilities = new Utilities(this);

    this.stage.addChild(this.sceneManager.sceneContainer);
    this.stage.addChild(this.inventory.inventoryBackgroundGrp);
    this.stage.addChild(this.inventory.inventoryContainer);
    this.stage.addChild(this.messageBox.holder);
    this.stage.addChild(this.topContainer);
  }

  scene(index) {
    return this.sceneManager.getSceneByIndex(index);
  }

  start(index) {
    this.resize();
    this.sceneManager.start(index);
  }

  resize() {
    let w = 0;
    let h = 0;
    if (window.innerWidth / window.innerHeight >= this.ratio) {
      w = window.innerHeight * this.ratio;
      h = window.innerHeight;
    } else {
      w = window.innerWidth;
      h = window.innerWidth / this.ratio;
    }
    this.renderer.view.style.width = `${w}px`;
    this.renderer.view.style.height = `${h}px`;
  }

  emitDropEventOfObj(obj) {
    const collisionMap = this.getCollisionMap(obj);
    const sceneColliders = collisionMap.scene;
    const inventoryColliders = collisionMap.inventory;
    inventoryColliders.forEach(element => {
      let message = `${obj.name}${this.eventSystem.template.use}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
      message = `${obj.name}${this.eventSystem.template.combine}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
    });
    sceneColliders.forEach(element => {
      let message = `${obj.name}${this.eventSystem.template.use}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
      message = `${obj.name}${this.eventSystem.template.combine}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        this.eventSystem.callEvent(message);
      }
    });
  }

  getCollisionMap(tool) {
    const objsInCurrScene = this.sceneManager.getCurrentScene().children;
    const sceneCollideList = objsInCurrScene.filter(
      element =>
        element.visible &&
        tool.name !== element.name &&
        this.utilities.hitTestRectangle(tool, element)
    );
    const objsInInventory = this.inventory.inventoryContainer.children;
    const inventoryCollideList = objsInInventory.filter(
      element =>
        element.name !== tool.name &&
        element.visible &&
        this.utilities.hitTestRectangle(tool, element)
    );

    return { scene: sceneCollideList, inventory: inventoryCollideList };
  }
}

class Message {
  constructor(text, style, avatar, narrator = '') {
    this.text = text;
    this.style = style;
    this.avatar = {};
    this.narrator = narrator;
  }
}

const myGame = new GameManager();

const animate = function() {
  requestAnimationFrame(animate);
  myGame.renderer.render(myGame.stage);
};

requestAnimationFrame(animate);
