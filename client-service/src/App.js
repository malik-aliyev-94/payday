import React, { useState, useContext, useEffect } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('AUTH_TOKEN');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const AppContext = React.createContext();

const MUTATION_LOGIN = gql`
  mutation Login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      customer {
        id
      }
      token
    }
  }
`;

const MUTATION_SIGNUP = gql`
  mutation Signup($name: String!, $last_name: String!, $password: String!, $email: String!, $gender: String!, $phone: String!, $date_of_birth: String!) {
    signup(name: $name, last_name: $last_name, password: $password, email: $email, gender: $gender, phone: $phone, date_of_birth: $date_of_birth) {
      customer {
        id
      }
      token
    }
  }
`;

const MUTATION_DISABLE = gql`
  mutation DisableAccount($id: ID!) {
    disableAccount(id: $id) {
      id 
    }
  }
`;

const MUTATION_TRANSACTION = gql`
  mutation CreateTransaction($account: ID!, $amount: Int!, $description: String) {
    createTransaction(account: $account, amount: $amount, description: $description) {
      id 
    }
  }
`;

const MUTATION_ACCOUNT = gql`
  mutation CreateAccount($name: String!, $type: String!) {
    createAccount(name: $name, type: $type) {
      id 
      accn
      name
    }
  }
`;

const QUERY_CUSTOMER = gql`
  query {
    customer {
      id 
      name 
      last_name
      phone
      gender
      date_of_birth
      email 
      debitAccounts {
        id 
        accn
        name
        transactions {
          id
          description
          date_of_transaction
          amount
        }
      }
      creditAccounts {
        id
        accn
        name
        transactions {
          id
          description
          date_of_transaction
          amount
        }
      }
    }
  }
`;

function Login() {

  const {setComponent} = useContext(AppContext);
  const [data, setData] = useState({
    login: '',
    password: ''
  });

  const [login, {}] = useMutation(MUTATION_LOGIN, {
    onError: (e) => {console.log(e)},
    onCompleted: (data) => {
      localStorage.setItem("AUTH_TOKEN", data.login.token)
      setComponent('Dashboard');
    }
  });

  return (
    <div className="flex-center">
        <div className="form">
          <h3>Log in</h3>

          <div className="form-group">
            <label htmlFor="inputLogin">Email address or phone</label>
            <input type="text" className="form-control" id="inputLogin" placeholder="Login" value={data.login} onChange={(e) => setData({...data, login: e.target.value})} />
          </div>

          <div className="form-group">
            <label htmlFor="inputPassword">Password</label>
            <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
          </div>

          <div className="flex-center">
            <button type="submit" className="btn btn-success" onClick={() => login({variables: {...data}})}>Login</button>
          </div>
        </div>
    </div>
  );
}

function SignUp() {
  const {setComponent} = useContext(AppContext);
  const [data, setData] = useState({
    name: "",
    last_name: "", 
    password: "", 
    email: "", 
    gender: "man", 
    phone: "", 
    date_of_birth: ""
  });

  const [signup, {}] = useMutation(MUTATION_SIGNUP, {
    onError: (e) => {console.log(e)},
    onCompleted: (data) => {
      localStorage.setItem("AUTH_TOKEN", data.signup.token)
      setComponent('Dashboard');
    }
  });

  return (
    <div className="flex-center">
        <div className="form">
          <h3>Sign up</h3>

          <div className="flex">
            <div>
              <div className="form-group">
                <label htmlFor="inputName">First Name</label>
                <input type="text" className="form-control" id="inputName" placeholder="Name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
              </div>

              <div className="form-group">
                <label htmlFor="inputLastName">Last Name</label>
                <input type="text" className="form-control" id="inputLastName" placeholder="Last name" value={data.last_name} onChange={(e) => setData({...data, last_name: e.target.value})} />
              </div>

              <div className="form-group">
                <label htmlFor="inputDOB">Date of birth (YYYY-MM-DD)</label>
                <input type="text" className="form-control" id="inputDOB" placeholder="Date of birth" value={data.date_of_birth} onChange={(e) => setData({...data, date_of_birth: e.target.value})} />
              </div>

              <div className="form-group">
                <label htmlFor="inputGender">Gender</label>
                <select className="form-control" id="inputGender" value={data.gender} onChange={(e) => setData({...data, gender: e.target.value})}>
                  <option value="man">man</option>
                  <option value="woman">woman</option>
                </select>
              </div>
            </div>

            <div>
              <div className="form-group">
                <label htmlFor="inputEmail">Email address</label>
                <input type="text" className="form-control" id="inputEmail" placeholder="Email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
              </div>

              <div className="form-group">
                <label htmlFor="inputPhone">Phone</label>
                <input type="text" className="form-control" id="inputPhone" placeholder="phone" value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} />
              </div>

              <div className="form-group">
                <label htmlFor="inputPassword">Password</label>
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex-center">
            <button type="submit" className="btn btn-success" onClick={() => signup({variables: {...data}})}>Sign Up</button>
          </div>
        </div>
    </div>
  );
}

