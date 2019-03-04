const AliceEditor = require('../Scripts/AliceEditor');

const InitWelcomePage = () => {
  const welcomeView = AliceEditor.WelcomeView.NewView('welcome-view');
  return welcomeView;
};
