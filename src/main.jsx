import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './App.css'
import App from './App.jsx'
import { store } from './store/store.js'
// import "./styles/variables.css";
// import "./styles/global.css";
// import "./styles/layout.css";
// import "./styles/cards.css";
// import "./styles/buttons.css";
// import "./styles/games.css";
// import "./styles/responsive.css";
// import "./styles/personalInfo.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
