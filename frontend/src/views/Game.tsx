import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { GameType } from 'components/types';
import { Layout } from './Layout';
import { ChatRoom, Game as BoardGame } from 'components';
import { Colors } from 'types';
import { useParams } from 'react-router';

export const Game = () => {
  let { id: gameId } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    connect();
  }, [gameId]);

  const connect = () => {
    setSocket(
      new ReconnectingWebSocket(`ws://localhost:8000/api/ws/game/${gameId}`)
    );

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
      };
    }
  };

  return (
    <Layout
      main={<BoardGame socket={socket} />}
      panel={<ChatRoom socket={socket} color={Colors.WHITE} />}
    />
  );
};
