import Fula from '../interfaces/fulaNativeModule';
import { DeviceEventEmitter } from 'react-native';

  export const chatWithAI = (
    aiModel: string,
    userMessage: string
  ): Promise<string> => {
    console.log('chatWithAI in react-native started');
    let res = Fula.chatWithAI(aiModel, userMessage)
      .then((res1) => {
        try {
          return res1; // Return the stream ID directly
        } catch (e) {
          console.error('Error parsing res in chatWithAI:', e);
          throw e; // Rethrow the error to maintain the rejection state
        }
      })
      .catch((err) => {
        console.error('Error starting chat with AI:', err);
        throw err; // Rethrow the error to maintain the rejection state
      });
    return res;
  };
  
  export const getChatChunk = (streamID: string): Promise<string> => {
    console.log('getChatChunk in react-native started');
    let res = Fula.getChatChunk(streamID)
      .then((res1) => {
        try {
          if (!res1 || res1.trim() === "") {
            console.log('Empty chunk received.');
            return ""; // Return an empty string for empty chunks
          }
  
          console.log('Raw response from GetChatChunk:', res1); // Log raw response
  
          const parsedChunk = JSON.parse(res1);
          if (parsedChunk && parsedChunk.status && parsedChunk.msg) {
            const content = parsedChunk.msg;
            console.log('Processed content:', content); // Log processed content
            return content;
          }
  
          return "";
        } catch (e) {
          console.error('Error parsing res in getChatChunk:', e);
          throw e;
        }
      })
      .catch((err) => {
        console.error('Error getting chat chunk:', err);
        throw err;
      });
    return res;
  };

  export const fetchChunksUsingIterator = (streamID: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      let fullResponse = '';
      let active = true;
  
      const cleanup = () => {
        active = false;
        DeviceEventEmitter.removeAllListeners('onChunkReceived');
        DeviceEventEmitter.removeAllListeners('onStreamingCompleted');
        DeviceEventEmitter.removeAllListeners('onStreamError');
      };
  
      const chunkHandler = (chunk: string) => {
        if (active) fullResponse += chunk;
        console.log('Chunk received:', chunk);
      };
  
      const completionHandler = () => {
        if (active) {
          cleanup();
          resolve(fullResponse);
        }
      };
  
      const errorHandler = (error: string) => {
        if (active) {
            cleanup();
            if (error.includes('EOF')) {
                // Treat EOF as successful completion
                console.log('Stream completed with EOF');
                resolve(fullResponse);
            } else {
                console.error('Stream error:', error);
                reject(new Error(error || 'Unknown stream error'));
            }
        }
      };
  
      DeviceEventEmitter.addListener('onChunkReceived', chunkHandler);
      DeviceEventEmitter.addListener('onStreamingCompleted', completionHandler);
      DeviceEventEmitter.addListener('onStreamError', errorHandler);
  
      Fula.streamChunks(streamID)
      .catch(error => {
        if (active) {
            cleanup();
            if (error.message.includes('EOF')) {
                resolve(fullResponse);
            } else {
                reject(error);
            }
        }
      });
    });
  };