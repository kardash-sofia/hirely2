import { AppRouter } from './app/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './app/context/SocketContext';
import { AuthProvider } from './app/context/AuthContext';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <SocketProvider>
            <AppRouter />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
