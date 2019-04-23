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

class StateManager {
  constructor(_states, _eventSys) {
    this.states = _states;
    this.eventSystem = _eventSys;
  }

  setState(stateName, _value) {
    if (this.states[stateName] !== _value) {
      this.states[stateName] = _value;
      this.eventSystem.callEvent(
        `${stateName}${this.eventSystem.template.state}${_value}`
      );
    }
  }
}

class AliceReactionSystem {
  constructor(_game) {
    this.game = _game;
  }

  setState(_stateName, _value) {
    this.game.stateManager.setState(_stateName, _value);
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

  removeFromInventory(_obj) {
    this.game.inventory.remove(_obj);
  }

  setObjVisibility(obj, visibility) {
    obj.visible = visibility;
    if (obj.inInventory) {
      this.game.inventory.update();
    }
  }

  makeObjVisible(_obj) {
    this.setObjVisibility(_obj, true);
  }

  makeObjInvisible(_obj) {
    this.setObjVisibility(_obj, false);
  }

  setObjInteractivity(obj, interactivity) {
    obj.interactive = interactivity;
    obj.buttonMode = interactivity;
  }

  makeInteractive(obj) {
    if (obj.interactive) return;
    this.setObjInteractivity(obj, true);
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

  playAudio(audio, loop = false) {
    this.game.soundManager.play(audio, loop);
  }

  stopAudio(audio) {
    this.game.soundManager.stop(audio);
  }

  showInventory() {
    this.game.showInventory();
  }

  hideInventory() {
    this.game.hideInventory();
  }

  moveObjectToScene(obj, sceneIndex, x = null, y = null) {
    this.game.moveObjectToScene(obj, sceneIndex, x, y);
  }

  setObjectLocation(obj, x, y) {
    obj.x = x;
    obj.y = y;
  }

  showObjectDescription(obj) {
    if (obj.description !== '' && obj.description !== null) {
      this.game.puzzleSystem.createMenu.call(this, obj);
      obj.menu.addAction('LookAt', () => {
        myGame.messageBox.startConversation([obj.description], null);
        obj.menu.setVisible(false);
      });

      obj.on('mouseover', () => {
        obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
      });
      obj.on('mouseout', () => {
        obj.filters = [];
      });
    }
  }

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

      obj.on('mouseover', () => {
        obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
      });
      obj.on('mouseout', () => {
        obj.filters = [];
      });
    }
  }
}

class AlicePuzzleSystem {
  constructor(_game) {
    this.game = _game;
  }

  showWinningState(sceneIndex) {
    setTimeout(() => {
      this.game.soundManager.play('win');
      const win = new Alice.Object.fromImage(`${baseURL.requireAssets}win.png`);
      win.name = 'Win';
      win.anchor.set(0.5, 0.5);
      win.x = 512;
      win.y = 288;
      win.scale.set(0.8, 0.8);
      reaction.makeClickable(win);
      reaction.makeUnDraggable(win);
      if (sceneIndex >= 0) this.game.scene(sceneIndex).addChild(win);
      else obj.addChild(win);
    }, 2000);
  }

  createMenu(obj, event) {
    if (!obj.hasOwnProperty('menu')) {
      obj.menu = new Menu(this.game, obj);
      this.game.stage.addChild(obj.menu.holder);
      obj.DIY_CLICK = () => {
        if (!obj.menu.holder.visible) {
          obj.menu.setVisible(true);
          obj.menu.resetPos(
            obj,
            this.game.renderer.plugins.interaction.mouse.global
          );
        }
      };
    }
  }

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

