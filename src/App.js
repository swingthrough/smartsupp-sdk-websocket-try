import React, { useEffect, useState } from 'react';
import { createVisitorClient } from 'smartsupp-websocket';

const client = createVisitorClient({
  data: {
    id: null, // null or id returned from server
    key: '9a51ace5dd0f2afa21740a1dfeb1153a57554f7f',
  },
  // if omitted, throws error (cannot read property url of undefined)
  connection: {
    // url: window.document.location.toString(),
    // url: 'https://websocket.smartsupp.com',
    // options: {
    //   transports: ['websocket'],
    // },
  },
});

const App = () => {
  useEffect(() => {
    // connect to server
    client.connect().then(data => {
      console.log('[connect] data: ', data);
    });

    client.on('initialized', data => {
      console.log('[initialized] data: ', data);
    });

    // received events

    client.on('visitor.updated', data => {
      console.log('[visitor.updated] data: ', data);
    });

    client.on('group.updated', data => {
      console.log('[group.updated] data: ', data);
    });

    client.on('error', data => {
      console.log('[error] data: ', data);
    });

    client.on('chat.rated', data => {
      console.log('[chat.rated] data: ', data);
    });

    client.on('chat.deleted', data => {
      console.log('[chat.deleted] data: ', data);
    });

    client.on('chat.message_received', data => {
      console.log('[chat.message_received] data: ', data);
      if (data.message.type === 'message') {
        if (data.message.subType === 'agent') {
          setMessages(prev => prev.concat({from: 'agent', text: data.message.content.text}));
        } else if (data.message.subType === 'contact') {
          setMessages(prev => prev.concat({from: 'client', text: data.message.content.text}));
        } else if (data.message.subType === 'trigger') {
          setMessages(prev => prev.concat({from: 'auto', text: data.message.content.text}));
        }
      }
      
      
    });

    client.on('chat.contact_read', data => {
      console.log('[chat.contact_read] data: ', data);
    });

    client.on('chat.closed', data => {
      console.log('[chat.closed] data: ', data);
    });

    client.on('chat.agent_unassigned', data => {
      console.log('[chat.agent_unassigned] data: ', data);
    });

    client.on('chat.agent_typing', data => {
      console.log('[chat.agent_typing] data: ', data);
    });

    client.on('chat.agent_left', data => {
      console.log('[chat.agent_left] data: ', data);
    });

    client.on('chat.agent_joined', data => {
      console.log('[chat.agent_joined] data: ', data);
    });

    client.on('chat.agent_assigned', data => {
      console.log('[chat.agent_assigned] data: ', data);
    });

    client.on('agent.updated', data => {
      console.log('[agent.updated] data: ', data);
    });

    client.on('agent.removed', data => {
      console.log('[agent.removed] data: ', data);
    });

    client.on('account.status_updated', data => {
      console.log('[account.status_updated] data: ', data);
    });

    return () => {
      console.log('[useEffect cleanup] socket disconnecting');
      client.disconnect();
    };
  }, []);

  const [messages, setMessages] = useState([]);
  
  const [inputValue, setInputValue] = useState('');

  const sendMessage = async () => {
    const message = await client.chatMessage({
      content: {
        type: 'text',
        text: inputValue,
      },
    });
    console.log('sentMessage: ', message);
    // setMessages(prev => prev.concat({from: 'client', text: message.content.text}));
    setInputValue('');
  };

  return <div className="App">
    <div>
      <ul>
        {messages.map(message => (
          <Message message={message} />
        ))}
      </ul>
    </div>
    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
    <button onClick={sendMessage}>send</button>
  </div>;
};

const Message = ({message}) => {
  if (message.from === 'client') {
    return <li>
      YOU: {message.text}
    </li>
  }  else if (message.from === 'agent') {
    return <li>
    OPERATOR: {message.text}
  </li>
  } else if (message.from === 'auto') {
    return <li>
    AUTO: {message.text}
  </li>
  } else {
    throw new Error('Invalid message: ', message);
  }
}

export default App;
