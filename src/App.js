import React, { useState } from 'react';
import { Client } from 'filestack-js';
import './App.css';

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [showCaptionContainer, setShowCaptionContainer] = useState(false);
  const [copyMessageVisible, setCopyMessageVisible] = useState(false);

  const apiKey = 'ADD-YOUR-API-KEY'; // Replace with your Filestack API key
  const client = new Client(apiKey);

  const openPicker = () => {
    client.picker({
      onUploadDone: (result) => {
        const file = result.filesUploaded[0];
        setImageUrl(file.url);
        generateCaption(file.handle);
      },
    }).open();
  };

  const generateCaption = (handle) => {
    const policy = 'eyJleHBpcnkiOjE3MjQyNzQwMDAsImNhbGwiOlsicGljayIsInJlYWQiLCJzdGF0Iiwid3JpdGUiLCJ3cml0ZVVybCIsInN0b3JlIiwiY29udmVydCIsInJlbW92ZSIsImV4aWYiLCJydW5Xb3JrZmxvdyJdfQ=='; // Replace with your Filestack policy
    const signature = 'd1db8c762144e5877e7e9efdd98994dfb1a5cc0c36cbe5c0d0f3c51d2d83e678'; // Replace with your Filestack signature
    const captionUrl = `https://cdn.filestackcontent.com/security=p:${policy},s:${signature}/caption/${handle}`;

    fetch(captionUrl)
      .then((res) => res.json())
      .then((data) => {
        setCaption(data.caption);
        setShowCaptionContainer(true);
      })
      .catch((error) => {
        console.error('Error generating caption:', error);
        setCaption('Error generating caption.');
      });
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setCopyMessageVisible(true);
      setTimeout(() => {
        setCopyMessageVisible(false);
      }, 2000);
    }).catch((error) => {
      console.error('Error copying caption:', error);
    });
  };

  return (
    <div className="app">
      <h1>Image Accessibility Viewer by Filestack</h1>
      <button className="upload-button" onClick={openPicker}>Upload Image</button>

      {showCaptionContainer && (
        <div id="captionDisplayContainer">
          <img id="uploadedImage" src={imageUrl} alt="Uploaded" />
          <p id="captionDisplay">{caption}</p>
          <button id="copyButton" onClick={copyCaption}>Copy Caption</button>
          {copyMessageVisible && <p id="copyMessage">Caption copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
};

export default App;