function Transactions(props) {

  const [disableAccount, {}] = useMutation(MUTATION_DISABLE, {
    onError: (e) => {console.log(e)},
    onCompleted: (data) => {
      // reload
    },
    refetchQueries: [{
      query: QUERY_CUSTOMER
    }]
  });

  let balance = 0;
  let transactions = props.data.map((tr, index) => {
    balance += tr.amount;
    return (
      <li key={index} className="list-group-item">
        <div className="flexbox" style={{justifyContent: 'sapce-between'}}>
          <div>{new Date(Number(tr.date_of_transaction)).toISOString().split('T')[0]}</div>
          <div>{tr.description}</div>
          <div>{tr.amount} AZN</div>
        </div>
      </li>
    )
  });

  return (
    <div>
      <div className="flex" style={{justifyContent: 'sapce-between', padding: '.75rem 1.25rem', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,.125)'}}>
        <div style={{fontSize: 24}}>Balance: {balance} AZN</div>
        <div style={{textAlign: 'right'}}>
          <button className="btn btn-danger" style={{marginRight: 20}} onClick={() => disableAccount({variables: {id: props.account}})}>Disable Account</button>
          {/* <button className="btn btn-primary">New transaction</button> */}
        </div>
      </div>

      <ul className="list-group list-group-flush">
      {transactions}
      </ul>
    </div>
  )
}

function Accounts(props) {

  let accountsList = props.data.map((account, index) => {
    return (
      <div key={index} className="card" style={{marginBottom: 10}}>
        <div className="card-header">
          <div className="flexbox" style={{justifyContent: 'sapce-between'}}>
            <div>ID: #{account.id}</div>
            <div>{account.name ? `Name: ${account.name}` : ''}</div>
            <div>ACCN: <b>{account.accn}</b></div>
          </div>
        </div>
        <div className="card-body" style={{padding: 0}}>
          <Transactions data={account.transactions} account={account.id} />
        </div>
      </div>
    );
  });

  return (
    <div style={{marginTop: 20}}>
      <h4>{props.type === 'debit' ? 'Debit' : 'Credit'} Accounts</h4>

      {accountsList}

    </div>
  );
}

function Dashboard() {
  const { setComponent } = useContext(AppContext);
  const { loading, error, data } = useQuery(QUERY_CUSTOMER);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { customer } = data;

  console.log(customer);

  return (
    (customer && customer.id) ? 
    <div style={{display: 'flex'}}>
      <div style={{flex: 1}}>
        <div className="flex" style={{alignItems: 'center'}}>
          <h3 style={{margin: 0, padding: 0}}>Hi, {customer.name} (#{customer.id})</h3>  
          <div className="" style={{marginLeft: 50}}>
            <button 
              type="button"
              className="btn btn-default" 
              onClick={(e) => {
                e.preventDefault(); 
                localStorage.removeItem('AUTH_TOKEN');
                setComponent('Login');
              }}>Logout</button>
          </div>
        </div>     
        <div className="card" style={{marginTop: 20, maxWidth: 400}}>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{`${customer.name} ${customer.last_name}`}</li>
            <li className="list-group-item">{`${customer.email}`}</li>
            <li className="list-group-item">{`${customer.phone}`}</li>
            <li className="list-group-item">{`${customer.date_of_birth}`}</li>
            <li className="list-group-item">{`${customer.gender}`}</li>
          </ul>
        </div> 
        <div className="flex">
          <div>
            <Accounts data={customer.debitAccounts} type="debit" />
          </div>
          <div>
            <Accounts data={customer.creditAccounts} type="credit" />
          </div>
        </div>
      </div>

      <div style={{width: 400}}>
        <FormAccount />
        <FormTransaction data={customer} />
      </div>      
    </div>
    : null
  );
}


const Components = {
  Login,
  SignUp,
  Dashboard
}

function FormAccount() {
  const [data, setData] = useState({
    name: '',
    type: 'debit'
  });

  const [createAccount, {}] = useMutation(MUTATION_ACCOUNT, {
    onError: (e) => {console.log(e)},
    onCompleted: (data) => {
      // reload
    },
    refetchQueries: [{
      query: QUERY_CUSTOMER
    }]
  });

  return (
    <div className="form">
      <h3>Create new account</h3>
      <div className="form-group">
        <label htmlFor="inputAccountName">Account Name</label>
        <input type="text" className="form-control" id="inputAccountName" placeholder="Account Name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
      </div>
      <div className="form-group">
        <label htmlFor="inputAccountType">Type</label>
        <select className="form-control" id="inputAccountType" value={data.type} onChange={(e) => setData({...data, type: e.target.value})}>
          <option value="debit">debit</option>
          <option value="credit">credit</option>
        </select>
      </div>
      <div className="flex-center">
        <button className="btn btn-success" onClick={() => createAccount({variables: {...data}})}>Create</button>
      </div>
    </div>
  );
}

function FormTransaction(props) {
  const [data, setData] = useState({
    account: '',
    amount: 0,
    description: ''
  });

  const [createTransaction, {}] = useMutation(MUTATION_TRANSACTION, {
    onError: (e) => {console.log(e)},
    onCompleted: (data) => {
      // reload
    },
    refetchQueries: [{
      query: QUERY_CUSTOMER
    }]
  });

  return (
    <div className="form">
      <h3>Add new transaction</h3>
      <div className="form-group">
        <label htmlFor="inputTrDesc">Description</label>
        <input type="text" className="form-control" id="inputTrDesc" placeholder="Description" value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
      </div>
      <div className="form-group">
        <label htmlFor="inputTrAmount">Amount</label>
        <input type="number" className="form-control" id="inputTrAmount" placeholder="Amount" value={data.amount} onChange={(e) => setData({...data, amount: parseInt(e.target.value)})}/>
      </div>
      <div className="form-group">
        <label htmlFor="inputAccountType">Account</label>
        <select className="form-control" id="inputAccountType" value={data.account} onChange={(e) => setData({...data, account: e.target.value})}>
          <option value="">None</option>
          <optgroup label="Debit Accounts">
          {props.data.debitAccounts.map((acc, index) => (
            <option key={index} value={acc.id}>{acc.accn}</option>
          ))}
          </optgroup>
          <optgroup label="Credit Accounts">
          {props.data.creditAccounts.map((acc, index) => (
            <option key={index} value={acc.id}>{acc.accn}</option>
          ))}
          </optgroup>
        </select>
      </div>
      <div className="flex-center">
        <button className="btn btn-success" onClick={() => createTransaction({variables: {...data}})}>Add</button>
      </div>
    </div>
  );
}

function App() {

  const [component, setComponent] = useState('Login');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) setComponent('Dashboard');
    setLoading(false);
  }, []);

  const Component = Components[component];

  return (
    loading? <div className="screen flex-center"><h4>Loading...</h4></div> : 
    <ApolloProvider client={client}>
      <AppContext.Provider value={{
        setComponent
      }}>
        <div className="screen">
          <Component />
          {(component === 'Login' ? <div className="flex-center"><button type="button" className="btn btn-link" onClick={(e) => {e.preventDefault(); setComponent('SignUp');}}>Sign up</button></div> : null)}
          {(component === 'SignUp' ? <div className="flex-center"><button type="button" className="btn btn-link" onClick={(e) => {e.preventDefault(); setComponent('Login');}}>Login</button></div> : null)}
        </div>
      </AppContext.Provider>
    </ApolloProvider>
  );
}

export default App;
