import React from 'react';
// Hook do NextJS
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('');
  const SobreOrkutUrl = "https://www.orkut.br.com/sobre"; 
  const centroSeguracaUrl = "https://www.orkut.br.com/seguranca";
  const privacidadeUrl = "https://www.orkut.br.com/privacidade";
  const termosUrl = "https://www.orkut.br.com/termos";
  const contatoUrl = "https://www.orkut.br.com/contato";
  
  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(infosDoEvento) => {
                infosDoEvento.preventDefault();
                // alert('Alguém clicou no botão!')
                console.log('Usuário: ', githubUser)
                fetch('https://alurakut.vercel.app/api/login', {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json'  
                    },
                    body: JSON.stringify({ githubUser: githubUser })
                })
                .then(async (respostaDoServer) => {
                    const dadosDaResposta = await respostaDoServer.json()
                    const token = dadosDaResposta.token;
                    nookies.set(null, 'USER_TOKEN', token, {
                        path: '/',
                        maxAge: 86400 * 7 
                    })
                    router.push('/')
                })
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input
                placeholder="Usuário"
                value={githubUser}
                onChange={(evento) => {
                    setGithubUser(evento.target.value)
                }}
            />
            {githubUser.length === 0
                ? 'Preencha o campo'
                : ''
            }
            <button type="submit">
              Login
            </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  CADASTRE-SE AGORA!
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
              
            © 2021 alura.com.br - <a href={SobreOrkutUrl}>Sobre o Orkut.br</a> - <a href={centroSeguracaUrl}>Centro de segurança</a> - <a href={privacidadeUrl}>Privacidade</a> - <a href={termosUrl}>Termos</a> - <a href={contatoUrl}>Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
} 