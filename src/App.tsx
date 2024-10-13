// src/App.tsx
import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import Chatbot from "./components/Chatbot";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="h-screen bg-gray-100">
        <Chatbot />
      </div>
    </Provider>
  );
};

export default App;
