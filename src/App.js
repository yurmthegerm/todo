import './App.css';
import { useState, useEffect } from 'react';

function Header(props) {
  return <div>
		<h1><a href="/" className='header' onClick={(event)=>{
			event.preventDefault();
			props.onChangeMode();
		}}>{props.title}</a></h1>
	</div>
}

function Nav(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const lst = props.topics.map((topic) => {
    let displayTitle = topic.title;
    if (topic.title.length > 0) {
      if (topic.title.length > 4 && windowWidth <= 600) {
        const nextParagraphIndex = topic.title.indexOf('\n', 4);
        if (nextParagraphIndex > 0) {
          displayTitle = topic.title.slice(0, nextParagraphIndex) + "...";
        } else {
          displayTitle = topic.title.slice(0, 4) + "...";
        }
      } else if (topic.title.length > 6 && windowWidth <= 1000) { // 스크린 너비가 600px 이하인 경우에만 생략 부호 표시
        const nextParagraphIndex = topic.title.indexOf('\n', 6);
        if (nextParagraphIndex > 0) {
          displayTitle = topic.title.slice(0, nextParagraphIndex) + "...";
        } else {
          displayTitle = topic.title.slice(0, 6) + "...";
        }
      } else if (topic.title.length > 11 && windowWidth <= 1500) {
        const nextParagraphIndex = topic.title.indexOf('\n', 11);
          if (nextParagraphIndex > 0) {
            displayTitle = topic.title.slice(0, nextParagraphIndex) + "...";
          } else {
            displayTitle = topic.title.slice(0, 11) + "...";
          }
      } else if (topic.title.length > 15 && windowWidth <= 1800) {
        const nextParagraphIndex = topic.title.indexOf('\n', 15);
          if (nextParagraphIndex > 0) {
            displayTitle = topic.title.slice(0, nextParagraphIndex) + "...";
          } else {
            displayTitle = topic.title.slice(0, 15) + "...";
          }
      }
    } else {
      if (windowWidth <= 600) {
        displayTitle = "(no ...";
      } else {
        displayTitle = "(no title)";
      }
      
    }

    return (
      <li key={topic.id}>
        <a
          id={topic.id}
          href={"/read/" + topic.id}
          title={topic.title}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}
        >
          {displayTitle}
        </a>
      </li>
    );
  });

  return (
    <nav>
      <ol className="topics">{lst}</ol>
    </nav>
  );
}


function Article(props) {
  return <article>
    <h2 className='detailed-title'>{props.title}</h2>
    <p className='detailed-body'>{props.body}</p>
  </article>
}

function Create(props) {
  return <article>
    <h2>heading for new</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input className='title' type="text" name="title" placeholder="title" maxLength="21"/></p>
			<p><textarea className='body' name="body" placeholder="body"></textarea></p>
			<p><input className='create' type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props){
	const [title, setTitle] = useState(props.title);
	const [body, setBody] = useState(props.body);
	return <article>
		<form onSubmit={(event)=>{
			event.preventDefault();
			const title = event.target.title.value;
			const body = event.target.body.value;
			props.onUpdate(title, body);
		}}>
			<p><input className='title' type="text" name="title" placeholder="title" value={title} maxLength="21" onChange={event=>{
				setTitle(event.target.value);
			}}/></p>
			<p><textarea className='body' name="body" placeholder="body" value={body} onChange={event=>{
				setBody(event.target.value);
			}}></textarea></p>
			<p><input className='save-changes' type="submit" value="Save Changes"></input></p>
		</form>
	</article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [topics, setTopics] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    const newTopics = [];
    for (let i=0; i<topics.length; i++) {
      if(topics[i].id !== id) {
        newTopics.push(topics[i]);
      }
    }
    setTopics(newTopics);
    setMode('WELCOME');
  };
    
  const handleModalCancel = () => {
    setShowModal(false);
  };

  let content = null;
  let contextControl = null;
  if (mode === 'WELCOME') {
    content = <Article title='Welcome' body='Hello, WEB'></Article>
  } else if (mode === 'READ') {
    let title, body = null;
			for (let i = 0; i < topics.length; i++) {
				if (topics[i].id === id){
					title = topics[i].title.length > 0 ? topics[i].title : '(no title)';
					body = topics[i].body.length > 0 ? topics[i].body : '(no body)';
				}
			}
		content = <Article title={title} body={body}></Article>
    contextControl = <div className='contextControl'>
      <button className='edit' href={'/update/'+id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Edit</button>
      <div>
        <input className='delete' type="button" value="Delete" onClick={handleDeleteClick}/>
        {showModal && (
          <div className="modal-container">
            <div className='modal-box'>
              <p>{'Delete ' + title + '?'}</p>
              <div className="modal-buttons">
                <button onClick={handleModalConfirm}>확인</button>
                <button onClick={handleModalCancel}>취소</button>
              </div>
            </div>
          </div>
        )}
        {showModal && <div className='modal-backdrop' onClick={handleModalCancel} />}
      </div>
    </div>
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

      <div className='heading'>
        <Header title='header' onChangeMode={()=>{
          setMode('WELCOME');
        }}></Header>
      </div>

      <div className='content'>
        <div className='left'>
          <div className='buttons'>
            <button className='new' href='/create' onClick={event => {
              event.preventDefault();
              setMode('CREATE');
          }}>New</button>
          </div>

          <div className='lst'>
            <Nav topics={topics} onChangeMode={_id=>{
              setMode('READ'); 
              setId(_id);
            }}></Nav>
          </div>
        </div>
        <div className='right'>
          <div className='buttons'>
            {contextControl} 
          </div> 
          {content}
        </div>
      </div>
      
    </div>
  );
}

export default App;