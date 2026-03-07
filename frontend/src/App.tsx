import { AppRouter } from './app/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AppRouter />
    </QueryClientProvider>
  )
}

export default App;
