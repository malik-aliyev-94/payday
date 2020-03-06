import * as process from 'process';
import * as path    from 'path';

import ExampleComponent     from './components/example';
import CustomerComponent    from './components/customer';
import AccountComponent     from './components/account';
import TransactionComponent from './components/transaction';

import App from './App';

const app = new App({
  components: [ExampleComponent, CustomerComponent, AccountComponent, TransactionComponent],
});

declare const module: any; 
async function start() {
  await app.run();

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
start();