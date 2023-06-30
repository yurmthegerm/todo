import logo from './logo.svg';
import './App.css';

function Header(props) {
  return <header>
    <h1><a href='/' onClick={event=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const lst = props.topics.map(topic =>
		<li key={topic.id}>
      <a id={topic.id} href={'/read/'+topic.id} onClick={event => {
        event.preventDefault();
        props.onChangeMode(event.target.id);
      }}>{topic.title}</a></li>
	);
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
      <Header title='REACT' onChangeMode={()=>{
        alert('Header');
      }}></Header>
      <Nav topics={topics} onChangeMode={id=>{
        alert(id);
      }}></Nav>
      <Article title='Welcome' body='Hello, WEB'></Article>
    </div>
  );
}

export default App;
