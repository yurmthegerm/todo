import './App.css';
import { useState } from 'react';

function Header(props) {
  return <header>
		<h1><a href="/" className='header-link' onClick={(event)=>{
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
				props.onChangeMode(Number(event.target.id));
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

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
			<p><textarea name="body" placeholder="body"></textarea></p>
			<p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props){
	const [title, setTitle] = useState(props.title);
	const [body, setBody] = useState(props.body);
	return <article>
		<h2>Update</h2>
		<form onSubmit={(event)=>{
			event.preventDefault();
			const title = event.target.title.value;
			const body = event.target.body.value;
			props.onUpdate(title, body);
		}}>
			<p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
				setTitle(event.target.value);
			}}/></p>
			<p><textarea name="body" placeholder="body" value={body} onChange={event=>{
				setBody(event.target.value);
			}}></textarea></p>
			<p><input type="submit" value="Update"></input></p>
		</form>
	</article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4)
  const [topics, setTopics] = useState([
    {id:1, title:'title', body:'body ...'},
    {id:2, title:'title 2', body:'body 2 ...'},
    {id:3, title:'title 3', body:'body 3 ...'}
  ])

  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title='Welcome' body='Hello, WEB'></Article>
  } else if (mode === 'READ') {
    let title, body = null;
			for (let i = 0; i < topics.length; i++) {
				if (topics[i].id === id){
					title = topics[i].title;
					body = topics[i].body;
				}
			}
		content = <Article title={title} body={body}></Article>
    contextControl = <>
      <button className='update' href={'/update/'+id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>UPDATE</button>
      <input className='delete' type="button" value="Delete" onClick={()=>{
				const newTopics = [];
				for (let i=0; i<topics.length; i++) {
					if(topics[i].id !== id) {
						newTopics.push(topics[i]);
					}
				}
				setTopics(newTopics);
				setMode('WELCOME');
			}}/>
    </>
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i=0; i<topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
		content = <Update title={title} body={body} onUpdate={(title, body)=>{
			const newTopics = [...topics]
			const updatedTopic = {id:id, title:title, body:body}
			for(let i=0; i < newTopics.length; i++){
				if(newTopics[i].id === id){
					newTopics[i] = updatedTopic;
					break;
				}
			}
			setTopics(newTopics);
			setMode('READ');
		}}></Update>
	}

  return (
    <div className='screen'>

      <Header title='To Do' onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>

      <div className='divide'>
        <div className='left'>
          <Nav topics={topics} onChangeMode={_id=>{
            setMode('READ');
            setId(_id);
          }}></Nav>
        </div>
        <div className='right'>
          {content}
        </div>
      </div>
      
      <div className='buttons'>
        <ul>
          <button className='create' href='/create' onClick={event => {
          event.preventDefault();
          setMode('CREATE');
          }}>CREATE</button>
          
          {contextControl}
        </ul>
      </div>
    </div>
  );
}

export default App;
