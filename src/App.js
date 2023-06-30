import logo from './logo.svg';
import './App.css';

function Header(props) {
  return <header>
    <h1><a href='/'>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lst = []
  for (let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lst.push(<li key={t.id}><a href={'/read/'+t.id}>{t.title}</a></li>)
  }
  return <nav>
    <ol>
      {lst}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function App() {
  const topics = [
    {id:1, title:'title', body:'body ...'}
  ]
  return (
    <div>
      <Header title='REACT'></Header>
      <Nav topics={topics}></Nav>
      <Article title='Welcome' body='Hello, WEB'></Article>
    </div>
  );
}

export default App;
