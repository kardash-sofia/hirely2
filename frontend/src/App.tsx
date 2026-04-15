import { AppRouter } from './app/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './app/context/SocketContext';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </QueryClientProvider>
  )
}

export default App;
