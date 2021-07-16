import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

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

  return (
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            {propriedades.title} ({propriedades.items.length})
        </h2>
        {/* <ul>
          {propriedades.items.map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={`https://github.com/${itemAtual.avatar_url}.png`}>
                  <img src={itemAtual.avatar_url} /> 
                  <span>{itemAtual}</span>
                </a>
              </li>
            )
          })}
        </ul> */}
        </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {

  const usuarioAleatorio = 'FabricioCruzz';
  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades = comunidades[0];
  // const alteradorDeComunidades/setComunidades = comunidades[1];
  
  // console.log('Nosso teste', );
  // const comunidades = [`Alurakut`]
  
  const pessoasFavoritas = [ 

    'omariosouto', 
    'peas', 
    'juunegreiros', 
    'rafaballerini', 
    'marcobrunodev',
    'felipefialho',
  ]
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function(){
    // GET
    fetch('https://api.github.com/users/FabricioCruzz/followers')
    .then(function (respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta){
      setSeguidores(respostaCompleta);
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
      }` })
    })
    
    // Jeitos de escrever uma function:
    
    //Jeito comum:
    //funtion (response) {
    // return reponse json()
    // }

    // Jeito 2:
    // (Response) => Response.json()

    //Jeito 3:
    // (Response) => {
    //   console.log(respostaCompleta)

    // }

    .then((response) => response.json()) // Pega o retorno da Response.json() e já retorna 
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log("Comunidades Vindas do DATO:" + comunidadesVindasDoDato)
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
        <ProfileSidebar githubUser={usuarioAleatorio} />
      </div>
      
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem vindo(a), {usuarioAleatorio}
          </h1>
          <OrkutNostalgicIconSet
            recados={getNumberRandom(1, 100)}
            fotos={getNumberRandom(1, 100)}
            videos={getNumberRandom(1, 100)}
            fas={getNumberRandom(1, 100)}
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
      </div>

      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>    
      <ProfileRelationsBox title="Seguidores" items={seguidores} />

        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
            Comunidades ({comunidades.length})
        </h2>
        <ul>
          {comunidades.map((itemAtual) => {
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
        </ProfileRelationsBoxWrapper>
  
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Amigos ({pessoasFavoritas.length})
          </h2>

          <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>

      </div>

    </MainGrid>
  </>
  )
}
