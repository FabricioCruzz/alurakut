import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { RecadosBoxWrapper } from '../src/components/Recados';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  console.log("Propriedades length: ", propriedades.items);
  return (
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            {propriedades.title} ({propriedades.items.length}) {/* TODO: DESCOBRIR PQ O LIMITE DE SEGUIDORES VAI ATÉ 30------> É POR CAUSA DA API DO GITHUB QUE POR PADRÃO TRAZ 30 
            POR PÁGINA (O MÁXIMO É DE 100 POR PAGINA) ------> USAR DEPOIS DE https:/blablabla/followers?per_page=100*/}
        </h2>

        <ul>
          {(propriedades.items).slice(0, 6).map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={itemAtual.html_url}>
                  <img src={itemAtual.avatar_url} /> 
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <hr />
        <p>
          <a className="boxLink" href={`/amigos`} >
            Ver todos
          </a>
        </p>
        </ProfileRelationsBoxWrapper>
  )
}

function RecadosBox(props){

  console.log('Props: ', props);

  return (
    <RecadosBoxWrapper>
      <h2 className='subTitle'>
            {props.title}
      </h2>

          <ul>
            {(props.items).map((itemAtual) => {
              console.log('itemAtual 222: ', itemAtual);
              return (
                <li key={itemAtual.id}>
                  <a href={`https://github.com/${itemAtual.from}`}>
                   <img src={`https://github.com/${itemAtual.from}.png`} style={{ borderRadius: '90px' }} />
                  </a>
                  <div> {itemAtual.from} diz:
                    <p>{itemAtual.message} </p>
                  </div>
                </li>
              )
            })}
          </ul>
    </RecadosBoxWrapper>
  )

}

export default function Home(props) {

  const userGithub = props.githubUser;
  const [recados, setRecados] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([]);
  const [seguindo, setSeguindo] = React.useState([]);
  React.useEffect(function(){
    // GET
    const urlUserFollowers = `https://api.github.com/users/${ userGithub }/followers`;
    fetch(urlUserFollowers)
    .then(async function (respostaDoServidor){
      return await respostaDoServidor.json();
    })
    .then(function(respostaCompleta){
      setSeguidores(respostaCompleta);
    })

    const urlUserFollowing = `https://api.github.com/users/${ userGithub }/following`;
    fetch(urlUserFollowing)
    .then((respostaDoServidor) =>{
      return respostaDoServidor.json();
    })
    .then((respostaCompleta) => {
      setSeguindo(respostaCompleta);
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'e837e7b952b9310d188da15919cdf0',
        'Content-Type': 'aplication/json',
        'Accept': 'aplication/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
        allScraps {
          id
          from
          message
        }
      }` })
    })

    .then((response) => response.json()) // Pega o retorno da Response.json() e já retorna 
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      const recadosVindosDoDato = respostaCompleta.data.allScraps;
      console.log("Comunidades Vindas do DATO:" + comunidadesVindasDoDato)
      console.log("Recados Vindos do DATO:" + recadosVindosDoDato)
      setRecados(recadosVindosDoDato)
      setComunidades(comunidadesVindasDoDato)

    })
  }, [])

  console.log('seguidores antes do return', seguidores)

  function getNumberRandom(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min);
  }

  return (

    <>
    <AlurakutMenu />
    <MainGrid>

      {/* <Box style="grid-area: profileArea;"> */}

      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSidebar githubUser={userGithub} />
      </div>
      
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem vindo(a), {userGithub}
          </h1>
          <OrkutNostalgicIconSet
            recados={recados.length}
            fotos={getNumberRandom(1, 100)}
            videos={getNumberRandom(1, 100)}
            fas={seguidores.length}
            mensagens={getNumberRandom(1, 100)}
            confiavel={getNumberRandom(1, 3)}
            legal={getNumberRandom(1, 3)}
            amigavel={getNumberRandom(1, 3)}
          />
        </Box>

        <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log('Campo: ', dadosDoForm.get('title'));
                console.log('Campo: ', dadosDoForm.get('image'));

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: usuarioAleatorio,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log('Dados:' + dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>

          <Box>
            <h2 className="subTitle"> Deixe uma mensagem para { userGithub }</h2>
            <form onSubmit={function handleCriaRecados(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('from'));
              console.log('Campo: ', dadosDoForm.get('message'));

              const recado = {
                // TODO: COLOCAR UMA CHECAGEM PRA SABER SE O USUARIO COLOCADO REALMENTE EXISTE
                from: dadosDoForm.get('from'),
                message: dadosDoForm.get('message')
              }

              fetch('./api/recados', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(recado)
              })
              .then(async(response) => {
                const dados = await response.json();
                const recado = dados.registroCriado;
                const recadosAtualizados = [...recados, recado];
                setRecados(recadosAtualizados)
              })

            }}> 
            <div>
              <input
                placeholder="De: "
                name="from"
                aria-label="De: "
                type="text"
              />
            </div>
              <input
                placeholder="Digite sua mensagem..."
                name="message"
                aria-label="Digite sua mensagem..."
                type="text"
              />
              <button>
                Enviar Recado
              </button>
            </form>
          </Box>
      
      <RecadosBox title="Recados" items={recados}/>

      </div>
      {console.log('Recados 111:', recados)}


       {/* Área dos Seguidores      */}
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>    
      <ProfileRelationsBox title="Seguidores" items={seguidores} />

      <ProfileRelationsBox title="Seguindo" items={seguindo} />

      
        {/* Área das Comunidades */}
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidades ({comunidades.length})
        </h2>
        <ul>
          {comunidades.slice(0, 6).map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={`/users/${itemAtual.title}`}>
                  <img src={itemAtual.imageUrl} /> 
                  <span>{itemAtual.title}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <hr />
        <p>
          <a className="boxLink" href={`/comunidades`}>
            Ver todas
          </a>
        </p>
        </ProfileRelationsBoxWrapper> 

      </div>

    </MainGrid>
  </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser;
  
  if(!githubUser){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  
  // const followers = await fetch(`https://api.github.com/users/${githubUser}/followers`)
  //   .then((res) => res.json())
  //   .then(followers => followers.map((follower) => ({
  //     id: follower.id,
  //     name: follower.login,
  //     image: follower.avatar_url,
  //   })));


  // const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
  //   headers: {
  //     Authorization: token
  //   }
  // })
  // .then((resposta) => resposta.json())


  // if(!isAuthenticated){
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     }
  //   }
  // }
  
  // const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
