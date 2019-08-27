import React, { Suspense } from 'react';
import { CacheProvider, NetworkErrorBoundary, Resource, useResource, useFetcher } from 'rest-hooks';
import './App.css';

interface User {
  name: string;
}

class ServiceConnection extends Resource {
  readonly user: User | null = null;

  pk() {
    return 1;
  }

  static urlRoot = '/api/service/connect';

  static url() {
    return ServiceConnection.urlRoot;
  }
}

function Playground() {
  const service = useResource(ServiceConnection.detailShape(), {});
  const connect = useFetcher(ServiceConnection.createShape());
  const disconnect = useFetcher(ServiceConnection.deleteShape());

  return (
    <>
      <p>
        <button onClick={() => connect({}, {})}>Connect</button>
        &nbsp;
        <button onClick={() => disconnect({}, {})}>Disconnect</button>
      </p>
      <pre>{JSON.stringify(service, null, 2)}</pre>
    </>
  )
}

const App: React.FC = () => {
  return (
    <CacheProvider>
      <div className="App">
        <Suspense fallback={<pre>Fetching...</pre>}>
          <NetworkErrorBoundary>
            <Playground />
          </NetworkErrorBoundary>
        </Suspense>
      </div>
    </CacheProvider>
  );
}

export default App;
