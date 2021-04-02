import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { GameType } from 'components/types';
import { Layout } from './Layout';
import { GameLobby, Game } from 'components';

export const Main = () => {
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
  const [activeGames, setActiveGames] = useState<GameType[]>([]);

  useEffect(() => {
    if (!socket) {
      connect();
    }
  }, [socket]);

  const connect = () => {
    const socket = new ReconnectingWebSocket(
      'ws://localhost:8000/api/ws/lobby'
    );

    setSocket(socket);

    if (socket) {
      socket.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected');
      };

      socket.onclose = () => {
        console.log('disconnected');
        // automatically try to reconnect on connection loss
      };

      socket.onmessage = function (e) {
        const server_message = JSON.parse(e.data);
        console.log(server_message);
        console.log(server_message.type);

        switch (server_message.type) {
          case 'NEW_GAME':
            console.log(activeGames);
            setActiveGames([...activeGames, { id: server_message?.data?.id }]);
        }
        return false;
      };
    }
  };

  return (
    <Layout
      main={<Game socket={socket} />}
      panel={<GameLobby websocket={socket} games={activeGames} />}
    />
  );
};
