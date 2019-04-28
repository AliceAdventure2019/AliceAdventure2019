const { Event } = require('./Utilities/Utilities');
const View = require('./View');

class HelpView extends View {
  constructor(_bindElementID, _height = -1, _width = -1) {
    super('HelpView', _height, _width, _bindElementID);
    this.vModel = null;
  }

  static NewView(_elementID) {
    const view = new HelpView(_elementID);
    view.InitView();
    return view;
  }

  InitView() {
    super.InitView();
    this.vModel = new Vue({
      el: `#${this.bindElementID}`,
      data: {
        showBeginner: true,
        showIntermediate: false,
        showAdvanced: false
      },
      methods: {
        beginner: () => {
          this.vModel.showBeginner = true;
          this.vModel.showIntermediate = false;
          this.vModel.showAdvanced = false;
        },
        intermediate: () => {
          this.vModel.showBeginner = false;
          this.vModel.showIntermediate = true;
          this.vModel.showAdvanced = false;
        },
        advanced: () => {
          this.vModel.showBeginner = false;
          this.vModel.showIntermediate = false;
          this.vModel.showAdvanced = true;
        }
      }
    });
  }

  ReloadView() {
    super.ReloadView();
  }
}

module.exports = HelpView;