    doorObj.on('mouseover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('mouseout', () => {
      doorObj.filters = [];
    });
  }

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

    doorObj.on('mouseover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('mouseout', () => {
      doorObj.filters = [];
    });
  }

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
        //Play sound
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
    //delete(input);

    doorObj.on('mouseover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('mouseout', () => {
      doorObj.filters = [];
    });
  }

  distractGuardDoorPuzzle(toSceneId, doorObj, guardObj, dialogueId) {}

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
        //Play sound
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

    guardObj.on('mouseover', () => {
      guardObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    guardObj.on('mouseout', () => {
      guardObj.filters = [];
    });

    doorObj.on('mouseover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('mouseout', () => {
      doorObj.filters = [];
    });
  }

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
        //Play sound
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

    doorObj.on('mouseover', () => {
      doorObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    doorObj.on('mouseout', () => {
      doorObj.filters = [];
    });

    switchObj.on('mouseover', () => {
      switchObj.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    switchObj.on('mouseout', () => {
      switchObj.filters = [];
    });
  }

  destroyObjectPuzzle(objToDestroy, destroyer) {
    this.game.eventSystem.addUsedEvent(destroyer, objToDestroy, () => {
      this.game.reactionSystem.removeObject(objToDestroy);
      this.game.reactionSystem.removeObject(destroyer);
    });
  }

  letCharacterSayPuzzle(charObj, itemToGive, dialogueToSay) {
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

    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });
  }

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
      } else {
        if (this.game.messageBox.messageBuffer.length === 0)
          this.game.messageBox.startConversation([
            `<gameObj>${container.name}</gameObj> is empty.`
          ]);
      }
      container.menu.setVisible(false);
    });

    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });

    container.on('mouseover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('mouseout', () => {
      container.filters = [];
    });
  }

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
      } else {
        if (container.content.length !== 0) {
        } else if (this.game.messageBox.messageBuffer.length === 0)
          this.game.messageBox.startConversation([
            `<gameObj>${container.name}</gameObj> is empty.`
          ]);
      }
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

    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });

    container.on('mouseover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('mouseout', () => {
      container.filters = [];
    });
  }

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
        } else {
          if (container.content.length !== 0) {
          } else if (this.game.messageBox.messageBuffer.length === 0)
            this.game.messageBox.startConversation([
              `<gameObj>${container.name}</gameObj> is empty.`
            ]);
        }
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
            //if (input.text === password) {
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
              // container.collected = true;
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
      console.log('exist input');
      input = container.passwordInput.input;
    }
    if (Object.keys(container.passwordInput.passwords).includes(password)) {
      container.passwordInput.passwords[password].push(obj);
    } else {
      container.passwordInput.passwords[password] = [obj];
    }
    // container.passwordInput.passwords.push(password);
    console.log(container.passwordInput.passwords);
    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });

    container.on('mouseover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('mouseout', () => {
      container.filters = [];
    });
  }

  getItemFromDistractGuardContainerPuzzle(
    obj,
    container,
    guardObj,
    dialogueId
  ) {}

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
      } else {
        if (container.content.length !== 0) {
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
      }
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

    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });

    container.on('mouseover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('mouseout', () => {
      container.filters = [];
    });

    guardObj.on('mouseover', () => {
      guardObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    guardObj.on('mouseout', () => {
      guardObj.filters = [];
    });
  }

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
      } else {
        if (container.content.length !== 0) {
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
      }
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

    obj.on('mouseover', () => {
      obj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      obj.filters = [];
    });

    container.on('mouseover', () => {
      container.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    container.on('mouseout', () => {
      container.filters = [];
    });

    switchObj.on('mouseover', () => {
      switchObj.filters = [
        new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)
      ];
    });
    switchObj.on('mouseout', () => {
      switchObj.filters = [];
    });
  }

  getItemFromConvinceCharacterPuzzle(obj, charObj, dialogueId) {}

  getItemFromTradeCharacterPuzzle(
    obj,
    charObj,
    tradeObj,
    isWinning = false,
    sound = null
  ) {
    let collected = false;
    this.game.eventSystem.addUsedEvent(tradeObj, charObj, () => {
      if (charObj.content.length !== 0) {
        for (let c of charObj.content) {
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
        collected = true;
        if (isWinning) {
          const sceneIndex = this.game.sceneManager.sceneContainer.getChildIndex(
            this.game.sceneManager.getCurrentScene()
          );
          this.showWinningState(sceneIndex);
        }
      }
    });

    obj.on('mouseover', () => {
      charObj.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    obj.on('mouseout', () => {
      charObj.filters = [];
    });
  }

  combineItemPuzzle(product, ingredient1, ingredient2) {
    this.game.puzzleSystem.createMenu.call(this, product);
    this.game.eventSystem.addCombineEvent(ingredient1, ingredient2, () => {
      this.game.reactionSystem.addToInventory(product);
      this.game.reactionSystem.removeObject(ingredient1);
      this.game.reactionSystem.removeObject(ingredient2);
      product.visible = true;
    });

    product.on('mouseover', () => {
      product.filters = [new PIXI.filters.GlowFilter(10, 2, 1, 0xffff00, 0.5)];
    });
    product.on('mouseout', () => {
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

  init() {
    // TODO
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

  remove(tool) {
    this.inventoryContainer.removeChild(tool);
    tool.inInventory = false;
    this.page = Math.floor((this.countValidObj() - 1) / 5);
    this.update();
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
    // this.inventUp.visible = this.hasPrevPage();
    this.inventUp.interactive = this.hasPrevPage();
    // this.inventDown.visible = this.hasNextPage();
    this.inventDown.interactive = this.hasNextPage();
  }

  inventoryObserved(tool) {
    const message = `${tool.name} is observed`;
    if (this.interactionSystem.checkEventExist(message)) {
      this.interactionSystem.callEvent(message);
    }
  }

  inventoryUse(tool) {
    const collisionMap = this.getCollisionMap(tool);
    const sceneCollider = collisionMap.scene;
    const inventoryCollider = collisionMap.inventory;

    if (inventoryCollider.length > 0) {
      const message = `${tool.name}${this.game.eventSystem.template.combine}${
        inventoryCollider.pop().name
      }`;
      if (this.game.eventSystem.checkEventExist(message)) {
        this.game.eventSystem.callEvent(message);
        return;
      }
    }

    if (sceneCollider.length > 0) {
      const message = `${tool.name}${this.game.eventSystem.template.use}${
        sceneCollider.pop().name
      }`;
      if (this.game.eventSystem.checkEventExist(message)) {
        this.game.eventSystem.callEvent(message);
        return;
      }
    }

    this.game.soundManager.play('bad');
    tool.x = tool.inventPos.x;
    tool.y = tool.inventPos.y;
  }

  clearUp() {
    this.inventoryContainer.removeChildren();
  }

  popUp(tool) {
    this.inventoryContainer.removeChild(tool);
    this.inventoryContainer.addChild(tool);
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

class PasswordInput {
  constructor(_game) {
    this.game = _game;
    this.passwords = {};
    this.input = new PIXI.TextInput(
      {
        fontSize: '36px',
        padding: '12px',
        width: '300px',
        color: '#26272E'
      },
      {
        default: {
          fill: 0xe8e9f3,
          rounded: 16,
          stroke: { color: 0xcbcee0, width: 4 }
        },
        focused: {
          fill: 0xe1e3ee,
          rounded: 16,
          stroke: { color: 0xabafc6, width: 4 }
        },
        disabled: { fill: 0xdbdbdb, rounded: 16 }
      }
    );

    this.input.placeholder = 'Enter Password:';
    this.input.x = this.game.screenWidth / 2;
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

    this.createActionPanel('LookAt', './Resources/Assets/require/look_at.png');
    this.createActionPanel('Get', './Resources/Assets/require/get.png');
    this.createActionPanel('Use', './Resources/Assets/require/use.png');
    this.createActionPanel('Open', './Resources/Assets/require/open.png');
    this.createActionPanel('Enter', './Resources/Assets/require/enter.png');
    this.createActionPanel('TalkTo', './Resources/Assets/require/talk_to.png');

    this.holder.visible = false;
  }

  createActionPanel(name, imageLoc) {
    const action = new Alice.Object.fromImage(imageLoc);
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
        this.actions['Get'].addListener('mousedown', callback);
        this.actions['Get'].visible = true;
        break;
      case 'Use':
        this.actions['Use'].addListener('mousedown', callback);
        this.actions['Use'].visible = true;
        break;
      case 'Open':
        this.actions['Open'].addListener('mousedown', callback);
        this.actions['Open'].visible = true;
        break;
      case 'Enter':
        this.actions['Enter'].addListener('mousedown', callback);
        this.actions['Enter'].visible = true;
        break;
      case 'LookAt':
        this.actions['LookAt'].addListener('mousedown', callback);
        this.actions['LookAt'].visible = true;
        break;
      case 'TalkTo':
        this.actions['TalkTo'].addListener('mousedown', callback);
        this.actions['TalkTo'].visible = true;
        break;
      default:
        console.log(`${actionName} Invalid action verb`);
        break;
    }
  }

  removeAction(actionName) {
    switch (actionName) {
      case 'Get':
        this.actions['Get'].visible = false;
        break;
      case 'Use':
        this.actions['Use'].visible = false;
        break;
      case 'Open':
        this.actions['Open'].visible = false;
        break;
      case 'Enter':
        this.actions['Enter'].visible = false;
        break;
      case 'LookAt':
        this.actions['LookAt'].visible = false;
        break;
      case 'TalkTo':
        this.actions['TalkTo'].visible = false;
        break;
      default:
        console.log('Invalid action verb');
        break;
    }
  }

  setVisible(_visible) {
    this.holder.visible = _visible;
  }

  resetPos(obj, pos) {
    let offsetIndex = 0;
    let increment = 1;
    if (this.game.inventory.isInsideInventory(obj)) increment = -1;

    //Remember to sort reversely after if is inside inventory.

    for (let action in this.actions) {
      if (this.actions[action].visible) {
        this.actions[action].position = new PIXI.Point(
          pos.x + offsetIndex * 100,
          pos.y
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

  nextScene() {
    let currSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
    if (currSceneIndex + 1 >= this.sceneContainer.children.length) return;
    this.currentScene.visible = false;
    currSceneIndex += 1;
    this.currentScene = this.sceneContainer.getChildAt(currSceneIndex);
    this.currentScene.visible = true;
  }

  previousScene() {
    let currSceneIndex = this.sceneContainer.getChildIndex(this.currentScene);
    if (currSceneIndex <= 0) return;
    this.currentScene.visible = false;
    currSceneIndex -= 1;
    this.currentScene = this.sceneContainer.getChildAt(currSceneIndex);
    this.currentScene.visible = true;
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

    /*
                click and drag mouse events
            */
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
      fontFamily: 'Arial',
      fontSize: 46 * scale,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: 1051 * scale * 0.8
    });

    this.currentMsg = new MultiStyleText('', {
      default: {
        fontFamily: 'Arial',
        fontSize: 46 * scale,
        fontWeight: 'bold',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.8
      },
      gameObj: {
        fontFamily: 'Arial',
        fontSize: 46 * scale,
        fontWeight: 'bold',
        fill: '#00aa00',
        wordWrap: true,
        wordWrapWidth: 1051 * scale * 0.8
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
    this.stateManager = {};
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

  initStateManager(states) {
    this.stateManager = new StateManager(states, this.eventSystem);
  }

  moveObjectToScene(obj, sceneIndex, x = null, y = null) {
    this.scene(sceneIndex).addChild(obj);
    if (x) {
      obj.x = x;
    }
    if (y) {
      obj.y = y;
    }
  }

  showInventory() {
    this.renderer.resize(
      this.screenWidth + this.inventoryWidth,
      this.screenHeight
    );
    this.ratio = this.size[0] / this.size[1];
    this.resize();
  }

  hideInventory() {
    this.renderer.resize(this.screenWidth, this.screenHeight);
    this.ratio = (this.size[0] - this.inventoryWidth) / this.size[1];
    this.resize();
  }

  scene(index) {
    return this.sceneManager.getSceneByIndex(index);
  }

  awake() {}

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
        //this.soundManager.play('good');
        this.eventSystem.callEvent(message);
      }
      message = `${obj.name}${this.eventSystem.template.combine}${
        element.name
      }`;
      if (this.eventSystem.checkEventExist(message)) {
        //this.soundManager.play('good');
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
