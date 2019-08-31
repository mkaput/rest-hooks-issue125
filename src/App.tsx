import React, { Suspense } from 'react';
import {
  CacheProvider,
  NetworkErrorBoundary,
  Resource,
  useResource,
  useFetcher,
  MutateShape, SchemaDetail, AbstractInstanceType,
} from 'rest-hooks';
import './App.css';

interface User {
  name: string;
}

class ServiceConnection extends Resource {
  readonly user: User | null = null;

  pk() {
    return null;
  }

  static urlRoot = '/api/service/connect';

  static connectShape<T extends typeof Resource>(
    this: T,
  ): MutateShape<SchemaDetail<AbstractInstanceType<T>>> {
    return {
      ...this.updateShape(),
      getFetchKey: () => {
        // globally uniquely identifying this particular request
        return `POST ${this.urlRoot}`;
      },
      fetch: () => {
        return this.fetch('post', this.urlRoot);
      },
    };
  }

  static disconnectShape<T extends typeof Resource>(
    this: T,
  ): MutateShape<SchemaDetail<AbstractInstanceType<T>>> {
    return {
      ...this.updateShape(),
      getFetchKey: () => {
        // globally uniquely identifying this particular request
        return `DELETE ${this.urlRoot}`;
      },
      fetch: () => {
        return this.fetch('delete', this.urlRoot);
      },
    };
  }
}

function Playground() {
  const service = useResource(ServiceConnection.detailShape(), {});
  const connect = useFetcher(ServiceConnection.connectShape());
  const disconnect = useFetcher(ServiceConnection.disconnectShape());

  return (
    <>
      <p>
        <button onClick={() => connect({}, {})}>Connect</button>
        &nbsp;
        <button onClick={() => disconnect({}, {})}>Disconnect</button>
      </p>
      <pre>{JSON.stringify(service, null, 2)}</pre>
    </>
  );
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
};

export default App;
